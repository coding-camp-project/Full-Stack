import Food from "../models/food.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { executeWithRotatedKey } from "./apiKeyRotator.js";

/**
 * Calculate age based on birthDate string
 */
export const calculateAge = (birthDateStr) => {
  if (!birthDateStr) return 25;
  try {
    const birthDate = new Date(birthDateStr);
    if (isNaN(birthDate.getTime())) return 25;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch (error) {
    return 25;
  }
};

/**
 * Calculate BMR and TDEE based on user profile
 */
export const calculateDailyNeeds = (user) => {
  const age = calculateAge(user?.birthDate);
  const weight = parseFloat(user?.weight) || 65;
  const height = parseFloat(user?.height) || 170;
  const gender = (user?.gender || "pria").toLowerCase();
  

  let bmr = 0;
  if (gender === "pria" || gender === "laki-laki" || gender === "laki") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }


  const activityLevel = (user?.activityLevel || "moderate").toLowerCase();
  let activityFactor = 1.55;
  if (activityLevel === "sedentary" || activityLevel === "sangat jarang" || activityLevel === "sangat_jarang") {
    activityFactor = 1.2;
  } else if (activityLevel === "light" || activityLevel === "ringan" || activityLevel === "jarang") {
    activityFactor = 1.375;
  } else if (activityLevel === "moderate" || activityLevel === "sedang" || activityLevel === "cukup") {
    activityFactor = 1.55;
  } else if (activityLevel === "active" || activityLevel === "sering") {
    activityFactor = 1.725;
  } else if (activityLevel === "very active" || activityLevel === "sangat aktif" || activityLevel === "sangat_aktif" || activityLevel === "sangat sering") {
    activityFactor = 1.9;
  }

  const tdee = bmr * activityFactor;
  

  const goal = (user?.primaryGoal || "menjaga berat badan").toLowerCase();
  let targetCalories = tdee;
  
  let hasCalorieDeficit = false;
  let hasCalorieSurplus = false;
  
  if (goal.includes("turun") || goal.includes("loss") || goal.includes("kurang")) {
    targetCalories = tdee - 500;
    hasCalorieDeficit = true;
  } else if (goal.includes("naik") || goal.includes("gain") || goal.includes("tambah")) {
    targetCalories = tdee + 500;
    hasCalorieSurplus = true;
  } else if (goal.includes("otot") || goal.includes("muscle") || goal.includes("bangun")) {
    targetCalories = tdee + 300;
    hasCalorieSurplus = true;
  }


  targetCalories = Math.max(targetCalories, 1200);


  const conditions = (user?.healthConditions || []).map(c => c.toLowerCase());
  

  let carbPct = 0.55;
  let proteinPct = 0.20;
  let fatPct = 0.25;
  
  let maxSugar = 50;
  let maxSodium = 2000;
  let targetFiber = 25;


  

  if (conditions.includes("diabetes") || conditions.includes("kencing manis") || conditions.includes("gula")) {
    carbPct = 0.45;
    maxSugar = 25;
    proteinPct = 0.25;
    fatPct = 0.30;
  }


  if (conditions.includes("hipertensi") || conditions.includes("tekanan darah tinggi") || conditions.includes("tensi")) {
    maxSodium = 1500;
  }


  if (conditions.includes("obesitas") || conditions.includes("overweight") || conditions.includes("gemuk")) {
    if (!hasCalorieDeficit) {
      targetCalories = Math.max(targetCalories - 500, 1200);
      hasCalorieDeficit = true;
    }
    fatPct = Math.min(fatPct, 0.20);
  }


  if (conditions.includes("kolesterol") || conditions.includes("hypercholesterolemia")) {
    fatPct = Math.min(fatPct, 0.20);
  }


  if (goal.includes("otot") || goal.includes("muscle") || goal.includes("bangun")) {
    proteinPct = 0.30;
    carbPct = 0.45;
    fatPct = 0.25;
  }
  
  if (goal.includes("turun") || goal.includes("loss")) {
    maxSugar = Math.min(maxSugar, 30);
    fatPct = Math.min(fatPct, 0.20);
  }


  const totalPct = carbPct + proteinPct + fatPct;
  carbPct = carbPct / totalPct;
  proteinPct = proteinPct / totalPct;
  fatPct = fatPct / totalPct;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    targetProtein: Math.round((targetCalories * proteinPct) / 4),
    targetCarbs: Math.round((targetCalories * carbPct) / 4),
    targetFat: Math.round((targetCalories * fatPct) / 9),
    targetSugar: Math.round(maxSugar),
    targetSodium: Math.round(maxSodium),
    targetFiber: Math.round(targetFiber),
  };
};

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash"
];

