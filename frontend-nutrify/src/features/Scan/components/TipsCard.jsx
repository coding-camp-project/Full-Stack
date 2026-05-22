import { CheckCircle2 } from "lucide-react";

const tips = [
  "Tuliskan setiap makanan yang dikonsumsi",
  "Sertakan takaran atau porsi jika memungkinkan",
  "Contoh: nasi 1 porsi, telur 1 butir, tempe 2 potong",
];

function TipsCard({ onAnalyze, disabled }) {
  return (
    <div className="min-w-0">
      <h4 className="text-[13px] font-bold text-[#1E1E1E]">
        Tips penulisan:
      </h4>

      <div className="mt-3 space-y-2">
        {tips.map((tip) => (
          <div
            key={tip}
            className="flex min-w-0 items-start gap-2 rounded-xl bg-[#EFFFF8] px-3 py-2 text-[11px] font-medium text-[#35695A] sm:text-[12px]"
          >
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#49AE84] sm:size-[15px]" />
            <span className="break-words">{tip}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={disabled}
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#49AE84] px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#118D62] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-5 sm:w-auto sm:px-8 sm:py-0 sm:h-10"
      >
        Analisis Sekarang
      </button>
    </div>
  );
}

export default TipsCard;
