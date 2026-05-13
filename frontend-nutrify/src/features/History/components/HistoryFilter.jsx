import { CalendarDays, ChevronDown } from "lucide-react";

function HistoryFilter() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        className="flex h-11.5 min-w-58 items-center justify-between rounded-lg border border-[#D8D8D8] bg-white px-4 text-[14px] font-semibold text-[#1E1E1E] shadow-sm transition-all duration-200 hover:border-[#49AE84]"
      >
        <span className="flex items-center gap-3">
          <CalendarDays size={18} className="text-[#1E1E1E]" />
          7 Mei - 13 Mei 2024
        </span>
        <ChevronDown size={18} />
      </button>

      <button
        type="button"
        className="flex h-11.5 min-w-42 items-center justify-between rounded-lg border border-[#D8D8D8] bg-white px-4 text-[14px] font-semibold text-[#1E1E1E] shadow-sm transition-all duration-200 hover:border-[#49AE84]"
      >
        Semua Waktu
        <ChevronDown size={18} />
      </button>
    </div>
  );
}

export default HistoryFilter;
