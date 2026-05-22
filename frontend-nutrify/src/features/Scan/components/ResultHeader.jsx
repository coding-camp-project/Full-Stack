import { CheckCircle2 } from "lucide-react";

function ResultHeader({ foodName = "Nasi Goreng", confidence = 0.92 }) {
  const formattedName = foodName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const formattedConfidence = (confidence * 100).toFixed(1);

  return (
    <div className="min-w-0 rounded-xl border border-[#DCEFE6] bg-[#F4FFF9] px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex min-w-0 items-start gap-2.5 sm:items-center sm:gap-3">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#49AE84] sm:mt-0 sm:size-[22px]" />

        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#777] sm:text-[12px]">
            Makanan terdeteksi:
          </p>
          <h2 className="break-words text-[15px] font-bold text-[#1E1E1E] sm:text-[18px]">
            {formattedName}
          </h2>
          <p className="text-[10px] font-medium text-[#777] sm:text-[11px]">
            Tingkat keyakinan: {formattedConfidence}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultHeader;
