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
