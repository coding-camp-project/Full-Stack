import { ImagePlus, Upload } from "lucide-react";

function UploadBox({ imagePreview, onImageChange }) {
  return (
    <label className="flex min-h-56 w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#9BDCC8] bg-white px-4 py-6 text-center transition-all duration-200 hover:border-[#18A873] hover:bg-[#F6FFFB] sm:min-h-75 sm:px-6 sm:py-8">
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

      <span className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#49AE84] px-8 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#118D62]">
        <Upload size={15} />
        Pilih Foto
      </span>

      <p className="mt-5 text-[13px] text-[#777]">
        atau drag & drop foto di sini
      </p>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageChange}
      />
    </label>
  );
}

export default UploadBox;
