import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import scanRoutes from "./src/routes/scan.routes.js";
import historyRoutes from "./src/routes/history.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

export default app;
