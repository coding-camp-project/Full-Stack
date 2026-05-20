import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";

import Chat from "../models/chat.model.js";

const createConversationId = () => crypto.randomUUID();

const saveChatMessage = async ({ userId, conversationId, role, message }) => {
  return Chat.create({
    userId: userId || null,
    conversationId,
    role,
    message,
    timestamp: new Date(),
  });
};

export const getConversationHistory = async (conversationId) => {
  return Chat.find({ conversationId }).sort({ timestamp: 1, createdAt: 1 });
};

export const sendMessageToAI = async (message, history = []) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format previous messages to match Gemini's chat history format
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.message }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    if (!reply) {
      const error = new Error("AI returned an invalid response.");
      error.statusCode = 502;
      throw error;
    }

    return reply;
  } catch (error) {
    if (error.statusCode) throw error;
    
    console.error("Gemini API Error:", error);

    const backendError = new Error("Failed to connect to Gemini API.");
    backendError.statusCode = 500;
    throw backendError;
  }
};

export const handleChatMessage = async ({ message, userId, conversationId }) => {
  const activeConversationId = conversationId || createConversationId();

  // Fetch history for contextual conversations
  let history = [];
  if (conversationId) {
    history = await getConversationHistory(activeConversationId);
  }

  // Save the user's new message
  await saveChatMessage({
    userId,
    conversationId: activeConversationId,
    role: "user",
    message,
  });

  // Get AI response
  const reply = await sendMessageToAI(message, history);

  // Save the AI's response
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
