import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthToken = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

const getAuthHeaders = () => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Sesi login kedaluwarsa. Silakan masuk kembali.");
  }

  return { Authorization: `Bearer ${token}` };
};

export const getHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/history`, {
    headers: getAuthHeaders(),
  });

  return response.data.data ?? [];
};

export const getDashboardSummary = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/history/summary`, {
    headers: getAuthHeaders(),
  });
  return response.data.data ?? null;
};

export const getHistoryById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/api/history/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data.data ?? null;
};

export const deleteHistoryItem = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/api/history/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const saveLocalHistoryFallback = (historyItem) => {
  const historyStr = localStorage.getItem("scanHistory");
  const history = historyStr ? JSON.parse(historyStr) : [];
  history.unshift(historyItem);
  localStorage.setItem("scanHistory", JSON.stringify(history));
};
