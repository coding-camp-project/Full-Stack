import axios from "axios";

const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

export const sendChatMessage = async ({ message, conversationId }) => {
  const token = getAuthToken();
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await chatbotApi.post(
    "/api/chat",
    {
      message,
      conversationId,
    },
    { headers }
  );

  return response.data;
};

export default {
  sendChatMessage,
};
