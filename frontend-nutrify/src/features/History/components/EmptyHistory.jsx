import { History } from "lucide-react";

function EmptyHistory() {
  return (
    <div className="flex min-h-70 flex-col items-center justify-center rounded-xl border border-dashed border-[#B9EBD7] bg-[#F8FFFB] p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFFFF8] text-[#49AE84]">
        <History size={28} />
      </div>
      <h3 className="mt-4 text-[18px] font-bold text-[#1E1E1E]">
        Belum ada riwayat makanan
      </h3>
      <p className="mt-2 max-w-80 text-[13px] leading-relaxed text-[#666]">
        Riwayat hasil scan makanan akan muncul di sini setelah kamu mulai menggunakan Scan Nutrify.
      </p>
    </div>
  );
}

export default EmptyHistory;
