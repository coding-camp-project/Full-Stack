import app from "./app.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing");
}


connectDB();


export default app;
