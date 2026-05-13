import { LoaderCircle, Sparkles } from "lucide-react";

function ScanLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-110 rounded-2xl border border-[#D9EFE7] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-[#E7FFF5] text-[#49AE84]">
          <LoaderCircle size={34} className="animate-spin" />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[#49AE84]">
          <Sparkles size={18} />
          <span className="text-[13px] font-semibold">
            AI sedang bekerja
          </span>
        </div>

        <h2 className="mt-3 text-[24px] font-bold text-[#1E1E1E]">
          Menganalisis makanan Anda
        </h2>

        <p className="mx-auto mt-2 max-w-80 text-[13px] leading-relaxed text-[#666]">
          Nutrify sedang membaca foto dan menghitung estimasi nutrisi makanan.
        </p>
      </div>
    </div>
  );
}

export default ScanLoading;
