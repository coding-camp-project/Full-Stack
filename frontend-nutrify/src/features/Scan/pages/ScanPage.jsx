import { useEffect, useState } from "react";

import ScanLoading from "../components/ScanLoading";
import ScanResultSection from "../sections/ScanResultSection";
import ScanUploadSection from "../sections/ScanUploadSection";
import PortionGuideModal from "../components/PortionGuideModal";
import { getUserData } from "@/utils/userSession";

function ScanPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [isPortionModalOpen, setIsPortionModalOpen] = useState(false);

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
    setErrorMsg("");
  };

  const handleAnalyze = async () => {
    if (!uploadedImage && !manualInput.trim()) {
      setErrorMsg("Harap unggah gambar atau tulis komposisi makanan terlebih dahulu.");
      return;
    }

    setLoading(true);
    setShowResult(false);
    setScanResult(null);
    setErrorMsg("");

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
          components: data.components || data.details?.length || 1,
          calories: Math.round(data.nutrition?.calories || 0),
          protein: Math.round(data.nutrition?.protein || 0),
          carbs: Math.round(data.nutrition?.carbohydrates || 0),
          fat: Math.round(data.nutrition?.fat || 0),
          sugar: Math.round(data.nutrition?.sugar || 0),
          sodium: Math.round(data.nutrition?.sodium || 0),
          fiber: Math.round(data.nutrition?.fiber || 0),
          serving_size_g: data.best_prediction?.serving_size_g,
          serving_unit: data.best_prediction?.serving_unit,
          date: new Date().toISOString(),
        };
        history.unshift(newHistoryItem);
        localStorage.setItem(localHistoryKey, JSON.stringify(history));
        
        // Dispatch storage event to immediately update dashboard totals
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Gagal menyimpan ke riwayat lokal", err);
      }
    } catch (error) {
      console.error("Scan error:", error);
      setErrorMsg(error.message);
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
    <div className="w-full">
      {errorMsg && (
        <div className="mx-auto mt-5 w-full max-w-[1360px] px-3 sm:px-4 lg:px-6">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm transition-all duration-200">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <span className="text-[12px] font-bold">!</span>
            </div>
            <div className="flex-1">
              <h5 className="text-[14px] font-bold text-red-900">Analisis Gagal</h5>
              <p className="mt-1 text-[12px] leading-relaxed text-red-700">
                {errorMsg}
              </p>
            </div>
            <button
              onClick={() => setErrorMsg("")}
              className="text-red-500 hover:text-red-700 font-semibold text-[14px] px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <ScanUploadSection
        imagePreview={imagePreview}
        manualInput={manualInput}
        onImageChange={handleImageChange}
        onManualInputChange={(event) => {
          setManualInput(event.target.value);
          setErrorMsg("");
        }}
        onAnalyze={handleAnalyze}
        canAnalyze={canAnalyze}
        onOpenPortionModal={() => setIsPortionModalOpen(true)}
      />
      <PortionGuideModal
        isOpen={isPortionModalOpen}
        onClose={() => setIsPortionModalOpen(false)}
      />
    </div>
  );
}

export default ScanPage;