const getLLMRecommendation = async (foodName, user) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined, skipping LLM recommendation.");
    return null;
  }

  const conditions = user?.healthConditions || [];
  const allergies = user?.allergies || [];
  const restrictions = user?.foodRestrictions || [];
  const preferences = user?.foodPreferences || [];
  const goal = user?.primaryGoal || "";
  const otherConditions = user?.otherConditions || "";

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const prompt = `
Anda adalah pakar nutrisi dan gizi. Analisis makanan berikut untuk pengguna dengan profil kesehatan ini:
- Nama Makanan: ${foodName}
- Kondisi Kesehatan: ${conditions.join(", ")} ${otherConditions ? `(${otherConditions})` : ""}
- Alergi: ${allergies.join(", ")}
- Pantangan Makanan (Restrictions): ${restrictions.join(", ")}
- Preferensi Makanan: ${preferences.join(", ")}
- Target/Goal: ${goal}

Berikan analisis kesehatan yang akurat. Jika makanan tersebut berbahaya atau tidak dianjurkan (misalnya mengandung kolesterol tinggi seperti kepiting/udang/cumi untuk penderita kolesterol tinggi, atau tinggi purin untuk asam urat, atau mengandung alergen yang berbahaya), berikan skor kesehatan rendah, grade buruk, dan peringatan (warning) yang jelas.
PENTING: Jangan sekali-kali menggunakan kata "diet" dalam respon Anda. Gunakan kata "pola makan", "kebiasaan makan", atau "nutrisi".
PENTING: Buatlah analisis kesehatan (healthAnalysis) dan rekomendasi (recommendation) secara deskriptif, ramah, dan profesional. "healthAnalysis" berupa array berisi 2-3 penjelasan/poin deskriptif yang detail tentang dampak makanan terhadap kesehatan pengguna. "recommendation" harus berupa saran praktis dan hangat (2-3 kalimat lengkap, sekitar 30-50 kata) yang mengedukasi pengguna tentang porsi, alternatif penyajian, atau panduan pola makan. "warning" berupa pesan peringatan singkat (maksimal 7 kata) jika ada bahan berbahaya/alergen, kosongkan jika aman.

Format respon HARUS dalam JSON valid (hanya JSON, tanpa markdown code blocks \`\`\`json atau teks pembuka/penutup lainnya) dengan struktur:
{
  "healthScore": <number antara 10 - 100>,
  "healthGrade": "<A/B/C/D/E>",
  "healthAnalysis": ["<analisis deskriptif 1>", "<analisis deskriptif 2>", "<analisis deskriptif 3>"],
  "warning": "<pesan peringatan singkat, kosongkan jika aman>",
  "recommendation": "Rekomendasi berdasarkan profil Anda yaitu ${conditions.join(", ") || "Umum"}: <rekomendasi lengkap, ramah dan aplikatif sekitar 30-50 kata>",
  "alternatives": ["<alternatif 1>", "<alternatif 2>", "<alternatif 3>"]
}
`;

  for (const modelName of MODELS) {
    try {
      console.log("[Gemini] Request started");
      console.log("[Gemini] Model:", modelName);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 500
        }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      console.log("[Gemini] Response received");
      

      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanJsonStr = text.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(cleanJsonStr);
        return parsed;
      }
    } catch (error) {
      console.error("[Gemini] Error:", error);
    }
  }

  return null;
};

