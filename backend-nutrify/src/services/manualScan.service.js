import { GoogleGenerativeAI } from "@google/generative-ai";
import { findBestFoodMatch } from "./csv.service.js";

// Helper to retry Gemini calls on transient errors
const generateContentWithRetry = async (model, prompt, retries = 2, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      const isTransient =
        error.status === 503 ||
        error.status === 429 ||
        error.message?.includes("503") ||
        error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("high demand");

      if (isTransient && i < retries - 1) {
        console.warn(
          `Gemini API transient error. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      } else {
        throw error;
      }
    }
  }
};

// --- LOCAL PARSING FALLBACK ENGINE ---
const parseInputLocally = (userInput) => {
  const items = userInput.split(/[,;\n]+/).map(item => item.trim()).filter(Boolean);
  const parsed = [];

  for (const item of items) {
    const numberRegex = /(\d+\/\d+|\d+[\.,]\d+|\d+)/;
    const matchNum = item.match(numberRegex);
    
    let quantity = 1.0;
    let unit = "porsi";
    let foodQuery = item;

    if (matchNum) {
      const numStr = matchNum[0];
      if (numStr.includes("/")) {
        const [num, den] = numStr.split("/");
        quantity = parseFloat(num) / parseFloat(den);
      } else {
        quantity = parseFloat(numStr.replace(",", "."));
      }

      const index = item.indexOf(numStr);
      const before = item.slice(0, index).trim();
      const after = item.slice(index + numStr.length).trim();
      
      const units = ["porsi", "potong", "butir", "mangkok", "mangkuk", "sendok makan", "sendok teh", "sendok", "sdm", "sdt", "gelas", "gram", "gr", "g"];
      
      let foundUnit = "";
      for (const u of units) {
        if (after.toLowerCase().startsWith(u) || after.toLowerCase().endsWith(u)) {
          foundUnit = u;
          break;
        }
        if (before.toLowerCase().startsWith(u) || before.toLowerCase().endsWith(u)) {
          foundUnit = u;
          break;
        }
      }

      unit = foundUnit || "porsi";
      
      let cleanText = item.replace(numStr, "");
      if (foundUnit) {
        cleanText = cleanText.replace(new RegExp(foundUnit, "gi"), "");
      }
      foodQuery = cleanText.replace(/[\s\-\(\)]+/g, " ").trim();
    }

    parsed.push({
      original_input: item,
      food_name: foodQuery || item,
      quantity,
      unit,
    });
  }

  return parsed;
};

const estimateWeightLocally = (foodName, unit, quantity) => {
  const nameLower = foodName.toLowerCase();
  const unitLower = unit.toLowerCase();

  if (["gram", "gr", "g"].includes(unitLower)) {
    return quantity;
  }

  let baseWeight = 100;

  if (nameLower.includes("nasi") || nameLower.includes("mie") || nameLower.includes("bihun") || nameLower.includes("kwetiau")) {
    baseWeight = 150;
  } else if (nameLower.includes("ayam") || nameLower.includes("daging") || nameLower.includes("sapi") || nameLower.includes("ikan") || nameLower.includes("kambing") || nameLower.includes("bebek")) {
    baseWeight = 80;
  } else if (nameLower.includes("telur")) {
    baseWeight = 55;
  } else if (nameLower.includes("tempe") || nameLower.includes("tahu")) {
    baseWeight = 40;
  } else if (nameLower.includes("sayur") || nameLower.includes("bayam") || nameLower.includes("kangkung") || nameLower.includes("buncis") || nameLower.includes("sop") || nameLower.includes("soto")) {
    baseWeight = 100;
  } else if (nameLower.includes("sambal") || nameLower.includes("saus") || nameLower.includes("kecap") || nameLower.includes("mentega") || nameLower.includes("minyak")) {
    baseWeight = 15;
  }

  return baseWeight * quantity;
};

const generateRecommendationLocally = (details, totalNutrition, userDisease = "") => {
  const diseaseClean = userDisease.toLowerCase().trim();
  const foodsList = details.map(d => d.food_name).join(", ");
  
  let warning = "";
  let recommendation = "";

  if (diseaseClean.includes("diabetes")) {
    const sugar = totalNutrition.sugar;
    const carbs = totalNutrition.carbohydrates;
    const issues = [];
    if (sugar >= 15) issues.push(`kandungan gula (${sugar.toFixed(1)}g) sangat tinggi`);
    else if (sugar >= 8) issues.push(`kandungan gula (${sugar.toFixed(1)}g) cukup tinggi`);
    if (carbs >= 80) issues.push(`karbohidrat (${carbs.toFixed(1)}g) tergolong sangat tinggi`);
    else if (carbs >= 40) issues.push(`karbohidrat (${carbs.toFixed(1)}g) cukup tinggi`);

    if (issues.length > 0) {
      warning = `Peringatan Diabetes: Menu ini mengandung ${issues.join(" dan ")} yang dapat memicu kenaikan gula darah harian Anda.`;
      recommendation = `Untuk kondisi diabetes Anda, disarankan untuk membatasi porsi atau mencari opsi karbohidrat kompleks (seperti nasi merah) serta kurangi asupan makanan manis.`;
    } else {
      recommendation = `Pilihan makanan ini relatif aman bagi penderita diabetes. Tetap kendalikan porsi konsumsi agar gula darah Anda tetap stabil.`;
    }
  } else if (diseaseClean.includes("hipertensi")) {
    const sodium = totalNutrition.sodium;
    if (sodium >= 600) {
      warning = `Peringatan Hipertensi: Kandungan sodium (${sodium.toFixed(0)}mg) sangat tinggi (batas aman WHO adalah 2000mg/hari).`;
      recommendation = `Hindari makanan tinggi garam, saus berlebih, atau sambal asin. Perbanyak minum air putih dan pilih makanan segar/tanpa olahan berlebih.`;
    } else if (sodium >= 400) {
      warning = `Peringatan Hipertensi: Kandungan sodium (${sodium.toFixed(0)}mg) cukup tinggi.`;
      recommendation = `Batasi konsumsi garam tambahan hari ini untuk menjaga tekanan darah Anda tetap stabil.`;
    } else {
      recommendation = `Kandungan sodium makanan ini aman bagi penderita hipertensi. Tetap jaga pola makan rendah garam harian Anda.`;
    }
  } else if (diseaseClean.includes("kolesterol") || diseaseClean.includes("jantung")) {
    const fat = totalNutrition.fat;
    if (fat >= 25) {
      warning = `Peringatan Kolesterol: Kandungan lemak total (${fat.toFixed(1)}g) sangat tinggi.`;
      recommendation = `Batasi makanan gorengan atau olahan bersantan kental. Pilih metode memasak direbus, dipanggang, atau dikukus.`;
    } else if (fat >= 15) {
      warning = `Peringatan Kolesterol: Kandungan lemak (${fat.toFixed(1)}g) cukup tinggi.`;
      recommendation = `Kurangi porsi lauk yang digoreng dan imbangi dengan konsumsi sayuran kaya serat untuk membantu mengikat lemak.`;
    } else {
      recommendation = `Makanan ini memiliki kandungan lemak yang aman untuk kesehatan jantung dan tingkat kolesterol Anda.`;
    }
  } else if (diseaseClean.includes("asam urat") || diseaseClean.includes("asam_urat")) {
    const protein = totalNutrition.protein;
    const hasPurin = foodsList.toLowerCase().match(/(daging|sate|seafood|udang|kerang|jeroan|hati|usus|emping|kol)/g);
    if (hasPurin) {
      warning = `Peringatan Asam Urat: Makanan ini berpotensi tinggi purin karena mengandung bahan sensitif.`;
      recommendation = `Kurangi frekuensi konsumsi protein hewani berlebih atau sayuran tinggi purin. Minum banyak air putih untuk membantu membuang asam urat.`;
    } else {
      recommendation = `Makanan ini aman untuk kondisi asam urat Anda. Pastikan tetap menjaga hidrasi tubuh dengan baik.`;
    }
  } else {
    const cal = totalNutrition.calories;
    if (cal >= 600) {
      warning = "Porsi ini mengandung kalori tinggi, harap konsumsi secara bijak.";
      recommendation = "Imbangi dengan aktivitas fisik harian dan pilih air putih sebagai minuman pendamping.";
    } else {
      recommendation = "Makanan ini cukup seimbang untuk kebutuhan energi Anda. Lakukan variasi menu agar gizi harian terpenuhi.";
    }
  }

  return { recommendation, warning };
};

const runLocalFuzzyAnalysis = (parsedItems, userDisease = "") => {
  console.log("Running local parsing & fuzzy matching fallback...");
  const matchedDetails = [];
  const totalNutrition = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    sugar: 0,
    sodium: 0,
    fiber: 0,
  };

  for (const item of parsedItems) {
    const csvFood = findBestFoodMatch(item.food_name);
    if (csvFood) {
      const estimated_weight_g = estimateWeightLocally(item.food_name, item.unit, item.quantity);
      const multiplier = estimated_weight_g / 100;
      
      const itemNutrition = {
        calories: (csvFood.calories || 0) * multiplier,
        protein: (csvFood.protein || 0) * multiplier,
        fat: (csvFood.fat || 0) * multiplier,
        carbohydrates: (csvFood.carbohydrates || 0) * multiplier,
        sugar: (csvFood.sugar || 0) * multiplier,
        sodium: (csvFood.sodium || 0) * multiplier,
        fiber: (csvFood.fiber || 0) * multiplier,
      };

      totalNutrition.calories += itemNutrition.calories;
      totalNutrition.protein += itemNutrition.protein;
      totalNutrition.fat += itemNutrition.fat;
      totalNutrition.carbohydrates += itemNutrition.carbohydrates;
      totalNutrition.sugar += itemNutrition.sugar;
      totalNutrition.sodium += itemNutrition.sodium;
      totalNutrition.fiber += itemNutrition.fiber;

      matchedDetails.push({
        food_name: csvFood.food_name,
        original_input: item.original_input,
        quantity: item.quantity,
        unit: item.unit,
        estimated_weight_g,
        nutrition: itemNutrition,
      });
    } else {
      console.warn(`No match found in CSV locally for: ${item.food_name}`);
    }
  }

  const { recommendation, warning } = generateRecommendationLocally(matchedDetails, totalNutrition, userDisease);

  return {
    success: true,
    best_prediction: {
      food_name: matchedDetails.map(d => d.food_name).join(", "),
      confidence_score: 1.0,
    },
    nutrition: totalNutrition,
    recommendation,
    warning,
    details: matchedDetails,
  };
};

export const analyzeManualInput = async (userInput, userDisease = "") => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
Anda adalah asisten AI gizi Indonesia. Tugas Anda adalah menganalisis input teks makanan dari user, memecahnya menjadi item-item makanan terpisah, dan mengestimasi porsi dalam gram.

Teks Input User: "${userInput}"

Tugas Anda:
1. Temukan makanan apa saja yang disebutkan dalam teks input user.
2. Tentukan nama makanan standar untuk setiap item (contoh: "nasi putih", "ayam goreng", "bayam").
3. Estimasi porsi/jumlah makanan tersebut ke dalam satuan gram ("estimated_weight_g"). Gunakan panduan porsi umum makanan Indonesia jika tidak ditentukan (misal: 1 porsi nasi putih = 150g, 1 potong ayam goreng = 80g, 1 sendok makan = 15g, 1 butir telur = 50g, 1 mangkuk sayur = 100g, 1/2 porsi = setengah dari berat standar, dll.). Jika user menuliskan berat langsung (misal: "100 gram" atau "100g"), gunakan nilai tersebut.
4. Tentukan unit porsi asli dari teks (misal: "porsi", "potong", "butir", "sendok makan", dll.) dan quantity (angka pengalinya, misal: 1, 0.5, 2).

Format Output harus berupa JSON Array dengan objek-objek berikut:
[
  {
    "original_input": "nama makanan dan porsi asli dari input user",
    "food_name": "nama makanan standar dalam bahasa indonesia",
    "quantity": 1.0,
    "unit": "unit porsi asli",
    "estimated_weight_g": 150
  }
]

Hanya kembalikan JSON array tersebut. Jangan menambahkan penjelasan lain.
`;

    const result = await generateContentWithRetry(model, prompt);
    const responseText = result.response.text();
    console.log("Gemini Manual Parse Response:", responseText);

    const parsedItems = JSON.parse(responseText.trim());
    if (!Array.isArray(parsedItems)) {
      throw new Error("Invalid response format from Gemini.");
    }

    const matchedDetails = [];
    const totalNutrition = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      sugar: 0,
      sodium: 0,
      fiber: 0,
    };

    for (const item of parsedItems) {
      const csvFood = findBestFoodMatch(item.food_name);
      if (csvFood) {
        const multiplier = item.estimated_weight_g / 100;
        
        const itemNutrition = {
          calories: (csvFood.calories || 0) * multiplier,
          protein: (csvFood.protein || 0) * multiplier,
          fat: (csvFood.fat || 0) * multiplier,
          carbohydrates: (csvFood.carbohydrates || 0) * multiplier,
          sugar: (csvFood.sugar || 0) * multiplier,
          sodium: (csvFood.sodium || 0) * multiplier,
          fiber: (csvFood.fiber || 0) * multiplier,
        };

        totalNutrition.calories += itemNutrition.calories;
        totalNutrition.protein += itemNutrition.protein;
        totalNutrition.fat += itemNutrition.fat;
        totalNutrition.carbohydrates += itemNutrition.carbohydrates;
        totalNutrition.sugar += itemNutrition.sugar;
        totalNutrition.sodium += itemNutrition.sodium;
        totalNutrition.fiber += itemNutrition.fiber;

        matchedDetails.push({
          food_name: csvFood.food_name,
          original_input: item.original_input,
          quantity: item.quantity,
          unit: item.unit,
          estimated_weight_g: item.estimated_weight_g,
          nutrition: itemNutrition,
        });
      } else {
        console.warn(`No match found in CSV for: ${item.food_name}`);
      }
    }

    const diseasePrompt = userDisease ? `dan kondisi penyakit pengguna: ${userDisease}` : "";
    const summaryPrompt = `
Kami memiliki hasil analisis makanan berikut:
Makanan yang dikonsumsi: ${matchedDetails.map(d => `${d.food_name} (${d.estimated_weight_g}g)`).join(", ")}
Nutrisi Total:
- Kalori: ${totalNutrition.calories.toFixed(1)} kkal
- Protein: ${totalNutrition.protein.toFixed(1)} g
- Lemak: ${totalNutrition.fat.toFixed(1)} g
- Karbohidrat: ${totalNutrition.carbohydrates.toFixed(1)} g
- Serat: ${totalNutrition.fiber.toFixed(1)} g
- Gula: ${totalNutrition.sugar.toFixed(1)} g
- Sodium: ${totalNutrition.sodium.toFixed(1)} mg
${diseasePrompt}

Tugas Anda:
1. Berikan rekomendasi singkat (max 2 kalimat) tentang makanan ini bagi pengguna.
2. Berikan warning/peringatan (max 1 kalimat) jika ada kandungan yang berlebihan (misal kalori tinggi, lemak tinggi, sodium tinggi, atau tidak ramah bagi penyakitnya).

Format output harus berupa JSON objek:
{
  "recommendation": "Rekomendasi Anda di sini",
  "warning": "Warning Anda di sini (kosongkan jika tidak ada)"
}
`;

    const summaryModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const summaryResult = await generateContentWithRetry(summaryModel, summaryPrompt);
    const summaryResponse = JSON.parse(summaryResult.response.text().trim());

    return {
      success: true,
      best_prediction: {
        food_name: matchedDetails.map(d => d.food_name).join(", "),
        confidence_score: 1.0,
      },
      nutrition: totalNutrition,
      recommendation: summaryResponse.recommendation || "Konsumsi makanan dalam porsi seimbang.",
      warning: summaryResponse.warning || "",
      details: matchedDetails,
    };
  } catch (error) {
    console.error("Gemini API failed in analyzeManualInput. Falling back locally:", error.message);
    const locallyParsedItems = parseInputLocally(userInput);
    return runLocalFuzzyAnalysis(locallyParsedItems, userDisease);
  }
};

