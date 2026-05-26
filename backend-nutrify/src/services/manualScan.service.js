
// --- LOCAL PARSING ENGINE ---
export const parseInputLocally = (userInput) => {
  if (!userInput) return [];
  // Normalize bullets, newlines, and other separators
  let normalizedInput = userInput;
  // Replace bullets at the start of lines or start of the string
  normalizedInput = normalizedInput.replace(/(?:^|\n)\s*[-*•+]\s+/g, "\n");
  // Replace inline bullets or separators (like •, *, or a hyphen surrounded by spaces) with a comma
  normalizedInput = normalizedInput.replace(/\s*[•*]\s*/g, ",");
  normalizedInput = normalizedInput.replace(/\s+-\s+/g, ",");

  const items = normalizedInput.split(/[,;\n]+/).map(item => item.trim()).filter(Boolean);
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
      
      const units = [
        "porsi", "piring", "mangkok", "mangkuk", "potong", "buah", "butir", 
        "biji", "lembar", "iris", "sendok makan", "sdm", "sendok teh", "sdt", 
        "gelas", "cangkir", "centong", "bungkus", "tusuk", "gram", "gr", "g", "ons", "kg"
      ];
      
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

export const estimateWeightLocally = (foodName, unit, quantity) => {
  const nameLower = foodName.toLowerCase();
  const unitLower = (unit || "porsi").toLowerCase();

  if (["gram", "gr", "g"].includes(unitLower)) {
    return quantity;
  }

  // Exact units mapping from FastAPI
  const unitWeights = {
    "porsi": 150,
    "piring": 200,
    "mangkok": 200,
    "mangkuk": 200,
    "potong": 50,
    "buah": 100,
    "butir": 55,
    "biji": 30,
    "lembar": 20,
    "iris": 25,
    "sendok makan": 15,
    "sdm": 15,
    "sendok teh": 5,
    "sdt": 5,
    "gelas": 240,
    "cangkir": 200,
    "centong": 100,
    "bungkus": 100,
    "tusuk": 30,
    "ons": 100,
    "kg": 1000
  };

  // If a recognized unit is specified (other than generic porsi/piring/mangkok), use its weight.
  if (unitWeights[unitLower] && !["porsi", "piring", "mangkok", "mangkuk"].includes(unitLower)) {
    return unitWeights[unitLower] * quantity;
  }

  // Otherwise check if we have a food-specific baseWeight
  let baseWeight = null;
  if (nameLower.includes("nasi") || nameLower.includes("mie") || nameLower.includes("bihun") || nameLower.includes("kwetiau") || nameLower.includes("bubur")) {
    baseWeight = 150;
  } else if (nameLower.includes("ayam") || nameLower.includes("daging") || nameLower.includes("sapi") || nameLower.includes("ikan") || nameLower.includes("kambing") || nameLower.includes("bebek")) {
    baseWeight = 80;
  } else if (nameLower.includes("telur")) {
    baseWeight = 55;
  } else if (nameLower.includes("tempe") || nameLower.includes("tahu")) {
    baseWeight = 40;
  } else if (nameLower.includes("sayur") || nameLower.includes("bayam") || nameLower.includes("kangkung") || nameLower.includes("buncis") || nameLower.includes("sop") || nameLower.includes("soto")) {
    baseWeight = 100;
  } else if (nameLower.includes("sambal") || nameLower.includes("saus") || nameLower.includes("kecap") || nameLower.includes("mentega") || nameLower.includes("minyak") || nameLower.includes("gula")) {
    baseWeight = 15;
  }

  if (baseWeight !== null) {
    let multiplier = 1.0;
    if (["piring", "mangkok", "mangkuk"].includes(unitLower)) {
      multiplier = 1.33;
    }
    return baseWeight * multiplier * quantity;
  }

  if (unitWeights[unitLower]) {
    return unitWeights[unitLower] * quantity;
  }

  return 100 * quantity;
};

// Only parseInputLocally and estimateWeightLocally are used externally.
// All local fuzzy analysis functions have been removed — analysis is now handled
// directly by FastAPI + ruleEngine.service.js inside scan.controller.js.
