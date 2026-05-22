import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
 
function HistoryFilter({ currentDate, timeRange, onTimeRangeChange }) {
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const [startHour, setStartHour] = useState(timeRange.startHour);
  const [endHour, setEndHour] = useState(timeRange.endHour);
  
  const dropdownRef = useRef(null);
 
  const formattedToday = currentDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
 
  // Sync state with props
  useEffect(() => {
    setStartHour(timeRange.startHour);
    setEndHour(timeRange.endHour);
  }, [timeRange]);
 
  useEffect(() => {
    function handlePointerDown(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsTimeFilterOpen(false);
      }
    }
 
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsTimeFilterOpen(false);
      }
    }
 
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
 
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
 
  const handleStartHourChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setStartHour(val);
    if (val > endHour) {
      setEndHour(val);
    }
  };
 
  const handleEndHourChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setEndHour(val);
    if (val < startHour) {
      setStartHour(val);
    }
  };
 
  const handleApply = () => {
    onTimeRangeChange({ startHour, endHour });
    setIsTimeFilterOpen(false);
  };
 
  const handleReset = () => {
    setStartHour(0);
    setEndHour(23);
    onTimeRangeChange({ startHour: 0, endHour: 23 });
    setIsTimeFilterOpen(false);
  };
 
  const getRangeLabel = () => {
    if (timeRange.startHour === 0 && timeRange.endHour === 23) {
      return "Semua Jam (24 Jam)";
    }
    const startStr = String(timeRange.startHour).padStart(2, "0") + ":00";
    const endStr = String(timeRange.endHour).padStart(2, "0") + ":59";
    return `${startStr} - ${endStr}`;
  };
 
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        className="flex h-11.5 w-full min-w-0 items-center justify-between rounded-lg border border-[#D8D8D8] bg-white px-4 text-sm font-semibold text-[#1E1E1E] shadow-sm transition-all duration-200 hover:border-[#49AE84] sm:flex-1 sm:min-w-[12rem] sm:text-[14px]"
      >
        <span className="flex min-w-0 items-center gap-2 truncate sm:gap-3">
          <CalendarDays size={18} className="shrink-0 text-[#1E1E1E]" />
          <span className="truncate">{formattedToday}</span>
        </span>
      </button>
 
      <div ref={dropdownRef} className="relative w-full sm:w-auto sm:min-w-[12rem]">
        <button
          type="button"
          aria-expanded={isTimeFilterOpen}
          aria-haspopup="dialog"
          onClick={() => setIsTimeFilterOpen((isOpen) => !isOpen)}
          className="flex h-11.5 w-full items-center justify-between rounded-lg border border-[#D8D8D8] bg-white px-4 text-sm font-semibold text-[#1E1E1E] shadow-sm transition-all duration-200 hover:border-[#49AE84] sm:text-[14px]"
        >
          <span>{getRangeLabel()}</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              isTimeFilterOpen ? "rotate-180" : ""
            }`}
          />
        </button>
 
        <div
          role="dialog"
          className={`absolute right-0 top-13 z-20 w-72 overflow-hidden rounded-xl border border-[#D8D8D8] bg-white p-4 shadow-lg transition-all duration-200 ${
            isTimeFilterOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          <div className="space-y-3">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Pilih Rentang Jam
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                  Mulai
                </label>
                <select
                  value={startHour}
                  onChange={handleStartHourChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#49AE84] focus:ring-1 focus:ring-[#49AE84]"
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>
              
              <span className="text-gray-400 text-xs mt-5">—</span>
              
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                  Selesai
                </label>
                <select
                  value={endHour}
                  onChange={handleEndHourChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#49AE84] focus:ring-1 focus:ring-[#49AE84]"
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, "0")}:59
                    </option>
                  ))}
                </select>
              </div>
            </div>
 
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-semibold transition-colors duration-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="bg-[#49AE84] hover:bg-[#3e9d7d] text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 shadow-sm"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default HistoryFilter;
