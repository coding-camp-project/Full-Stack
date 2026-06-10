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
