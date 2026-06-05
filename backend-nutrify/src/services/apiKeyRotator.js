import { GoogleGenerativeAI } from "@google/generative-ai";

const getKeysList = (type = "scan") => {
  let keysStr = "";
  if (type === "chat") {
    keysStr = process.env.CHATBOT_GEMINI_API_KEYS || process.env.CHATBOT_GEMINI_API_KEY || process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  } else {
    keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  }
  return keysStr.split(",").map(k => k.trim()).filter(Boolean);
};

/**
 * Executes a Gemini API callback, automatically rotating keys and retrying on quota/rate-limit failure.
 * @param {string} type - 'scan' or 'chat' to target the appropriate API key list.
 * @param {function} callback - Callback function that receives a GoogleGenerativeAI instance.
 */
export const executeWithRotatedKey = async (type, callback) => {
  const keys = getKeysList(type);
  if (keys.length === 0) {
    throw new Error("No Gemini API Keys configured in environment variables.");
  }

  let lastError = null;
  // Create a copy of keys to track tried keys
  const remainingKeys = [...keys];

  while (remainingKeys.length > 0) {
    // Pick a random key from remaining to distribute load
    const randomIndex = Math.floor(Math.random() * remainingKeys.length);
    const key = remainingKeys[randomIndex];
    
    // Remove the selected key so we don't retry it
    remainingKeys.splice(randomIndex, 1);

    try {
      const genAI = new GoogleGenerativeAI(key);
      return await callback(genAI);
    } catch (error) {
      console.warn(`[API Rotator] A Gemini key failed, trying another one... Error:`, error.message || error);
      lastError = error;

      const errorMsg = String(error.message || error).toLowerCase();
      const isQuotaOrServer = errorMsg.includes("429") || 
                              errorMsg.includes("quota") || 
                              errorMsg.includes("limit") || 
                              errorMsg.includes("exhausted") || 
                              errorMsg.includes("503") || 
                              errorMsg.includes("high demand") ||
                              errorMsg.includes("resource_exhausted");

      if (!isQuotaOrServer) {
        // If it's a structural error (like content blocking or invalid prompt), throw it immediately
        throw error;
      }
    }
  }

  throw lastError || new Error("All configured Gemini API keys failed due to quota/server limits.");
};
