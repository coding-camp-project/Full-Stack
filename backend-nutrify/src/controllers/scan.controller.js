import mongoose from "mongoose";
import axios from "axios";
import FormData from "form-data";
import * as historyService from "../services/history.service.js";
import { runRuleEngine, getUnifiedLLMRecommendation, analyzeImageWithGemini, scanFoodWithGeminiDirectly } from "../services/ruleEngine.service.js";
import { parseInputLocally, estimateWeightLocally } from "../services/manualScan.service.js";
import { findBestFoodMatch, loadFoodsFromCSV } from "../services/csv.service.js";

// Map food names to standard Indonesian portions/units
const getServingUnit = (foodName) => {
  const name = (foodName || "").toLowerCase();
  if (name.includes("tomat")) return "iris";
  if (name.includes("selada") || name.includes("roti")) return "lembar";
  if (name.includes("ayam") || name.includes("daging") || name.includes("tempe") || name.includes("tahu") || name.includes("ikan") || name.includes("bebek")) return "potong";
  if (name.includes("telur")) return "butir";
  if (name.includes("pisang") || name.includes("apel") || name.includes("jeruk") || name.includes("mangga") || name.includes("alpukat") || name.includes("melon") || name.includes("semangka") || name.includes("buah")) return "buah";
  if (name.includes("nasi") || name.includes("mie") || name.includes("bihun") || name.includes("kwetiau") || name.includes("bubur")) return "porsi";
  if (name.includes("susu") || name.includes("jus") || name.includes("teh") || name.includes("kopi")) return "gelas";
  if (name.includes("sambal") || name.includes("saus") || name.includes("kecap") || name.includes("gula") || name.includes("mentega") || name.includes("minyak") || name.includes("madu")) return "sendok makan";
  if (name.includes("sayur") || name.includes("bayam") || name.includes("kangkung") || name.includes("buncis") || name.includes("sop") || name.includes("soto")) return "mangkuk";
  return "porsi";
};

const isGeminiQuotaError = (error) => {
  if (!error) return false;
  const message = String(error.message || error).toLowerCase();
  return message.includes("429") || 
         message.includes("quota") || 
         message.includes("limit") || 
         message.includes("exhausted") || 
         message.includes("503") || 
         message.includes("high demand") ||
         message.includes("resource_exhausted");
};

// Map user diseases to FastAPI strict options (returns all matching diseases)
const mapDiseasesForFastAPI = (user) => {
  if (!user) return [];
  const conditions = (user.healthConditions || []).concat(user.otherConditions ? [user.otherConditions] : []).map(c => c.toLowerCase().trim());
  const mapped = new Set();
  for (const cond of conditions) {
    if (cond.includes("diabet") || cond.includes("gula") || cond.includes("manis")) mapped.add("diabetes");
    if (cond.includes("hiper") || cond.includes("tensi") || cond.includes("darah tinggi")) mapped.add("hipertensi");
    if (cond.includes("koles") || cond.includes("jantung")) mapped.add("kolesterol");
    if (cond.includes("asam") || cond.includes("urat")) mapped.add("asam_urat");
    if (cond.includes("obes") || cond.includes("gemuk") || cond.includes("berat")) mapped.add("obesitas");
  }
  return Array.from(mapped);
};

/**
 * Autocomplete / search-food suggestions controller
 */
export const suggestFood = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const cleanQuery = q.trim();
    const cleanQueryLower = cleanQuery.toLowerCase();
    const mlApiUrl = (process.env.ML_API_URL || "https://damassdev-nutrify-ai-api.hf.space").replace(/\/$/, "");

    // 1. Search locally in Indonesian food CSV dataset first (instant)
    const foods = loadFoodsFromCSV();
    const localMatches = foods
      .filter((f) => f.food_name && f.food_name.toLowerCase().includes(cleanQueryLower))
      .map((f) => f.food_name);

    // Sort matches: startsWith gets higher priority than includes, then shorter length first
    localMatches.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aStarts = aLower.startsWith(cleanQueryLower);
      const bStarts = bLower.startsWith(cleanQueryLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.length - b.length;
    });

    let suggestions = [...localMatches];

    // 2. Fetch from remote Hugging Face API with short timeout fallback
    try {
      const response = await axios.get(
        `${mlApiUrl}/search-food?q=${encodeURIComponent(cleanQuery)}&limit=15`,
        { timeout: 400 } // Fail fast to keep autocomplete responsive
      );
      const data = response.data;
      const hfSuggestions = (data.candidates || []).map((c) => c.food_name);

      // Merge and remove duplicates
      const merged = new Set([...localMatches, ...hfSuggestions]);
      suggestions = Array.from(merged);
    } catch (error) {
      console.warn("HF Space search-food failed or timed out, falling back to local CSV matches:", error.message);
    }

    // Return top 15 suggestions
    return res.status(200).json({
      success: true,
      suggestions: suggestions.slice(0, 15),
    });
  } catch (error) {
    console.error("Autocomplete suggestFood error:", error.message);
    return res.status(500).json({ success: false, message: "Error retrieving autocomplete suggestions." });
  }
};

