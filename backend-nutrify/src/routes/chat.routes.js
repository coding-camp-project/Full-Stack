import express from "express";

import {
  getChatHistory,
  sendChatMessage,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", sendChatMessage);
router.get("/history/:conversationId", getChatHistory);

export default router;
