import History from "../models/history.model.js";

export const createHistory = async (historyData) => {
  return await History.create(historyData);
};

export const getUserHistory = async (userId) => {
  return await History.find({ userId }).sort({ createdAt: -1 });
};

export const getHistoryById = async (id, userId) => {
  return await History.findOne({ _id: id, userId });
};
