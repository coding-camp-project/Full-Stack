import { useEffect, useState } from "react";

import ScanLoading from "../components/ScanLoading";
import ScanResultSection from "../sections/ScanResultSection";
import ScanUploadSection from "../sections/ScanUploadSection";
import { getUserData } from "@/utils/userSession";

function ScanPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [scanResult, setScanResult] = useState(null);

  const canAnalyze = Boolean(uploadedImage || manualInput.trim());

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setShowResult(false);
    setScanResult(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage && !manualInput.trim()) {
      alert("Harap unggah gambar atau tulis komposisi makanan terlebih dahulu.");
      return;
    }

    setLoading(true);
    setShowResult(false);
    setScanResult(null);

    try {
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      let response;
      if (uploadedImage) {
        const formData = new FormData();
        formData.append("image", uploadedImage);
        if (manualInput.trim()) {
          formData.append("manualInput", manualInput.trim());
        }
        
        response = await fetch(`${API_URL}/api/scan`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/api/scan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ manualInput }),
        });
      }

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Gagal memproses analisis.");
      }

      setScanResult(data);
      setShowResult(true);

      // Simpan ke riwayat lokal
      try {
        const userData = getUserData();
        const userId = userData?.id || "guest";
        const localHistoryKey = `scanHistory_${userId}`;

        const historyStr = localStorage.getItem(localHistoryKey);
        const history = historyStr ? JSON.parse(historyStr) : [];
        const newHistoryItem = {
          id: data.historyId || Date.now(),
          time: new Date().toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
          name: data.best_prediction?.food_name?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          components: data.details?.length || 1,
          calories: Math.round(data.nutrition?.calories || 0),
          protein: Math.round(data.nutrition?.protein || 0),
          carbs: Math.round(data.nutrition?.carbohydrates || 0),
          fat: Math.round(data.nutrition?.fat || 0),
          date: new Date().toISOString(),
        };
        history.unshift(newHistoryItem);
        localStorage.setItem(localHistoryKey, JSON.stringify(history));
      } catch (err) {
        console.error("Gagal menyimpan ke riwayat lokal", err);
      }
    } catch (error) {
      console.error("Scan error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ScanLoading />;
  }

  if (showResult && scanResult) {
    return <ScanResultSection imagePreview={imagePreview} result={scanResult} />;
  }

  return (
    <ScanUploadSection
      imagePreview={imagePreview}
      manualInput={manualInput}
      onImageChange={handleImageChange}
      onManualInputChange={(event) => setManualInput(event.target.value)}
      onAnalyze={handleAnalyze}
      canAnalyze={canAnalyze}
    />
  );
}

export default ScanPage;