export const analyzeCombinedInput = async (detectedFood, userInput, userDisease = "") => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
Anda adalah asisten AI gizi Indonesia. Tugas Anda adalah menganalisis dan menggabungkan hasil deteksi gambar makanan dan teks input manual dari user menjadi daftar makanan yang terstruktur beserta porsi dan estimasi gramnya.

Hasil deteksi gambar makanan: "${detectedFood}" (mungkin tidak akurat atau tidak lengkap)
Teks Input Tambahan/Koreksi dari User: "${userInput}"

Tugas Anda:
1. Analisis kedua input di atas. Gabungkan makanan dari hasil gambar dan input manual.
2. Jika input manual memperjelas atau mengoreksi hasil gambar (misalnya, gambar mendeteksi 'nasi putih' tetapi user menulis 'nasi goreng 1 porsi', gunakan 'nasi goreng' sebagai koreksi).
3. Jika input manual menyebutkan makanan tambahan (misalnya, gambar mendeteksi 'nasi putih' dan user menulis 'ayam goreng 1 potong'), gabungkan keduanya sehingga daftar akhirnya memiliki 'nasi putih' dan 'ayam goreng'.
4. Tentukan nama makanan standar dalam Bahasa Indonesia untuk masing-masing item (contoh: "nasi putih", "ayam goreng", "tempe goreng").
5. Estimasi porsi/jumlah makanan tersebut ke dalam satuan gram ("estimated_weight_g"). Gunakan panduan porsi umum makanan Indonesia jika tidak ditentukan (misal: 1 porsi nasi putih = 150g, 1 potong ayam goreng = 80g, 1 sendok makan = 15g, 1 butir telur = 50g, 1 mangkuk sayur = 100g, 1/2 porsi = setengah dari berat standar, dll.). Jika user menuliskan berat langsung, gunakan nilai tersebut.
6. Tentukan unit porsi asli dari teks (misal: "porsi", "potong", "butir", "sendok makan", dll.) dan quantity (angka pengalinya, misal: 1, 0.5, 2). Untuk makanan dari deteksi gambar yang tidak ditentukan jumlahnya di manual input, gunakan porsi standar (misal: 1 porsi = 150g untuk nasi, 1 potong = 80g untuk lauk).

