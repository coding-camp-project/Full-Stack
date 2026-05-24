import { useState, useRef } from "react";
import { ImagePlus, Upload, Camera } from "lucide-react";

function UploadBox({ imagePreview, onImageChange }) {
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleCameraClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  const handleFileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const syntheticEvent = {
        target: {
          files: [file]
        }
      };
      onImageChange(syntheticEvent);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`flex min-h-56 w-full min-w-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-all duration-200 sm:min-h-75 sm:px-6 sm:py-8 ${
        isDragActive
          ? "border-[#18A873] bg-[#E8FFF5]"
          : "border-[#9BDCC8] bg-white hover:border-[#18A873] hover:bg-[#F6FFFB]"
      }`}
    >
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview makanan"
          className="mb-5 h-auto max-h-48 w-full max-w-full rounded-xl object-contain sm:max-h-56 sm:max-w-80"
        />
      ) : (
        <ImagePlus size={56} strokeWidth={1.8} className="mb-4 text-[#49AE84] sm:h-[78px] sm:w-[78px]" />
      )}

      <h3 className="text-[18px] font-bold text-[#1E1E1E]">
        Upload foto makanan anda
      </h3>

      <p className="mt-1 text-[13px] font-medium text-[#555]">
        Format JPG, PNG, Maksimal 5MB
      </p>

      {/* Buttons Container */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full justify-center px-4 sm:px-0">
        <button
          type="button"
          onClick={handleCameraClick}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#49AE84] px-6 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#118D62] cursor-pointer"
        >
          <Camera size={15} />
          Ambil dari Kamera
        </button>

        <button
          type="button"
          onClick={handleFileClick}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#49AE84] bg-white px-6 text-[13px] font-semibold text-[#49AE84] transition-all duration-200 hover:bg-[#F4FFF9] cursor-pointer"
        >
          <Upload size={15} />
          Pilih dari Galeri
        </button>
      </div>

      <p className="mt-5 text-[13px] text-[#777] hidden sm:block">
        atau drag & drop foto di sini
      </p>

      {/* Hidden inputs */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        className="hidden"
        onChange={onImageChange}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={onImageChange}
      />
    </div>
  );
}

export default UploadBox;
