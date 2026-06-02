import express from "express";
import {
  getChatHistory,
  sendChatMessage,
} from "../controllers/chat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All chat routes require a valid JWT token
router.use(protect);

router.post("/", sendChatMessage);
router.get("/history/:conversationId", getChatHistory);

export default router;
