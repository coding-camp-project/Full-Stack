import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/db.js";


if (!process.env.GEMINI_API_KEYS && !process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEYS or GEMINI_API_KEY is missing");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing");
}

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});