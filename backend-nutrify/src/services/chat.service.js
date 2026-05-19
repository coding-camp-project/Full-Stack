import axios from "axios";
import crypto from "crypto";

import Chat from "../models/chat.model.js";

const createConversationId = () => crypto.randomUUID();

const getFastApiChatUrl = () => process.env.FASTAPI_CHAT_URL || "http://localhost:8000/chat";

const getAiRequestTimeout = () => Number(process.env.AI_REQUEST_TIMEOUT_MS) || 30000;

const saveChatMessage = async ({ userId, conversationId, role, message }) => {
  return Chat.create({
    userId: userId || null,
    conversationId,
    role,
    message,
    timestamp: new Date(),
  });
};

const extractReply = (data) => {
  if (typeof data?.reply === "string") return data.reply;
  if (typeof data?.response === "string") return data.response;
  if (typeof data?.message === "string") return data.message;

  return "";
};

export const sendMessageToAI = async (message) => {
  try {
    const response = await axios.post(
      getFastApiChatUrl(),
      { message },
      {
        timeout: getAiRequestTimeout(),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = extractReply(response.data);

    if (!reply) {
      const error = new Error("AI server returned an invalid response.");
      error.statusCode = 502;
      throw error;
    }

    return reply;
  } catch (error) {
    if (error.statusCode) throw error;

    if (error.code === "ECONNABORTED") {
      const timeoutError = new Error("AI server request timed out.");
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    if (error.response) {
      const upstreamError = new Error(
        error.response.data?.message || "AI server returned an error."
      );
      upstreamError.statusCode = error.response.status >= 500 ? 502 : error.response.status;
      throw upstreamError;
    }

    const offlineError = new Error("AI server is unavailable.");
    offlineError.statusCode = 503;
    throw offlineError;
  }
};

export const handleChatMessage = async ({ message, userId, conversationId }) => {
  const activeConversationId = conversationId || createConversationId();

  await saveChatMessage({
    userId,
    conversationId: activeConversationId,
    role: "user",
    message,
  });

  const reply = await sendMessageToAI(message);

  await saveChatMessage({
    userId,
    conversationId: activeConversationId,
    role: "assistant",
    message: reply,
  });

  return {
    reply,
    conversationId: activeConversationId,
  };
};

export const getConversationHistory = async (conversationId) => {
  return Chat.find({ conversationId }).sort({ timestamp: 1, createdAt: 1 });
};
