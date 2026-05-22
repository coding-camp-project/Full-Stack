import History from "../models/history.model.js";

export const createHistory = async (historyData) => {
  return await History.create(historyData);
};

export const getUserHistory = async (userId) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return await History.find({ 
    userId,
    createdAt: { $gte: twentyFourHoursAgo }
  }).sort({ createdAt: -1 });
};

export const getHistoryById = async (id, userId) => {
  return await History.findOne({ _id: id, userId });
};
