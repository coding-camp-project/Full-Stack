import { CheckCircle2 } from "lucide-react";

function ResultHeader({ foodName = "Nasi Goreng", confidence = 0.92 }) {
  const formattedName = foodName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const formattedConfidence = (confidence * 100).toFixed(1);

  return (
    <div className="rounded-xl border border-[#DCEFE6] bg-[#F4FFF9] px-5 py-4">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={22} className="shrink-0 text-[#49AE84]" />

        <div>
          <p className="text-[12px] font-medium text-[#777]">
            Makanan terdeteksi:
          </p>
          <h2 className="text-[18px] font-bold text-[#1E1E1E]">
            {formattedName}
          </h2>
          <p className="text-[11px] font-medium text-[#777]">
            Tingkat keyakinan: {formattedConfidence}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultHeader;
