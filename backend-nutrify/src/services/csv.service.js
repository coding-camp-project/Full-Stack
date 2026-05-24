import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, "../../csv/indonesian_food_clean.csv");

let cachedFoods = null;

export const loadFoodsFromCSV = () => {
  if (cachedFoods) return cachedFoods;

  try {
    const data = fs.readFileSync(csvFilePath, "utf8");
    const lines = data.split("\n");
    if (lines.length === 0) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    const foods = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(",");
      const foodItem = {};

      headers.forEach((header, idx) => {
        const val = cols[idx] ? cols[idx].trim() : "";
        if (
          [
            "serving_size_g",
            "calories",
            "protein",
            "fat",
            "carbohydrates",
            "sugar",
            "sodium",
            "fiber",
          ].includes(header)
        ) {
          foodItem[header] = parseFloat(val) || 0;
        } else if (
          [
            "is_high_protein",
            "is_high_fiber",
            "is_high_sodium",
          ].includes(header)
        ) {
          foodItem[header] = parseInt(val, 10) || 0;
        } else {
          foodItem[header] = val;
        }
      });

      foods.push(foodItem);
    }

    cachedFoods = foods;
    console.log(`Loaded ${foods.length} foods from CSV.`);
    return cachedFoods;
  } catch (error) {
    console.error("Failed to load CSV:", error);
    return [];
  }
};

const levenshtein = (a, b) => {
  const tmp = [];
  let i, j, alen = a.length, blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  for (i = 0; i <= alen; i++) tmp[i] = [i];
  for (j = 0; j <= blen; j++) tmp[0][j] = j;
  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[alen][blen];
};

export const findBestFoodMatch = (queryName) => {
  const foods = loadFoodsFromCSV();
  const queryClean = queryName.toLowerCase().trim();
  
  let bestFood = null;
  let highestScore = -1;

  for (const food of foods) {
    const foodClean = food.food_name.toLowerCase().trim();
    
    if (foodClean === queryClean) {
      return food;
    }

    let score = 0;
    
    // Substring boost
    if (foodClean.includes(queryClean) || queryClean.includes(foodClean)) {
      score += 0.8;
      const lenDiff = Math.abs(foodClean.length - queryClean.length);
      score += (1 / (1 + lenDiff)) * 0.19;
    }

    // Levenshtein similarity
    const lev = levenshtein(queryClean, foodClean);
    const levSim = 1 - lev / Math.max(queryClean.length, foodClean.length);
    score += levSim * 0.1;

    if (score > highestScore) {
      highestScore = score;
      bestFood = food;
    }
  }

  return bestFood;
};
