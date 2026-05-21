import axios from "axios";

const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendChatMessage = async ({ message, conversationId }) => {
  const response = await chatbotApi.post("/api/chat", {
    message,
    conversationId,
  });

  return response.data;
};

export default {
  sendChatMessage,
};