export const getUnifiedLLMRecommendation = async (foodName, nutrition, user, fastapiRecommendations = [], ruleResult = null) => {
  const conditions = user?.healthConditions || [];
  const allergies = user?.allergies || [];
  const restrictions = user?.foodRestrictions || [];
  const preferences = user?.foodPreferences || [];
  const goal = user?.primaryGoal || "";
  const otherConditions = user?.otherConditions || "";

  const draftAnalysis = ruleResult?.healthAnalysis || [];
  const draftRec = ruleResult?.recommendation || "";

  const prompt = `
Anda adalah asisten gizi profesional. Tugas Anda adalah merapikan analisis kesehatan dan rekomendasi makanan agar bahasanya santun, profesional, mudah dipahami, dan padat dalam bahasa Indonesia.

Makanan: ${foodName}
Kondisi Kesehatan Pengguna: ${conditions.join(", ")} ${otherConditions ? `(${otherConditions})` : ""}

Draft Analisis Kesehatan:
${draftAnalysis.map(a => `- ${a}`).join("\n") || "- Kandungan nutrisi terpantau seimbang."}

Draft Rekomendasi:
"${draftRec}"

Rujukan Tambahan dari FastAPI:
${fastapiRecommendations.map(r => `- ${r}`).join("\n") || "- Tidak ada rujukan tambahan"}

Tugas Penulisan:
1. Ringkas analisis kesehatan menjadi maksimal 2 poin pendek (masing-masing 1 kalimat singkat) yang mencakup kecocokan makanan dengan kondisi kesehatan pengguna.
2. Rekomendasi HARUS diawali secara eksplisit dengan menyebutkan penyakit/kondisi kesehatan yang dimiliki pengguna (jika ada). Contoh format: "Berdasarkan kondisi Diabetes dan Hipertensi Anda, ..." atau "Berdasarkan kondisi Kolesterol Anda, ...". Jika pengguna tidak memiliki penyakit (kondisi Umum), gunakan format: "Berdasarkan profil kesehatan Anda, ...". Batasi rekomendasi maksimal 1-2 kalimat pendek saja.
3. Tentukan warning berupa pesan peringatan singkat (maksimal 5 kata) jika makanan terdeteksi bahaya atau mengandung alergen, jika aman kosongkan.
4. PENTING: Jangan sekali-kali menggunakan kata "diet", gunakan "pola makan".

Format respon HARUS dalam JSON valid (hanya JSON, tanpa markdown code blocks atau teks pembuka/penutup lainnya) dengan struktur:
{
  "healthAnalysis": ["<analisis singkat 1>", "<analisis singkat 2>"],
  "warning": "<peringatan sangat singkat atau kosong>",
  "recommendation": "<rekomendasi singkat, 1-2 kalimat>"
}
`;

  return executeWithRotatedKey("scan", async (genAI) => {
    let lastError = null;
    for (const modelName of MODELS) {
      try {
        console.log("[Gemini] Request started (Refinement)");
        console.log("[Gemini] Model:", modelName);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
            maxOutputTokens: 500
          }
        });
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        console.log("[Gemini] Response received");
        
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const cleanJsonStr = text.substring(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(cleanJsonStr);
          return parsed;
        }
      } catch (error) {
        console.error(`[Gemini] Model ${modelName} failed on current key:`, error.message || error);
        lastError = error;
      }
    }

    throw lastError || new Error("All models failed on the selected API key.");
  });
};

/**
 * Local Rule Engine to evaluate food quality against user profile
 */
