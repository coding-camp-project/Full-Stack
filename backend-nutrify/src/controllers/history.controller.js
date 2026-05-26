import * as historyService from "../services/history.service.js";
import { calculateDailyNeeds } from "../services/ruleEngine.service.js";

export const getHistory = async (req, res) => {
  try {
    const history = await historyService.getUserHistory(req.user._id);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHistoryDetail = async (req, res) => {
  try {
    const history = await historyService.getHistoryById(req.params.id, req.user._id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const deleted = await historyService.deleteHistoryById(req.params.id, req.user._id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Riwayat tidak ditemukan atau tidak berwenang menghapus.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Riwayat makan berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;

    // 1. Calculate personalized target
    const targets = calculateDailyNeeds(user);

    // 2. Aggregate today's consumed nutrients
    const aggregatedNutrition = await historyService.getTodayNutritionTotals(userId);

    // 3. Calculate percentages
    const percentages = {
      calories: targets.targetCalories > 0 ? Math.round((aggregatedNutrition.calories / targets.targetCalories) * 100) : 0,
      protein: targets.targetProtein > 0 ? Math.round((aggregatedNutrition.protein / targets.targetProtein) * 100) : 0,
      carbs: targets.targetCarbs > 0 ? Math.round((aggregatedNutrition.carbs / targets.targetCarbs) * 100) : 0,
      fat: targets.targetFat > 0 ? Math.round((aggregatedNutrition.fat / targets.targetFat) * 100) : 0,
      sugar: targets.targetSugar > 0 ? Math.round((aggregatedNutrition.sugar / targets.targetSugar) * 100) : 0,
      sodium: targets.targetSodium > 0 ? Math.round((aggregatedNutrition.sodium / targets.targetSodium) * 100) : 0,
      fiber: targets.targetFiber > 0 ? Math.round((aggregatedNutrition.fiber / targets.targetFiber) * 100) : 0,
    };

    // 4. Get 6-day trend
    const chartData = await historyService.getCaloriesTrend(userId);

    // 5. Get raw history for rendering items
    const rawHistory = await historyService.getUserHistory(userId);

    return res.status(200).json({
      success: true,
      data: {
        targets,
        aggregatedNutrition,
        percentages,
        chartData,
        history: rawHistory,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
