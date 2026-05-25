import axios from "axios";
import FormData from "form-data";
import * as historyService from "../services/history.service.js";
import { runRuleEngine } from "../services/ruleEngine.service.js";
import { parseInputLocally, estimateWeightLocally } from "../services/manualScan.service.js";

// Map user diseases to FastAPI strict options
const mapDiseaseForFastAPI = (user) => {
  if (!user) return null;
  const conditions = (user.healthConditions || []).concat(user.otherConditions ? [user.otherConditions] : []).map(c => c.toLowerCase().trim());
  for (const cond of conditions) {
    if (cond.includes("diabet") || cond.includes("gula") || cond.includes("manis")) return "diabetes";
    if (cond.includes("hiper") || cond.includes("tensi") || cond.includes("darah tinggi")) return "hipertensi";
    if (cond.includes("koles") || cond.includes("jantung")) return "kolesterol";
    if (cond.includes("asam") || cond.includes("urat")) return "asam_urat";
    if (cond.includes("obes") || cond.includes("gemuk") || cond.includes("berat")) return "obesitas";
  }
  return null;
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

    // Call Deployed AI model Search API
    const response = await axios.get(`https://damassdev-nutrify-ai-api.hf.space/search-food?q=${encodeURIComponent(cleanQuery)}&limit=15`);
    const data = response.data;

    // Map candidates to suggestions array
    const suggestions = (data.candidates || []).map((c) => c.food_name);

    return res.status(200).json({
      success: true,
      suggestions,
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

    const formData = new FormData();

    // 1. Add Image if available
    if (req.file) {
      formData.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
    }

    // 2. Add Disease mapped to FastAPI choices
    const mappedDisease = mapDiseaseForFastAPI(req.user);
    if (mappedDisease) {
      formData.append("disease", mappedDisease);
    }

    // 3. Add Manual Items if available
    if (manualInput && manualInput.trim()) {
      const parsedItems = parseInputLocally(manualInput).map(item => {
        const weight = estimateWeightLocally(item.food_name, item.unit, item.quantity);
        return {
          food_name: item.food_name,
          quantity: item.quantity,
          unit: item.unit,
          estimated_weight_g: weight,
          total_gram: weight
        };
      });
      formData.append("manual_items", JSON.stringify(parsedItems));
    }

    // Call Hugging Face Deployed FastAPI Model
    console.log("Calling Deployed AI Model at HF Space...");
    const response = await axios.post("https://damassdev-nutrify-ai-api.hf.space/predict", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const fastapiResult = response.data;
    
    // Support all spelling variants of success ("success", "sucess", "succes")
    const isSuccess = fastapiResult.success || fastapiResult.sucess || fastapiResult.succes === true;

    if (!isSuccess) {
      const customMessage = "Gambar kurang jelas, tolong foto lebih detail atau lebih dekat. Jika masih tidak terdeteksi, silakan input manual menggunakan tulisan/ketik.";
      return res.status(422).json({
        success: false,
        message: customMessage
      });
    }

    // Extract nutrition
    const nutrition = fastapiResult.grand_total_nutrition || fastapiResult.nutrition || {};

    // Get food names by combining image prediction and manual items
    let foodNamesList = [];
    if (fastapiResult.image_result?.best_prediction?.food_name) {
      foodNamesList.push(fastapiResult.image_result.best_prediction.food_name);
    }
    if (fastapiResult.manual_items && fastapiResult.manual_items.length > 0) {
      const manualNames = fastapiResult.manual_items.map((m) => m.food_name).filter(Boolean);
      foodNamesList.push(...manualNames);
    }
    
    const foodName = foodNamesList.join(", ") || "Makanan";

    // Format food name to Title Case
    const formattedFoodName = foodName
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

    // Run local Rule Engine to calculate health score, grade, and analysis comments
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

    // Determine recommendation: if the rule engine (local or LLM) flags any health warnings, 
    // we bypass the FastAPI prediction recommendation to avoid displaying false "safe" advice.
    const hasWarning = ruleResult.warning || ruleResult.healthAnalysis.some((a) => a.startsWith("⚠️"));
    const finalRecommendation = hasWarning
      ? (ruleResult.recommendation || `Rekomendasi diet Anda: ${ruleResult.healthAnalysis.join(" ")}`)
      : (ruleResult.recommendation || fastapiResult.recommendation || `Rekomendasi diet Anda: ${ruleResult.healthAnalysis.join(" ")}`);

    // Save to Database Scan History
    const imageBase64 = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}` : "";
    const history = await historyService.createHistory({
      userId: req.user._id,
      foodName: formattedFoodName,
      image: imageBase64,
      calories: nutrition.calories || 0,
      protein: nutrition.protein || 0,
      carbs: nutrition.carbohydrates || 0,
      fat: nutrition.fat || 0,
      fiber: nutrition.fiber || 0,
      sugar: nutrition.sugar || 0,
      sodium: nutrition.sodium || 0,
      confidence: fastapiResult.image_result?.best_prediction?.confidence_score || 1.0,
      recommendation: finalRecommendation,
      healthAnalysis: ruleResult.healthAnalysis || [],
      healthScore: ruleResult.healthScore || 0,
    });

    // Return final enriched response to frontend
    return res.status(200).json({
      success: true,
      best_prediction: {
        food_name: formattedFoodName,
        confidence_score: fastapiResult.image_result?.best_prediction?.confidence_score || 1.0,
      },
      nutrition,
      recommendation: finalRecommendation,
      warning: ruleResult.warning || ruleResult.healthAnalysis.find((a) => a.startsWith("⚠️"))?.replace("⚠️", "").trim() || "",
      healthScore: ruleResult.healthScore,
      healthGrade: ruleResult.healthGrade,
      healthAnalysis: ruleResult.healthAnalysis,
      alternatives: ruleResult.alternatives,
      historyId: history._id,
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
