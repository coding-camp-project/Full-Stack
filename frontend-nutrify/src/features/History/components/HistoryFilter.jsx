import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, ChevronDown } from "lucide-react";

import {
  formatCurrentWeekRange,
  getTimeFilterLabel,
  TIME_FILTERS,
} from "../utils/historyFilters";

function HistoryFilter({ currentDate, selectedTimeFilter, onTimeFilterChange }) {
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentWeekRange = formatCurrentWeekRange(currentDate);
  const selectedTimeFilterLabel = getTimeFilterLabel(selectedTimeFilter);

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

  const handleDateFilterClick = () => {
    // Prepared for future datepicker integration.
  };

  const handleTimeFilterSelect = (filterValue) => {
    onTimeFilterChange(filterValue);
    setIsTimeFilterOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleDateFilterClick}
        aria-haspopup="dialog"
        className="flex h-11.5 min-w-58 items-center justify-between rounded-lg border border-[#D8D8D8] bg-white px-4 text-[14px] font-semibold text-[#1E1E1E] shadow-sm transition-all duration-200 hover:border-[#49AE84]"
      >
        <span className="flex items-center gap-3">
          <CalendarDays size={18} className="text-[#1E1E1E]" />
          {currentWeekRange}
        </span>
        <ChevronDown size={18} />
      </button>

      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          aria-expanded={isTimeFilterOpen}
          aria-haspopup="listbox"
          onClick={() => setIsTimeFilterOpen((isOpen) => !isOpen)}
          className="flex h-11.5 min-w-42 items-center justify-between rounded-lg border border-[#D8D8D8] bg-white px-4 text-[14px] font-semibold text-[#1E1E1E] shadow-sm transition-all duration-200 hover:border-[#49AE84]"
        >
          {selectedTimeFilterLabel}
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              isTimeFilterOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          role="listbox"
          className={`absolute left-0 top-13 z-20 w-56 overflow-hidden rounded-lg border border-[#D8D8D8] bg-white py-2 shadow-lg transition-all duration-200 ${
            isTimeFilterOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          {TIME_FILTERS.map((filter) => {
            const isSelected = filter.value === selectedTimeFilter;

            return (
              <button
                key={filter.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleTimeFilterSelect(filter.value)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] font-semibold transition-colors duration-200 ${
                  isSelected
                    ? "bg-[#EFFFF8] text-[#168C55]"
                    : "text-[#1E1E1E] hover:bg-[#F8FFFB] hover:text-[#49AE84]"
                }`}
              >
                {filter.label}
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HistoryFilter;
