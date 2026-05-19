import express from "express";
import { handleChat } from "../controllers/chat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected chat route (requires valid JWT)
router.post("/", protect, handleChat);

export default router;
