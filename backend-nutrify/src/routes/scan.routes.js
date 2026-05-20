import express from "express";
import { scanFood } from "../controllers/scan.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/", upload.single("image"), scanFood);

export default router;