Format Output harus berupa JSON Array dengan objek-objek berikut:
[
  {
    "original_input": "nama makanan dan porsi asli",
    "food_name": "nama makanan standar",
    "quantity": 1.0,
    "unit": "unit porsi",
    "estimated_weight_g": 150
  }
]

Hanya kembalikan JSON array tersebut. Jangan menambahkan penjelasan lain.
`;

    const result = await generateContentWithRetry(model, prompt);
    const responseText = result.response.text();
    console.log("Gemini Combined Parse Response:", responseText);

    const parsedItems = JSON.parse(responseText.trim());
    if (!Array.isArray(parsedItems)) {
      throw new Error("Invalid response format from Gemini.");
    }

    const matchedDetails = [];
    const totalNutrition = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      sugar: 0,
      sodium: 0,
      fiber: 0,
    };

    for (const item of parsedItems) {
      const csvFood = findBestFoodMatch(item.food_name);
      if (csvFood) {
        const multiplier = item.estimated_weight_g / 100;
        
        const itemNutrition = {
          calories: (csvFood.calories || 0) * multiplier,
          protein: (csvFood.protein || 0) * multiplier,
          fat: (csvFood.fat || 0) * multiplier,
          carbohydrates: (csvFood.carbohydrates || 0) * multiplier,
          sugar: (csvFood.sugar || 0) * multiplier,
          sodium: (csvFood.sodium || 0) * multiplier,
          fiber: (csvFood.fiber || 0) * multiplier,
        };

        totalNutrition.calories += itemNutrition.calories;
        totalNutrition.protein += itemNutrition.protein;
        totalNutrition.fat += itemNutrition.fat;
        totalNutrition.carbohydrates += itemNutrition.carbohydrates;
        totalNutrition.sugar += itemNutrition.sugar;
        totalNutrition.sodium += itemNutrition.sodium;
        totalNutrition.fiber += itemNutrition.fiber;

        matchedDetails.push({
          food_name: csvFood.food_name,
          original_input: item.original_input,
          quantity: item.quantity,
          unit: item.unit,
          estimated_weight_g: item.estimated_weight_g,
          nutrition: itemNutrition,
        });
      } else {
        console.warn(`No match found in CSV for: ${item.food_name}`);
      }
    }

    const diseasePrompt = userDisease ? `dan kondisi penyakit pengguna: ${userDisease}` : "";
    const summaryPrompt = `
