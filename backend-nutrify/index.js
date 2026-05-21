import app from "./app.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB when the serverless function starts
connectDB();

// Export the Express API
export default app;