/**
 * Scan food controller
 */
export const scanFood = async (req, res) => {
  try {
    const { manualInput } = req.body;

    if (!req.file && (!manualInput || !manualInput.trim())) {
      return res.status(400).json({ success: false, message: "No image or manual input provided." });
    }

    console.log("Processing scan using Gemini Direct Scan...");
    console.time("Gemini Direct Scan");

    let geminiResult = null;
    try {
      geminiResult = await scanFoodWithGeminiDirectly(
        req.file ? req.file.buffer : null,
        req.file ? req.file.mimetype : null,
        manualInput,
        req.user
      );
    } catch (geminiError) {
      console.error("Direct Gemini scan failed, falling back to HuggingFace space:", geminiError.message || geminiError);
    }
    console.timeEnd("Gemini Direct Scan");

    let finalResult = null;

    if (geminiResult) {
      finalResult = {
        food_name: geminiResult.food_name,
        serving_size_g: geminiResult.serving_size_g || 100,
        serving_unit: geminiResult.serving_unit || "porsi",
        nutrition: geminiResult.nutrition || {},
        healthScore: geminiResult.healthScore || 50,
        healthGrade: geminiResult.healthGrade || "C",
        healthAnalysis: geminiResult.healthAnalysis || [],
        warning: geminiResult.warning || "",
        recommendation: geminiResult.recommendation || "",
        alternatives: geminiResult.alternatives || [],
      };
    } else {

      console.log("Executing fallback Hugging Face Space path...");
      const formData = new FormData();
      const mlApiUrl = (process.env.ML_API_URL || "https://damassdev-nutrify-ai-api.hf.space").replace(/\/$/, "");

      if (req.file) {
        formData.append("image", req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });
      }

      const mappedDiseases = mapDiseasesForFastAPI(req.user);
      if (mappedDiseases.length > 0) {
        formData.append("disease", mappedDiseases[0]);
      }

      let localManualItems = [];
      if (manualInput && manualInput.trim()) {
        localManualItems = parseInputLocally(manualInput).map(item => {
          const weight = estimateWeightLocally(item.food_name, item.unit, item.quantity);
          return {
            food_name: item.food_name,
            quantity: item.quantity,
            unit: item.unit,
            estimated_weight_g: weight,
            total_gram: weight
          };
        });
        formData.append("manual_items", JSON.stringify(localManualItems));
      }

      console.time("Fallback: HuggingFace predict API");
      const response = await axios.post(`${mlApiUrl}/predict`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 15000
      });
      console.timeEnd("Fallback: HuggingFace predict API");

      const fastapiResult = response.data;
      let isSuccess = fastapiResult.success || fastapiResult.sucess || fastapiResult.succes === true;
      const hasManualInput = localManualItems.length > 0;

      let nutrition = fastapiResult.grand_total_nutrition || fastapiResult.nutrition || {};
      let foodNamesList = [];

      if (!isSuccess && req.file) {
        console.log("FastAPI image analysis failed, attempting Gemini Vision fallback...");
        try {
          const geminiVisionResult = await analyzeImageWithGemini(req.file.buffer, req.file.mimetype);
          if (geminiVisionResult && geminiVisionResult.food_name) {
            isSuccess = true;
            foodNamesList.push(geminiVisionResult.food_name);
            nutrition = geminiVisionResult.nutrition;
          }
        } catch (geminiError) {
          console.error("Gemini Vision fallback also failed:", geminiError.message);
        }
      }

      if (!isSuccess && hasManualInput) {
         isSuccess = true;
         let totalNutrition = { calories: 0, protein: 0, fat: 0, carbohydrates: 0, sugar: 0, sodium: 0, fiber: 0 };
         localManualItems.forEach(item => {
            foodNamesList.push(item.food_name);
            const match = findBestFoodMatch(item.food_name);
            if (match) {
               const factor = item.estimated_weight_g / 100;
               totalNutrition.calories += (match.calories || 0) * factor;
               totalNutrition.protein += (match.protein || 0) * factor;
               totalNutrition.fat += (match.fat || 0) * factor;
               totalNutrition.carbohydrates += (match.carbohydrates || 0) * factor;
               totalNutrition.sugar += (match.sugar || 0) * factor;
               totalNutrition.sodium += (match.sodium || 0) * factor;
               totalNutrition.fiber += (match.fiber || 0) * factor;
            }
         });
         nutrition = totalNutrition;
      }

      if (!isSuccess) {
        return res.status(422).json({
          success: false,
          message: "Gambar kurang jelas, tolong foto lebih detail atau lebih dekat. Jika masih tidak terdeteksi, silakan input manual."
        });
      }

      if (fastapiResult.image_result?.best_prediction?.food_name) {
        foodNamesList.push(fastapiResult.image_result.best_prediction.food_name);
      }
      if (fastapiResult.manual_items && fastapiResult.manual_items.length > 0) {
        const manualNames = fastapiResult.manual_items.map((m) => m.food_name).filter(Boolean);
        foodNamesList.push(...manualNames);
      }

      const foodName = foodNamesList.join(", ") || "Makanan";
      const formattedFoodName = foodName.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

      const csvMatch = findBestFoodMatch(formattedFoodName);
      const servingSizeG = csvMatch?.serving_size_g || 100;
      const servingUnit = getServingUnit(formattedFoodName);

      const meal = {
        food_name: formattedFoodName,
        calories: nutrition.calories || 0,
        protein: nutrition.protein || 0,
        fat: nutrition.fat || 0,
        carbohydrates: nutrition.carbohydrates || 0,
        sugar: nutrition.sugar || 0,
        sodium: nutrition.sodium || 0,
        fiber: nutrition.fiber || 0,
      };

      const ruleResult = await runRuleEngine(meal, req.user);
      const fastapiRecommendations = fastapiResult.recommendation ? [fastapiResult.recommendation] : [];

      let analysisResult = null;
      try {
        const unifiedResult = await getUnifiedLLMRecommendation(formattedFoodName, nutrition, req.user, fastapiRecommendations, ruleResult);
        if (unifiedResult) {
          analysisResult = {
            healthScore: ruleResult.healthScore || 50,
            healthGrade: ruleResult.healthGrade || "C",
            healthAnalysis: (unifiedResult.healthAnalysis || []).map(a => a.replace(/diet/gi, "pola makan")),
            warning: unifiedResult.warning || "",
            recommendation: (unifiedResult.recommendation || "").replace(/diet/gi, "pola makan"),
            alternatives: ruleResult.alternatives || [],
          };
        }
      } catch (geminiRefError) {
        console.error("Gemini refinement failed during fallback:", geminiRefError);
      }

      if (!analysisResult) {
        analysisResult = {
          healthScore: ruleResult.healthScore,
          healthGrade: ruleResult.healthGrade,
          healthAnalysis: ruleResult.healthAnalysis.map(a => a.replace(/diet/gi, "pola makan")),
          warning: ruleResult.warning || "",
          recommendation: ruleResult.recommendation.replace(/diet/gi, "pola makan"),
          alternatives: ruleResult.alternatives || [],
        };
      }

      finalResult = {
        food_name: formattedFoodName,
        serving_size_g: servingSizeG,
        serving_unit: servingUnit,
        nutrition,
        healthScore: analysisResult.healthScore,
        healthGrade: analysisResult.healthGrade,
        healthAnalysis: analysisResult.healthAnalysis,
        warning: analysisResult.warning,
        recommendation: analysisResult.recommendation,
        alternatives: analysisResult.alternatives,
      };
    }

    const historyId = new mongoose.Types.ObjectId();
    const imageBase64 = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}` : "";
    
    historyService.createHistory({
      _id: historyId,
      userId: req.user._id,
      foodName: finalResult.food_name,
      image: imageBase64,
      calories: finalResult.nutrition.calories || 0,
      protein: finalResult.nutrition.protein || 0,
      carbs: finalResult.nutrition.carbohydrates || 0,
      fat: finalResult.nutrition.fat || 0,
      fiber: finalResult.nutrition.fiber || 0,
      sugar: finalResult.nutrition.sugar || 0,
      sodium: finalResult.nutrition.sodium || 0,
      confidence: 1.0,
      recommendation: finalResult.recommendation,
      healthAnalysis: finalResult.healthAnalysis,
      healthScore: finalResult.healthScore,
      components: finalResult.alternatives.length || 1,
      serving_size_g: finalResult.serving_size_g,
      serving_unit: finalResult.serving_unit,
    }).catch(historyErr => {
      console.error("Failed to save scan history to DB in background:", historyErr);
    });


    return res.status(200).json({
      success: true,
      best_prediction: {
        food_name: finalResult.food_name,
        confidence_score: 1.0,
        serving_size_g: finalResult.serving_size_g,
        serving_unit: finalResult.serving_unit,
      },
      nutrition: finalResult.nutrition,
      recommendation: finalResult.recommendation,
      warning: finalResult.warning,
      healthScore: finalResult.healthScore,
      healthGrade: finalResult.healthGrade,
      healthAnalysis: finalResult.healthAnalysis,
      alternatives: finalResult.alternatives,
      historyId: historyId,
      components: finalResult.alternatives.length || 1,
    });

  } catch (error) {
    console.error("Scan API Error:", error.response?.data || error.message);
    let errorMessage = "Terjadi kesalahan pada AI model scanner.";
    if (error.response?.data?.detail) {
      errorMessage = typeof error.response.data.detail === "string" 
        ? error.response.data.detail 
        : JSON.stringify(error.response.data.detail);
    }
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