Kami memiliki hasil analisis makanan berikut:
Makanan yang dikonsumsi: ${matchedDetails.map(d => `${d.food_name} (${d.estimated_weight_g}g)`).join(", ")}
Nutrisi Total:
- Kalori: ${totalNutrition.calories.toFixed(1)} kkal
- Protein: ${totalNutrition.protein.toFixed(1)} g
- Lemak: ${totalNutrition.fat.toFixed(1)} g
- Karbohidrat: ${totalNutrition.carbohydrates.toFixed(1)} g
- Serat: ${totalNutrition.fiber.toFixed(1)} g
- Gula: ${totalNutrition.sugar.toFixed(1)} g
- Sodium: ${totalNutrition.sodium.toFixed(1)} mg
${diseasePrompt}

Tugas Anda:
1. Berikan rekomendasi singkat (max 2 kalimat) tentang makanan ini bagi pengguna.
2. Berikan warning/peringatan (max 1 kalimat) jika ada kandungan yang berlebihan (misal kalori tinggi, lemak tinggi, sodium tinggi, atau tidak ramah bagi penyakitnya).

Format output harus berupa JSON objek:
{
  "recommendation": "Rekomendasi Anda di sini",
  "warning": "Warning Anda di sini (kosongkan jika tidak ada)"
}
`;

    const summaryModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const summaryResult = await generateContentWithRetry(summaryModel, summaryPrompt);
    const summaryResponse = JSON.parse(summaryResult.response.text().trim());

    return {
      success: true,
      best_prediction: {
        food_name: matchedDetails.map(d => d.food_name).join(", "),
        confidence_score: 1.0,
      },
      nutrition: totalNutrition,
      recommendation: summaryResponse.recommendation || "Konsumsi makanan dalam porsi seimbang.",
      warning: summaryResponse.warning || "",
      details: matchedDetails,
    };
  } catch (error) {
    console.error("Gemini API failed in analyzeCombinedInput. Falling back locally:", error.message);
    const locallyParsedItems = parseInputLocally(userInput);
    
    // Add the detectedFood as an item to combine if it's not already covered
    const hasDetectedFood = locallyParsedItems.some(item => 
      item.food_name.toLowerCase().includes(detectedFood.replace(/_/g, " ").toLowerCase())
    );
    
    if (detectedFood && !hasDetectedFood) {
      locallyParsedItems.unshift({
        original_input: detectedFood.replace(/_/g, " "),
        food_name: detectedFood.replace(/_/g, " "),
        quantity: 1.0,
        unit: "porsi",
      });
    }

    return runLocalFuzzyAnalysis(locallyParsedItems, userDisease);
  }
};
