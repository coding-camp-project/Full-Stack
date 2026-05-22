import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  console.log("Testing gemini-1.5-flash-001...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
    const res = await model.generateContent("Hello");
    console.log("gemini-1.5-flash-001 SUCCESS:", res.response.text().trim());
  } catch (err) {
    console.error("gemini-1.5-flash-001 FAILED:", err.message);
  }

  console.log("\nTesting gemini-1.5-flash-002...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
    const res = await model.generateContent("Hello");
    console.log("gemini-1.5-flash-002 SUCCESS:", res.response.text().trim());
  } catch (err) {
    console.error("gemini-1.5-flash-002 FAILED:", err.message);
  }
}
run();
