import axios from "axios";
import FormData from "form-data";
import * as historyService from "../services/history.service.js";

const toTitleCase = (value = "") =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const buildHealthAnalysis = (nutrition = {}, warning = "") => {
  const analysis = [];

  if ((nutrition.sodium || 0) > 400) {
    analysis.push("Kandungan sodium dalam makanan ini tergolong cukup tinggi.");
  } else {
    analysis.push("Kandungan sodium masih dalam batas aman.");
  }

  if ((nutrition.sugar || 0) > 10) {
    analysis.push("Perhatikan asupan gula pada makanan ini.");
  } else {
    analysis.push("Kandungan gula dalam batas wajar.");
  }

  if (warning) {
    analysis.push(warning);
  }

  return analysis;
};

export const scanFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided." });
    }

    const { disease } = req.body;

    // Build form data
    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    if (disease) {
      formData.append("disease", disease);
    }

    // Call FastAPI
    const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const scanResult = response.data;
    const nutrition = scanResult.nutrition || {};
    const foodName = toTitleCase(scanResult.best_prediction?.food_name || "Makanan");
    const image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const history = await historyService.createHistory({
      userId: req.user._id,
      foodName,
      image,
      calories: nutrition.calories || 0,
      protein: nutrition.protein || 0,
      carbs: nutrition.carbohydrates || nutrition.carbs || 0,
      fat: nutrition.fat || 0,
      fiber: nutrition.fiber || 0,
      sugar: nutrition.sugar || 0,
      sodium: nutrition.sodium || 0,
      confidence: scanResult.best_prediction?.confidence_score || 0,
      recommendation: scanResult.recommendation || "",
      healthAnalysis: buildHealthAnalysis(nutrition, scanResult.warning),
    });

    return res.status(200).json({
      ...scanResult,
      historyId: history._id,
    });
  } catch (error) {
    console.error("Scan API Error:", error.response?.data || error.message);
    
    let errorMessage = "Failed to process image.";
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        errorMessage = error.response.data.detail.map(e => e.msg).join(", ");
      } else if (typeof error.response.data.detail === "string") {
        errorMessage = error.response.data.detail;
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "AI Service is not reachable (ECONNREFUSED).";
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
