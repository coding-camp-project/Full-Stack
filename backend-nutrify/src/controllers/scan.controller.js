import axios from "axios";
import FormData from "form-data";

export const scanFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided." });
    }

    const { disease } = req.body;

    // Build form data
    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    if (disease) {
      formData.append("disease", disease);
    }

    // Call FastAPI
    const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Scan API Error:", error.response?.data || error.message);
    
    let errorMessage = "Failed to process image.";
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        errorMessage = error.response.data.detail.map(e => e.msg).join(", ");
      } else if (typeof error.response.data.detail === "string") {
        errorMessage = error.response.data.detail;
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "AI Service is not reachable (ECONNREFUSED).";
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
