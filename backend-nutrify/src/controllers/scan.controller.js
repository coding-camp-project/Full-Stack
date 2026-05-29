import axios from "axios";
import FormData from "form-data";
import * as historyService from "../services/history.service.js";
import { runRuleEngine, getUnifiedLLMRecommendation } from "../services/ruleEngine.service.js";
import { parseInputLocally, estimateWeightLocally } from "../services/manualScan.service.js";
import { findBestFoodMatch } from "../services/csv.service.js";

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
    const mlApiUrl = (process.env.ML_API_URL || "https://damassdev-nutrify-ai-api.hf.space").replace(/\/$/, "");

    // Call Deployed AI model Search API
    const response = await axios.get(`${mlApiUrl}/search-food?q=${encodeURIComponent(cleanQuery)}&limit=15`);
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
    const mlApiUrl = (process.env.ML_API_URL || "https://damassdev-nutrify-ai-api.hf.space").replace(/\/$/, "");

    // 1. Add Image if available
    if (req.file) {
      formData.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
    }

    // 2. Add Disease mapped to FastAPI choices (pass the first mapped disease in the main call)
    const mappedDiseases = mapDiseasesForFastAPI(req.user);
    if (mappedDiseases.length > 0) {
      formData.append("disease", mappedDiseases[0]);
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
    const response = await axios.post(`${mlApiUrl}/predict`, formData, {
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

    // Find serving size from CSV dataset (or closest match)
    const csvMatch = findBestFoodMatch(formattedFoodName);
    const servingSizeG = csvMatch?.serving_size_g || 100;
    const servingUnit = getServingUnit(formattedFoodName);

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

    // Combine recommendations from FastAPI for all mapped diseases
    const fastapiRecommendations = [];
    if (fastapiResult.recommendation) {
      fastapiRecommendations.push(fastapiResult.recommendation);
    }

    if (mappedDiseases.length > 1) {
      console.log(`User has multiple diseases (${mappedDiseases.join(", ")}). Fetching additional recommendations from damasdev API...`);
      for (let i = 1; i < mappedDiseases.length; i++) {
        const nextDisease = mappedDiseases[i];
        try {
          const additionalFormData = new FormData();
          additionalFormData.append("disease", nextDisease);
          additionalFormData.append("manual_items", JSON.stringify([{
            food_name: formattedFoodName,
            quantity: 1,
            unit: "porsi",
            estimated_weight_g: 100,
            total_gram: 100
          }]));

          const additionalResponse = await axios.post(`${mlApiUrl}/predict`, additionalFormData, {
            headers: {
              ...additionalFormData.getHeaders(),
            },
          });
          if (additionalResponse.data?.recommendation) {
            fastapiRecommendations.push(additionalResponse.data.recommendation);
          }
        } catch (addError) {
          console.error(`Failed to fetch additional recommendation for ${nextDisease} from damasdev API:`, addError.message);
        }
      }
    }

    let analysisResult = null;

    console.log("Calling Gemini LLM for recommendation and analysis...");
    try {
      const unifiedResult = await getUnifiedLLMRecommendation(formattedFoodName, nutrition, req.user, fastapiRecommendations);
      if (unifiedResult) {
        analysisResult = {
          healthScore: unifiedResult.healthScore || 50,
          healthGrade: unifiedResult.healthGrade || "C",
          healthAnalysis: (unifiedResult.healthAnalysis || []).map(a => a.replace(/diet/gi, "pola makan")),
          warning: unifiedResult.warning || "",
          recommendation: (unifiedResult.recommendation || "").replace(/diet/gi, "pola makan"),
          alternatives: unifiedResult.alternatives || [],
        };
      }
    } catch (geminiError) {
      console.error("Gemini call failed during scan:", geminiError);
    }

    if (!analysisResult) {
      console.warn("Unified LLM recommendation failed or returned null, falling back to local rule engine...");
      const ruleResult = await runRuleEngine(meal, req.user);
      const isAllergenDetected = ruleResult.healthAnalysis.some(a => a.includes("alergen") || a.includes("PERINGATAN KERAS"));
      const fallbackRec = isAllergenDetected
        ? ruleResult.recommendation
        : (ruleResult.recommendation || `Rekomendasi pola makan Anda: ${ruleResult.healthAnalysis.join(" ")}`);
      
      analysisResult = {
        healthScore: ruleResult.healthScore,
        healthGrade: ruleResult.healthGrade,
        healthAnalysis: ruleResult.healthAnalysis.map(a => a.replace(/diet/gi, "pola makan")),
        warning: ruleResult.warning || "",
        recommendation: fallbackRec.replace(/diet/gi, "pola makan"),
        alternatives: ruleResult.alternatives || [],
      };
    }

    // Calculate unique components count (prevent duplicate counting, case-insensitive, trim space/empty, support AI + manual)
    const uniqueComponents = new Set();
    
    // 1. Add AI prediction food name
    if (fastapiResult.image_result?.best_prediction?.food_name) {
      const norm = fastapiResult.image_result.best_prediction.food_name.toLowerCase().replace(/_/g, " ").trim();
      if (norm) uniqueComponents.add(norm);
    }
    
    // 2. Add manual items from FastAPI result
    if (fastapiResult.manual_items && fastapiResult.manual_items.length > 0) {
      fastapiResult.manual_items.forEach((m) => {
        if (m.food_name) {
          const norm = m.food_name.toLowerCase().replace(/_/g, " ").trim();
          if (norm) uniqueComponents.add(norm);
        }
      });
    } else if (manualInput && manualInput.trim()) {
      // Fallback: parse manualInput locally if FastAPI result didn't include them
      const parsedItems = parseInputLocally(manualInput);
      parsedItems.forEach((m) => {
        if (m.food_name) {
          const norm = m.food_name.toLowerCase().replace(/_/g, " ").trim();
          if (norm) uniqueComponents.add(norm);
        }
      });
    }

    const componentsCount = uniqueComponents.size || 1;

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
      recommendation: analysisResult.recommendation,
      healthAnalysis: analysisResult.healthAnalysis || [],
      healthScore: analysisResult.healthScore || 0,
      components: componentsCount,
      serving_size_g: servingSizeG,
      serving_unit: servingUnit,
    });

    // Return final enriched response to frontend
    return res.status(200).json({
      success: true,
      best_prediction: {
        food_name: formattedFoodName,
        confidence_score: fastapiResult.image_result?.best_prediction?.confidence_score || 1.0,
        serving_size_g: servingSizeG,
        serving_unit: servingUnit,
      },
      nutrition,
      recommendation: analysisResult.recommendation,
      warning: analysisResult.warning || analysisResult.healthAnalysis.find((a) => a.startsWith("⚠️"))?.replace("⚠️", "").trim() || "",
      healthScore: analysisResult.healthScore,
      healthGrade: analysisResult.healthGrade,
      healthAnalysis: analysisResult.healthAnalysis,
      alternatives: analysisResult.alternatives,
      historyId: history._id,
      components: componentsCount,
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
