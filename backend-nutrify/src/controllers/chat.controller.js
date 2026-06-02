import mongoose from "mongoose";

import * as chatService from "../services/chat.service.js";

const isValidString = (value) => typeof value === "string" && value.trim().length > 0;

export const sendChatMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user._id; // Set securely from JWT token

    if (!isValidString(message)) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const result = await chatService.handleChatMessage({
      message: message.trim(),
      userId,
      conversationId,
    });

    return res.status(200).json({
      success: true,
      reply: result.reply,
      conversationId: result.conversationId,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to process chat message.",
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id; // Securely verify ownership

    if (!isValidString(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    const history = await chatService.getConversationHistory(conversationId, userId);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch chat history.",
    });
  }
};