export const runRuleEngine = async (food, user) => {
  const name = food.food_name || "Makanan";
  const conditions = (user?.healthConditions || []).map(c => c.toLowerCase());
  const allergies = (user?.allergies || []).map(a => a.toLowerCase().trim());
  const goal = (user?.primaryGoal || "").toLowerCase();


  const cleanName = name.toLowerCase().trim();
  const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  
  console.log(`[RuleEngine] Processing local rules for: ${name}`);
  const startTime = Date.now();

  let dbFood = null;
  let alternatives = [];

  try {
    const [foundFood, foundAlternatives] = await Promise.all([
      Food.findOne({ 
        food_name: { $regex: new RegExp("^" + escapeRegex(cleanName) + "$", "i") } 
      }).lean(),
      getAlternativeRecommendations(name, conditions, goal)
    ]);
    dbFood = foundFood;
    alternatives = foundAlternatives;
    console.log(`[RuleEngine] DB lookups completed in ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error("Error during RuleEngine parallel lookups:", error);
  }

  const calories = parseFloat(food.calories) || 0;
  const protein = parseFloat(food.protein) || 0;
  const fat = parseFloat(food.fat) || 0;
  const carbs = parseFloat(food.carbohydrates) || 0;
  const sugar = parseFloat(food.sugar) || 0;
  const sodium = parseFloat(food.sodium) || 0;
  const fiber = parseFloat(food.fiber) || 0;

  let score = 100;
  const analysis = [];
  let isAllergenDetected = false;
  let detectedAllergen = "";


  for (const allergen of allergies) {
    if (name.toLowerCase().includes(allergen)) {
      isAllergenDetected = true;
      detectedAllergen = allergen;
      break;
    }
  }

  if (isAllergenDetected) {
    score = 0;
    analysis.push(`⚠️ PERINGATAN KERAS: Makanan ini terdeteksi mengandung bahan alergen (${detectedAllergen}) yang terdaftar pada profil Anda!`);
  } else {

    if (sugar > 15) {
      score -= 15;
      analysis.push(`• Kandungan gula cukup tinggi (${sugar.toFixed(1)}g), batasi porsinya.`);
    } else if (sugar > 8) {
      score -= 8;
      analysis.push(`• Kandungan gula sedang (${sugar.toFixed(1)}g).`);
    }

    if (sodium > 600) {
      score -= 15;
      analysis.push(`• Kandungan sodium sangat tinggi (${sodium.toFixed(0)}mg), sebaiknya dihindari.`);
    } else if (sodium > 400) {
      score -= 8;
      analysis.push(`• Kandungan sodium sedang (${sodium.toFixed(0)}mg).`);
    }

    if (fat > 20) {
      score -= 12;
      analysis.push(`• Kandungan lemak tinggi (${fat.toFixed(1)}g), kurangi konsumsi harian.`);
    } else if (fat > 10) {
      score -= 6;
      analysis.push(`• Kandungan lemak sedang (${fat.toFixed(1)}g).`);
    }

    if (protein > 15 || food.is_high_protein === 1) {
      score += 8;
      analysis.push(`• Kaya akan protein (${protein.toFixed(1)}g), sangat baik untuk pertumbuhan sel.`);
    } else if (protein > 8) {
      score += 4;
    }

    if (fiber > 4 || food.is_high_fiber === 1) {
      score += 8;
      analysis.push(`• Kaya serat pangan (${fiber.toFixed(1)}g), baik untuk kesehatan pencernaan.`);
    } else if (fiber > 2) {
      score += 4;
    }


    if (conditions.includes("diabetes") || conditions.includes("kencing manis")) {
      if (sugar > 5) {
        score -= 20;
        analysis.push(`⚠️ Catatan Diabetes: Mengandung gula tinggi untuk penderita diabetes.`);
      }
      if (carbs > 30) {
        score -= 10;
        analysis.push(`⚠️ Catatan Diabetes: Tinggi karbohidrat, awasi porsi makan.`);
      }
      if (name.toLowerCase().match(/nasi putih|roti putih|bubur|manis|es|gula/i)) {
        score -= 10;
        analysis.push(`⚠️ Catatan Diabetes: Tergolong makanan berindeks glikemik tinggi.`);
      }
    }

    if (conditions.includes("hipertensi") || conditions.includes("tekanan darah tinggi")) {
      if (sodium > 250) {
        score -= 20;
        analysis.push(`⚠️ Catatan Hipertensi: Sodium (${sodium.toFixed(0)}mg) melebihi batas anjuran makan.`);
      }
      if (name.toLowerCase().match(/asin|teri|sambal|abon|instant/i)) {
        score -= 10;
        analysis.push(`⚠️ Catatan Hipertensi: Makanan asin/olahan sebaiknya dibatasi.`);
      }
    }

    if (conditions.includes("kolesterol") || conditions.includes("jantung")) {
      if (fat > 10) {
        score -= 20;
        analysis.push(`⚠️ Catatan Kolesterol/Jantung: Tinggi lemak total, kurangi asupan.`);
      }
      if (name.toLowerCase().match(/goreng|crispy|kremes|jeroan|babat|usus|santan/i)) {
        score -= 15;
        analysis.push(`⚠️ Catatan Kolesterol/Jantung: Hindari makanan digoreng/berlemak jenuh.`);
      }
      if (name.toLowerCase().match(/kepiting|udang|cumi|kerang|seafood|jeroan|babat|usus|kuning telur|mentega|otak|bebek/i)) {
        score -= 20;
        analysis.push(`⚠️ Catatan Kolesterol/Jantung: Mengandung kolesterol tinggi, batasi konsumsinya.`);
      }
    }

    if (conditions.includes("asam urat")) {
      if (name.toLowerCase().match(/sapi|kambing|bebek|kepiting|udang|cumi|jeroan|babat|usus|ampela|hati/i)) {
        score -= 25;
        analysis.push(`⚠️ Catatan Asam Urat: Mengandung bahan purin tinggi yang dapat memicu kekambuhan.`);
      }
    }

    if (conditions.includes("obesitas") || goal.includes("turun")) {
      if (calories > 220) {
        score -= 15;
        analysis.push(`⚠️ Catatan Berat Badan: Padat kalori (${calories.toFixed(0)} kkal), batasi porsinya.`);
      }
    }


    if (analysis.length === 0) {
      analysis.push("• Kandungan nutrisi makanan ini berada dalam rentang seimbang.");
    }
  }


  if (!isAllergenDetected) {
    score = Math.max(10, Math.min(100, score));
  }


  let grade = "C";
  if (score >= 85) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 55) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "E";


  const displayConditions = (user?.healthConditions || []).length > 0
    ? (user?.healthConditions || []).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")
    : "Umum";

  let recommendation = "";
  if (isAllergenDetected) {
    recommendation = `Rekomendasi berdasarkan profil Anda yaitu Alergi: Anda sebaiknya menghindari konsumsi ${name} karena terdeteksi mengandung bahan alergen (${detectedAllergen}) yang berbahaya bagi kesehatan Anda.`;
  } else {
    const recs = [];
    if (conditions.includes("diabetes") || conditions.includes("kencing manis")) {
      if (sugar > 5 || carbs > 30 || name.toLowerCase().match(/nasi putih|roti putih|bubur|manis|es|gula/i)) {
        recs.push("mengandung kadar gula/karbohidrat tinggi yang kurang baik untuk penderita diabetes");
      }
    }
    if (conditions.includes("hipertensi") || conditions.includes("tekanan darah tinggi")) {
      if (sodium > 250 || name.toLowerCase().match(/asin|teri|sambal|abon|instant/i)) {
        recs.push(`kandungan sodium tinggi (${sodium.toFixed(0)}mg) yang kurang baik untuk penderita tekanan darah tinggi`);
      }
    }
    if (conditions.includes("kolesterol") || conditions.includes("jantung")) {
      if (fat > 10 || name.toLowerCase().match(/goreng|crispy|kremes|jeroan|babat|usus|santan|kepiting|udang|cumi|kerang|seafood|jeroan|babat|usus|kuning telur|mentega|otak|bebek/i)) {
        recs.push("terdeteksi tinggi kolesterol atau lemak jenuh");
      }
    }
    if (conditions.includes("asam urat")) {
      if (name.toLowerCase().match(/sapi|kambing|bebek|kepiting|udang|cumi|jeroan|babat|usus|ampela|hati/i)) {
        recs.push("mengandung kadar purin tinggi yang dapat memicu kekambuhan asam urat");
      }
    }
    if (conditions.includes("obesitas") || goal.includes("turun")) {
      if (calories > 220) {
        recs.push(`tergolong makanan padat kalori (${calories.toFixed(0)} kkal) yang kurang cocok untuk program penurunan berat badan`);
      }
    }

    if (recs.length > 0) {
      recommendation = `Rekomendasi berdasarkan profil Anda yaitu ${displayConditions}: Anda sebaiknya membatasi atau menghindari konsumsi ${name} karena ${recs.join(" serta ")}.`;
    } else {
      recommendation = `Rekomendasi berdasarkan profil Anda yaitu ${displayConditions}: Anda boleh mengonsumsi ${name} ini karena kandungannya terpantau aman dan seimbang untuk mendukung profil kesehatan Anda.`;
    }
  }

  return {
    healthScore: score,
    healthGrade: grade,
    healthAnalysis: analysis,
    recommendation,
    alternatives,
  };
};

/**
 * Helper to query MongoDB for healthier options
 */
const getAlternativeRecommendations = async (foodName, healthConditions = [], goal = "") => {
  const cleanName = foodName.toLowerCase();
  let query = {};
  
  if (cleanName.includes("nasi putih") || cleanName.includes("mie") || cleanName.includes("roti putih")) {
    query = { food_name: { $in: ["nasi merah", "ubi jalar kuning", "gembili", "kentang"] } };
  } else if (cleanName.includes("goreng") || cleanName.includes("crispy") || cleanName.includes("kremes")) {
    const baseIngredient = cleanName.replace("goreng", "").replace("crispy", "").replace("kremes", "").trim();
    if (baseIngredient && baseIngredient.length > 2) {
      query = { 
        food_name: { $regex: new RegExp(baseIngredient, "i") },
        $or: [
          { food_name: { $regex: /bakar|rebus|panggang|kukus/i } },
          { fat: { $lt: 8 } }
        ]
      };
    } else {
      query = { food_name: { $in: ["ayam bakar", "pepes tahu", "ikan bakar"] } };
    }
  } else if (cleanName.includes("manis") || cleanName.includes("sirup") || cleanName.includes("es ")) {
    query = { food_name: { $in: ["apel washington", "jeruk pamelo", "buah naga", "pepaya"] } };
  } else if (healthConditions.includes("hipertensi")) {
    query = { is_high_sodium: 0, calories: { $lt: 200 } };
  } else if (goal.includes("turun")) {
    query = { calorie_category: "rendah", is_high_fiber: 1 };
  } else if (goal.includes("naik")) {
    query = { is_high_protein: 1, calories: { $gt: 150 } };
  } else {
    query = { is_high_protein: 1, is_high_sodium: 0 };
  }

  try {
    const alternatives = await Food.find(query).limit(3).lean();
    if (alternatives.length > 0) {
      return alternatives.map(f => f.food_name);
    }
  } catch (error) {
    console.error("Alternative query error:", error);
  }
  

  return ["nasi merah", "apel washington", "pepes tahu"];
};

export const scanFoodWithGeminiDirectly = async (imageBuffer, mimeType, manualInput, user) => {
  const conditions = user?.healthConditions || [];
  const allergies = user?.allergies || [];
  const restrictions = user?.foodRestrictions || [];
  const preferences = user?.foodPreferences || [];
  const goal = user?.primaryGoal || "";
  const otherConditions = user?.otherConditions || "";

  let inputDetails = "";
  if (manualInput && manualInput.trim()) {
    inputDetails = `\n- Tambahan informasi/komposisi dari pengguna: "${manualInput}"`;
  }

  const prompt = `
Anda adalah pakar nutrisi, gizi, dan asisten kuliner AI. Analisis ${imageBuffer ? "gambar makanan" : "input makanan"} berikut secara sangat ringkas dan akurat untuk pengguna dengan profil kesehatan ini:
- Kondisi Kesehatan: ${conditions.join(", ")} ${otherConditions ? `(${otherConditions})` : ""}
- Alergi: ${allergies.join(", ")}
- Pantangan Makanan: ${restrictions.join(", ")}
- Preferensi Makanan: ${preferences.join(", ")}
- Target/Goal: ${goal}${inputDetails}

Langkah Analisis Anda:
1. Identifikasi nama makanan yang ada di ${imageBuffer ? "gambar" : "input"} (gunakan nama dalam Bahasa Indonesia yang umum dan ringkas, contoh: "Nasi Goreng Ayam", "Sate Madura", "Pecel Lele").
2. Estimasikan berat porsi standard (dalam gram) dan satuan porsinya (contoh: "porsi", "butir", "potong", "mangkuk", "gelas").
3. Estimasikan nilai nutrisi per porsi tersebut (Kalori dalam kkal, Protein dalam gram, Lemak dalam gram, Karbohidrat dalam gram, Gula dalam gram, Sodium dalam mg, Serat dalam gram).
4. Hitung skor kesehatan (healthScore) antara 10 - 100 berdasarkan kecocokan nutrisi dengan kondisi kesehatan pengguna, berikan grade (healthGrade) A/B/C/D/E.
5. Berikan analisis kesehatan (healthAnalysis) berupa array berisi 2-3 penjelasan/poin deskriptif yang ramah dan mendalam dalam bahasa Indonesia, menjelaskan dampak nutrisi makanan ini terhadap tubuh dan kondisi kesehatan pengguna secara informatif.
6. Tentukan warning berupa pesan peringatan singkat (maksimal 7 kata) jika makanan mengandung bahan alergen atau perlu dibatasi untuk kondisi kesehatan pengguna. Jika aman, kosongkan "".
7. Berikan rekomendasi (recommendation) berupa penjelasan/saran praktis yang ramah, mendalam, dan aplikatif (2-3 kalimat lengkap, sekitar 30-50 kata) yang diawali dengan menyebutkan kondisi kesehatannya (Contoh: "Berdasarkan kondisi Diabetes Anda..."). Jangan gunakan kata "diet", gunakan "pola makan". Berikan saran porsi, cara penyajian yang lebih sehat, atau tips tambahan.
8. Berikan 3 alternatif makanan sehat lainnya yang cocok untuk kondisi kesehatannya.

Format respon HARUS berupa JSON valid dengan struktur persis seperti ini:
{
  "food_name": "<nama makanan>",
  "serving_size_g": <angka berat dalam gram>,
  "serving_unit": "<satuan porsi>",
  "nutrition": {
    "calories": <angka kkal>,
    "protein": <angka gram>,
    "fat": <angka gram>,
    "carbohydrates": <angka gram>,
    "sugar": <angka gram>,
    "sodium": <angka mg>,
    "fiber": <angka gram>
  },
  "healthScore": <angka 10 - 100>,
  "healthGrade": "<A/B/C/D/E>",
  "healthAnalysis": ["<analisis deskriptif 1>", "<analisis deskriptif 2>", "<analisis deskriptif 3>"],
  "warning": "<peringatan singkat atau kosong>",
  "recommendation": "<rekomendasi lengkap, ramah dan aplikatif sekitar 30-50 kata>",
  "alternatives": ["<alternatif 1>", "<alternatif 2>", "<alternatif 3>"]
}
`;

  const parts = [prompt];
  if (imageBuffer) {
    parts.push({
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    });
  }

  return executeWithRotatedKey("scan", async (genAI) => {
    let lastError = null;
    const visionModels = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];
    for (const modelName of visionModels) {
      try {
        console.log(`[Gemini Direct Scan] Request started using model: ${modelName}`);
        console.time(`[Gemini Direct API Call - ${modelName}]`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
            maxOutputTokens: 500
          }
        });
        const result = await model.generateContent(parts);
        const text = result.response.text().trim();
        console.timeEnd(`[Gemini Direct API Call - ${modelName}]`);

        const parsed = JSON.parse(text);
        return parsed;
      } catch (error) {
        console.error(`[Gemini Direct Scan] Model ${modelName} failed on current key:`, error.message || error);
        lastError = error;
      }
    }
    throw lastError || new Error("All models failed during direct Gemini scan.");
  });
};

/**
 * Fallback: Analyze food image using Gemini Vision if FastAPI fails
 */
export const analyzeImageWithGemini = async (imageBuffer, mimeType) => {
  const prompt = `
Identifikasi makanan dalam gambar ini dan berikan estimasi nutrisi per 100g.
Gunakan bahasa Indonesia untuk nama makanan.
Format respon HARUS dalam JSON valid:
{
  "food_name": "nama makanan",
  "nutrition": {
    "calories": <number>,
    "protein": <number>,
    "fat": <number>,
    "carbohydrates": <number>,
    "sugar": <number>,
    "sodium": <number>,
    "fiber": <number>
  }
}
`;

  return executeWithRotatedKey("scan", async (genAI) => {

    const modelName = MODELS[0] || "gemini-2.0-flash";
    console.log(`[Gemini Vision] Request started using ${modelName}`);
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 500
      }
    });
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: mimeType
        }
      }
    ]);
    
    const text = result.response.text().trim();
    console.log("[Gemini Vision] Response received");
    
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    }
    throw new Error("Failed to parse Gemini Vision response");
  });
};

