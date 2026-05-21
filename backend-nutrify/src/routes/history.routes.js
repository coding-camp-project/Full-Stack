import express from "express";

import {
  getHistory,
  getHistoryDetail,
} from "../controllers/history.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getHistory);
router.get("/:id", protect, getHistoryDetail);

export default router;
