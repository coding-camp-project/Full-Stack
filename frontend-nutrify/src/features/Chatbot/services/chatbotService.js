import axios from "axios";

const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendChatMessage = async (message) => {
  const response = await chatbotApi.post("/api/chat", {
    message,
  });

  return response.data;
};

export default {
  sendChatMessage,
};
