import axios from "axios";

export const handleChat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "Messages are required and must be an array"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: true,
        reply: "Halo! Saya Nutrify AI. Mohon konfigurasikan `GEMINI_API_KEY` di file `.env` server backend Anda untuk mulai mengobrol seputar kesehatan dan nutrisi dengan saya!"
      });
    }

    // Map history to Gemini format
    const contents = messages.map(msg => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Personalization context
    let personalizationContext = "";
    if (req.user) {
      personalizationContext = `
Nama pengguna: ${req.user.name}
Kondisi kesehatan: ${req.user.healthConditions?.join(", ") || "Tidak ada"}
Alergi makanan: ${req.user.allergies?.join(", ") || "Tidak ada"}
Pantangan makanan: ${req.user.foodRestrictions?.join(", ") || "Tidak ada"}
Tujuan kesehatan: ${req.user.primaryGoal || "Menjaga berat badan"}
Tinggi badan: ${req.user.height ? req.user.height + " cm" : "Belum diisi"}
Berat badan: ${req.user.weight ? req.user.weight + " kg" : "Belum diisi"}
Tingkat aktivitas: ${req.user.activityLevel || "Sedang"}
Preferensi makanan: ${req.user.foodPreferences?.join(", ") || "Tidak ada"}
`;
    }

    const systemInstruction = `
Anda adalah Nutrify AI, asisten kesehatan, diet, dan nutrisi pintar yang ramah dan suportif. 
Tugas utama Anda adalah menjawab pertanyaan seputar gizi, kesehatan, resep sehat, kalori, dan gaya hidup sehat dalam Bahasa Indonesia.

Gunakan data personalisasi pengguna berikut untuk memberikan saran yang relevan dan disesuaikan secara khusus jika diperlukan:
${personalizationContext}

Aturan penting:
1. Bersikaplah ramah dan gunakan nama pengguna jika memungkinkan.
2. Selalu berikan informasi berbasis fakta ilmiah secara ringkas dan mudah dipahami.
3. Jika ditanya di luar topik kesehatan, nutrisi, atau diet, arahkan pengguna kembali dengan ramah ke topik utama Anda (Nutrify AI).
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      }
    };

    const response = await axios.post(geminiUrl, payload);
    const replyText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak dapat memahami jawaban tersebut.";

    return res.status(200).json({
      success: true,
      reply: replyText
    });

  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghubungi layanan kecerdasan buatan."
    });
  }
};
