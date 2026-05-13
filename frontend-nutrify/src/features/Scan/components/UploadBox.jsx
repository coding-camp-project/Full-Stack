import { ImagePlus, Upload } from "lucide-react";

function UploadBox({ imagePreview, onImageChange }) {
  return (
    <label className="flex min-h-75 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#9BDCC8] bg-white px-6 py-8 text-center transition-all duration-200 hover:border-[#18A873] hover:bg-[#F6FFFB]">
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview makanan"
          className="mb-5 h-34 w-full max-w-80 rounded-xl object-cover"
        />
      ) : (
        <ImagePlus size={78} strokeWidth={1.8} className="mb-4 text-[#49AE84]" />
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
