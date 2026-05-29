import Food from "../models/food.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  
  // Mifflin-St Jeor Formula
  let bmr = 0;
  if (gender === "pria" || gender === "laki-laki" || gender === "laki") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity Factor
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
  
  // Adjust based on goal
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

  // Ensure safe minimum
  targetCalories = Math.max(targetCalories, 1200);

  // Health Conditions
  const conditions = (user?.healthConditions || []).map(c => c.toLowerCase());
  
  // Default percentages
  let carbPct = 0.55;
  let proteinPct = 0.20;
  let fatPct = 0.25;
  
  let maxSugar = 50; // default max sugar 50g
  let maxSodium = 2000; // default max sodium 2000mg
  let targetFiber = 25; // default target fiber 25g

  // Smart condition adjustments
  
  // 1. Diabetes / Kencing Manis
  if (conditions.includes("diabetes") || conditions.includes("kencing manis") || conditions.includes("gula")) {
    carbPct = 0.45; // Controlled carbohydrate
    maxSugar = 25;  // Lower sugar target
    proteinPct = 0.25; // Slightly higher protein to compensate
    fatPct = 0.30;     // Healthy fat to compensate
  }

  // 2. Hipertensi / Tekanan Darah Tinggi
  if (conditions.includes("hipertensi") || conditions.includes("tekanan darah tinggi") || conditions.includes("tensi")) {
    maxSodium = 1500; // Lower sodium target
  }

  // 3. Obesitas / Berat Badan Lebih
  if (conditions.includes("obesitas") || conditions.includes("overweight") || conditions.includes("gemuk")) {
    if (!hasCalorieDeficit) {
      targetCalories = Math.max(targetCalories - 500, 1200);
      hasCalorieDeficit = true;
    }
    fatPct = Math.min(fatPct, 0.20); // Lower fat target
  }

  // 4. Kolesterol
  if (conditions.includes("kolesterol") || conditions.includes("hypercholesterolemia")) {
    fatPct = Math.min(fatPct, 0.20); // Lower fat target
  }

  // Goal modifications
  if (goal.includes("otot") || goal.includes("muscle") || goal.includes("bangun")) {
    proteinPct = 0.30; // Higher protein target
    carbPct = 0.45;
    fatPct = 0.25;
  }
  
  if (goal.includes("turun") || goal.includes("loss")) {
    maxSugar = Math.min(maxSugar, 30); // Lower sugar for weight loss
    fatPct = Math.min(fatPct, 0.20);   // Lower fat for weight loss
  }

  // Normalize percentages to sum to 100% (1.0)
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
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash"
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

