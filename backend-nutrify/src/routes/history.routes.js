import express from "express";

import {
  getHistory,
  getHistoryDetail,
  deleteHistory,
} from "../controllers/history.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getHistory);
router.get("/:id", protect, getHistoryDetail);
router.delete("/:id", protect, deleteHistory);

export default router;
