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
