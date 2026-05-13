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
  };

  const handleAnalyze = () => {
    if (!canAnalyze) {
      return;
    }

    setLoading(true);
    setShowResult(false);

    window.setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 1400);
  };

  if (loading) {
    return <ScanLoading />;
  }

  if (showResult) {
    return <ScanResultSection imagePreview={imagePreview} />;
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
