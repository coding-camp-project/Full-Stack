import express from "express";
import { scanFood, suggestFood } from "../controllers/scan.controller.js";
import multer from "multer";
import { protect } from "../middlewares/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get("/suggest", protect, suggestFood);
router.post("/", protect, upload.single("image"), scanFood);

export default router;
