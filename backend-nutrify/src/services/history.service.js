import mongoose from "mongoose";
import History from "../models/history.model.js";

export const createHistory = async (historyData) => {
  return await History.create(historyData);
};

export const getUserHistory = async (userId) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return await History.find({ 
    userId,
    createdAt: { $gte: startOfToday }
  }).sort({ createdAt: -1 });
};

export const getHistoryById = async (id, userId) => {
  return await History.findOne({ _id: id, userId });
};

export const deleteHistoryById = async (id, userId) => {
  return await History.findOneAndDelete({ _id: id, userId });
};

export const getTodayNutritionTotals = async (userId) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const results = await History.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startOfToday }
      }
    },
    {
      $group: {
        _id: null,
        calories: { $sum: "$calories" },
        protein: { $sum: "$protein" },
        carbs: { $sum: "$carbs" },
        fat: { $sum: "$fat" },
        sugar: { $sum: "$sugar" },
        sodium: { $sum: "$sodium" },
        fiber: { $sum: "$fiber" }
      }
    }
  ]);

  if (results.length > 0) {
    return {
      calories: Math.round(results[0].calories || 0),
      protein: parseFloat((results[0].protein || 0).toFixed(1)),
      carbs: parseFloat((results[0].carbs || 0).toFixed(1)),
      fat: parseFloat((results[0].fat || 0).toFixed(1)),
      sugar: parseFloat((results[0].sugar || 0).toFixed(1)),
      sodium: parseFloat((results[0].sodium || 0).toFixed(1)),
      fiber: parseFloat((results[0].fiber || 0).toFixed(1))
    };
  }

  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    sodium: 0,
    fiber: 0
  };
};

export const getCaloriesTrend = async (userId) => {
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 5);
  sixDaysAgo.setHours(0, 0, 0, 0);

  const results = await History.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: sixDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "+07:00" }
        },
        calories: { $sum: "$calories" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const trendMap = {};
  results.forEach(r => {
    trendMap[r._id] = r.calories;
  });

  const trend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    
    trend.push({
      date: dateStr,
      label: d.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
      calories: Math.round(trendMap[dateStr] || 0)
    });
  }

  return trend;
};
