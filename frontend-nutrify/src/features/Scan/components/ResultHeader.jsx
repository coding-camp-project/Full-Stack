import { CheckCircle2 } from "lucide-react";

function ResultHeader() {
  return (
    <div className="rounded-xl border border-[#DCEFE6] bg-[#F4FFF9] px-5 py-4">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={22} className="shrink-0 text-[#49AE84]" />

        <div>
          <p className="text-[12px] font-medium text-[#777]">
            Makanan terdeteksi:
          </p>
          <h2 className="text-[18px] font-bold text-[#1E1E1E]">
            Nasi Goreng
          </h2>
          <p className="text-[11px] font-medium text-[#777]">
            Tingkat keyakinan: 92%
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultHeader;
