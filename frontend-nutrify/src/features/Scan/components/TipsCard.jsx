import { CheckCircle2 } from "lucide-react";

const tips = [
  "Tuliskan setiap makanan yang dikonsumsi",
  "Sertakan takaran atau porsi jika memungkinkan",
  "Contoh: nasi 1 porsi, telur 1 butir, tempe 2 potong",
];

function TipsCard({ onAnalyze, disabled }) {
  return (
    <div>
      <h4 className="text-[13px] font-bold text-[#1E1E1E]">
        Tips penulisan:
      </h4>

      <div className="mt-3 space-y-2">
        {tips.map((tip) => (
          <div
            key={tip}
            className="flex items-center gap-2 rounded-full bg-[#EFFFF8] px-3 py-2 text-[12px] font-medium text-[#35695A]"
          >
            <CheckCircle2 size={15} className="shrink-0 text-[#49AE84]" />
            <span>{tip}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={disabled}
        className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#49AE84] px-8 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#118D62] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Analisis Sekarang
      </button>
    </div>
  );
}

export default TipsCard;
