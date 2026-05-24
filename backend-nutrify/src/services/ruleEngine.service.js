import Food from "../models/food.model.js";

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
  if (gender === "pria" || gender === "laki-laki" || gender === "laki-laki") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity Factor
  const activityLevel = (user?.activityLevel || "moderate").toLowerCase();
  let activityFactor = 1.55;
  if (activityLevel === "sedentary" || activityLevel === "sangat jarang") {
    activityFactor = 1.2;
  } else if (activityLevel === "light" || activityLevel === "jarang") {
    activityFactor = 1.375;
  } else if (activityLevel === "moderate" || activityLevel === "cukup") {
    activityFactor = 1.55;
  } else if (activityLevel === "active" || activityLevel === "sering") {
    activityFactor = 1.725;
  } else if (activityLevel === "very active" || activityLevel === "sangat sering") {
    activityFactor = 1.9;
  }

  const tdee = bmr * activityFactor;
  
  // Adjust based on goal
  const goal = (user?.primaryGoal || "menjaga berat badan").toLowerCase();
  let targetCalories = tdee;
  
  if (goal.includes("turun") || goal.includes("loss")) {
    targetCalories = tdee - 500;
  } else if (goal.includes("naik") || goal.includes("gain")) {
    targetCalories = tdee + 500;
  }

  // Ensure safe minimum
  targetCalories = Math.max(targetCalories, 1200);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    targetProtein: Math.round((targetCalories * 0.20) / 4), // 20% protein
    targetCarbs: Math.round((targetCalories * 0.55) / 4),   // 55% carbs
    targetFat: Math.round((targetCalories * 0.25) / 9),     // 25% fat
  };
};

/**
 * Local Rule Engine to evaluate food quality against user profile
 */
export const runRuleEngine = async (food, user) => {
  const name = food.food_name || "Makanan";
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

  return {
    healthScore: score,
    healthGrade: grade,
    healthAnalysis: analysis,
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
