import { useEffect, useState } from "react";

import ScanLoading from "../components/ScanLoading";
import ScanResultSection from "../sections/ScanResultSection";
import ScanUploadSection from "../sections/ScanUploadSection";

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
    if (!uploadedImage) {
      alert("Harap unggah gambar terlebih dahulu.");
      return;
    }

    setLoading(true);
    setShowResult(false);
    setScanResult(null);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);

      // Optional: send disease from user profile if available
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      // You can append disease here if needed

      const response = await fetch("http://localhost:5000/api/scan", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Gagal memproses gambar.");
      }

      setScanResult(data);
      setShowResult(true);

      // Simpan ke riwayat lokal
      try {
        const historyStr = localStorage.getItem("scanHistory");
        const history = historyStr ? JSON.parse(historyStr) : [];
        const newHistoryItem = {
          id: Date.now(),
          time: new Date().toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
          name: data.best_prediction?.food_name?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          components: 1, // Default, can be dynamic later
          calories: Math.round(data.nutrition?.calories || 0),
          protein: parseFloat((data.nutrition?.protein || 0).toFixed(1)),
          carbs: parseFloat((data.nutrition?.carbohydrates || 0).toFixed(1)),
          fat: parseFloat((data.nutrition?.fat || 0).toFixed(1)),
          date: new Date().toISOString(),
        };
        history.unshift(newHistoryItem);
        localStorage.setItem("scanHistory", JSON.stringify(history));
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
