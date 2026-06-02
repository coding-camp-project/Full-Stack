import express from "express";
import {
  registerUser,
  loginUser,
  googleLoginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

import { rateLimit } from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // Limit each IP to 20 auth requests per 15 minutes
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak percobaan masuk/daftar. Silakan coba lagi setelah 15 menit.",
  },
});

// Public routes
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/google-login", authLimiter, googleLoginUser);

// Protected routes (require valid JWT)
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
