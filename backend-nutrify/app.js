import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import userRoutes from "./src/routes/user.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import scanRoutes from "./src/routes/scan.routes.js";
import historyRoutes from "./src/routes/history.routes.js";

const app = express();


app.use(helmet());


const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://nutrify.biz.id",
      "https://www.nutrify.biz.id"
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.",
  },
});
app.use("/api", apiLimiter);


app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

export default app;