Format respon HARUS dalam JSON valid (hanya JSON, tanpa markdown code blocks \`\`\`json atau teks pembuka/penutup lainnya) dengan struktur:
{
  "healthScore": <number antara 10 - 100>,
  "healthGrade": "<A/B/C/D/E>",
  "healthAnalysis": ["<analisis detail poin 1>", "<analisis detail poin 2>"],
  "warning": "<pesan peringatan singkat jika ada potensi bahaya, kosongkan jika aman>",
  "recommendation": "Rekomendasi berdasarkan profil Anda yaitu ${conditions.join(", ") || "Umum"}: Anda sebaiknya membatasi atau menghindari konsumsi ${foodName} karena... (ATAU) Rekomendasi berdasarkan profil Anda yaitu ${conditions.join(", ") || "Umum"}: Anda boleh mengonsumsi ${foodName} ini karena...",
  "alternatives": ["<rekomendasi alternatif makanan sehat 1>", "<rekomendasi alternatif makanan sehat 2>", "<rekomendasi alternatif makanan sehat 3>"]
}
`;

  for (const modelName of MODELS) {
    try {
      console.log("[Gemini] Request started");
      console.log("[Gemini] Model:", modelName);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      console.log("[Gemini] Response received");
      
      // Clean JSON formatting if Gemini wrapped it in markdown code blocks
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

export const getUnifiedLLMRecommendation = async (foodName, nutrition, user, fastapiRecommendations = []) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined, skipping unified LLM recommendation.");
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
Anda adalah pakar nutrisi dan gizi medis. Analisis makanan berikut secara detail dan konsisten dengan profil kesehatan pengguna.

Makanan: ${foodName}
Kandungan Nutrisi (per 100g):
- Kalori: ${nutrition.calories || 0} kkal
- Protein: ${nutrition.protein || 0} g
- Lemak: ${nutrition.fat || 0} g
- Karbohidrat: ${nutrition.carbohydrates || 0} g
- Gula: ${nutrition.sugar || 0} g
- Sodium: ${nutrition.sodium || 0} mg
- Serat: ${nutrition.fiber || 0} g

Profil Pengguna:
- Kondisi Kesehatan: ${conditions.join(", ")} ${otherConditions ? `(${otherConditions})` : ""}
- Alergi: ${allergies.join(", ")}
- Pantangan Makanan (Restrictions): ${restrictions.join(", ")}
- Preferensi Makanan: ${preferences.join(", ")}
- Target/Goal: ${goal}

Rujukan Rekomendasi Awal dari FastAPI (mungkin ada kontradiksi medis, harap diselaraskan secara profesional):
${fastapiRecommendations.map((r, i) => `Rujukan ${i+1}: "${r}"`).join("\n") || "Tidak ada rujukan"}

 Tugas Anda:
1. Analisis kesesuaian makanan ini untuk profil kesehatan pengguna (perhatikan semua penyakit/kondisi mereka secara adil dan terpadu).
2. Jika ada rujukan rekomendasi awal yang kontradiktif (misalnya satu rujukan bilang aman tetapi kandungan kolesterol/sodium tinggi, atau bahan tidak cocok untuk kondisi mereka lainnya), selaraskan dan berikan kesimpulan yang akurat berdasarkan kaidah medis nutrisi yang konsisten.
3. Tentukan skor kesehatan (healthScore) 10-100 dan grade kesehatan (healthGrade) A/B/C/D/E yang logis berdasarkan kandungan nutrisi dan profil kesehatan pengguna.
4. Buat list analisis kesehatan (healthAnalysis) yang berisi poin-poin alasan medis yang jelas dan konsisten.
5. Buat satu pesan rekomendasi (recommendation) paragraf singkat yang padat, ramah, logis, dan konsisten (tidak boleh ada kalimat kontradiktif seperti "relatif aman namun sebaiknya dihindari").
PENTING: Jangan sekali-kali menggunakan kata "diet" dalam respon Anda. Gunakan kata "pola makan", "kebiasaan makan", atau "nutrisi".

Format respon HARUS dalam JSON valid (hanya JSON, tanpa markdown code blocks atau teks pembuka/penutup lainnya) dengan struktur:
{
  "healthScore": <number antara 10 - 100>,
  "healthGrade": "<A/B/C/D/E>",
  "healthAnalysis": ["<analisis detail poin 1>", "<analisis detail poin 2>"],
  "warning": "<pesan peringatan singkat jika ada potensi bahaya besar/alergi/pantangan medis, kosongkan jika aman>",
  "recommendation": "<rekomendasi pola makan terpadu, singkat dan padat>",
  "alternatives": ["<rekomendasi alternatif makanan sehat 1>", "<rekomendasi alternatif makanan sehat 2>", "<rekomendasi alternatif makanan sehat 3>"]
}
`;

  for (const modelName of MODELS) {
    try {
      console.log("[Gemini] Request started");
      console.log("[Gemini] Model:", modelName);
      const model = genAI.getGenerativeModel({ model: modelName });
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

/**
 * Local Rule Engine to evaluate food quality against user profile
 */
export const runRuleEngine = async (food, user) => {
  const name = food.food_name || "Makanan";
  
  // Check if we have the food in our database (Food collection)
  const cleanName = name.toLowerCase().trim();
  const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  
  let dbFood = null;
  try {
    dbFood = await Food.findOne({ 
      food_name: { $regex: new RegExp("^" + escapeRegex(cleanName) + "$", "i") } 
    }).lean();
  } catch (error) {
    console.error("Error looking up food in DB:", error);
  }

  // If NOT in DB, use LLM for recommendation to avoid wrong guidance
  if (!dbFood) {
    console.log(`Food "${name}" not found in local DB. Fetching recommendation from LLM...`);
    const llmResult = await getLLMRecommendation(name, user);
    if (llmResult) {
      return {
        healthScore: llmResult.healthScore || 50,
        healthGrade: llmResult.healthGrade || "C",
        healthAnalysis: llmResult.healthAnalysis || [],
        warning: llmResult.warning || "",
        recommendation: llmResult.recommendation || "",
        alternatives: llmResult.alternatives || [],
      };
    }
    console.log("LLM recommendation failed or returned null, falling back to local rule engine.");
  }

  const calories = parseFloat(food.calories) || 0;
  const protein = parseFloat(food.protein) || 0;
  const fat = parseFloat(food.fat) || 0;
  const carbs = parseFloat(food.carbohydrates) || 0;
  const sugar = parseFloat(food.sugar) || 0;
  const sodium = parseFloat(food.sodium) || 0;
  const fiber = parseFloat(food.fiber) || 0;
  
  const conditions = (user?.healthConditions || []).map(c => c.toLowerCase());
  const allergies = (user?.allergies || []).map(a => a.toLowerCase().trim());
  const goal = (user?.primaryGoal || "").toLowerCase();

  let score = 100;
  const analysis = [];
  let isAllergenDetected = false;
  let detectedAllergen = "";

  // 1. Check Allergies (Critical)
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
    // 2. Base Nutrient Density Rules (per 100g)
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

    // 3. Personalized Health Conditions Rules
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

    // Default neutral comment if list is empty
    if (analysis.length === 0) {
      analysis.push("• Kandungan nutrisi makanan ini berada dalam rentang seimbang.");
    }
  }

  // Cap score between 10 and 100 (unless allergen detected)
  if (!isAllergenDetected) {
    score = Math.max(10, Math.min(100, score));
  }

  // Grade translation
  let grade = "C";
  if (score >= 85) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 55) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "E";

  // Get Alternative Recommendations
  const alternatives = await getAlternativeRecommendations(name, conditions, goal);

  // Generate customized recommendation statement based on the user's personalization profile and warnings
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
  
  // Fallbacks
  return ["nasi merah", "apel washington", "pepes tahu"];
};
