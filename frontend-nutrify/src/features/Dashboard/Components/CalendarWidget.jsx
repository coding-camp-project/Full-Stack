import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  Droplet,
} from "lucide-react";

import AgendaItem from "./AgendaItem";
import {
  addMonths,
  formatAgendaDate,
  formatMonthYear,
  generateCalendarWeeks,
  getMockAgendaByDate,
  isSameDay,
} from "../utils/calendarUtils";

const ONE_MINUTE = 60 * 1000;
const DAY_LABELS = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

const AGENDA_ICONS = {
  calendar: CalendarDays,
  check: ClipboardList,
  water: Droplet,
  workout: Dumbbell,
};

function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, ONE_MINUTE);

    return () => clearInterval(intervalId);
  }, []);

  const calendarWeeks = useMemo(
    () => generateCalendarWeeks(visibleMonth),
    [visibleMonth]
  );

  const agendaItems = useMemo(
    () => getMockAgendaByDate(selectedDate),
    [selectedDate]
  );
  const agendaTitle = isSameDay(selectedDate, currentDate)
    ? "Agenda Hari Ini"
    : "Agenda";

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setVisibleMonth(today);
    setSelectedDate(today);
  };

  const handleMonthChange = (direction) => {
    setVisibleMonth((month) => {
      const nextMonth = addMonths(month, direction);
      setSelectedDate(nextMonth);
      return nextMonth;
    });
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.date);

    if (!day.isCurrentMonth) {
      setVisibleMonth(day.date);
    }
  };

  return (
    <div>
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        <button
          type="button"
          onClick={handleTodayClick}
          className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-[14px] font-medium text-[#444] transition-all duration-200 hover:border-[#49AE84] hover:text-[#49AE84]"
        >
          Hari Ini
        </button>

        <h3 className="text-[16px] font-bold capitalize text-[#1E1E1E]">
          {formatMonthYear(visibleMonth)}
        </h3>

        <div className="flex items-center gap-2">
          
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            aria-label="Bulan sebelumnya"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#7BC9A7] text-[#49AE84] transition-all duration-200 hover:bg-[#EFFFF8]"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => handleMonthChange(1)}
            aria-label="Bulan berikutnya"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#7BC9A7] text-[#49AE84] transition-all duration-200 hover:bg-[#EFFFF8]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* DAYS */}
      <div className="mt-6 grid grid-cols-7 text-center text-[12px] font-semibold text-[#999]">
        {DAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      {/* DATES */}
      <div className="mt-5 space-y-3">
        {calendarWeeks.map((week) => (
          <div
            key={week[0].date.toISOString()}
            className="grid grid-cols-7 text-center"
          >
            {week.map((day) => {
              const isToday = isSameDay(day.date, currentDate);
              const isSelected = isSameDay(day.date, selectedDate);

              return (
                <button
                  key={day.date.toISOString()}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[14px] transition-all duration-200 hover:bg-[#EFFFF8] hover:text-[#49AE84] ${
                    isToday
                      ? "bg-[#44B678] font-semibold text-white hover:bg-[#44B678] hover:text-white"
                      : ""
                  } ${
                    !isToday && isSelected
                      ? "border border-[#7BC9A7] bg-[#EFFFF8] font-semibold text-[#168C55]"
                      : ""
                  } ${
                    !isToday && !isSelected && day.isCurrentMonth
                      ? "text-[#777]"
                      : ""
                  } ${
                    !isToday && !isSelected && !day.isCurrentMonth
                      ? "text-[#C7C7C7]"
                      : ""
                  }`}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* AGENDA HEADER */}
      <div className="mt-10 flex items-center justify-between">
        
        <h3 className="text-[24px] font-bold text-[#1E1E1E]">
          {agendaTitle}
        </h3>

        <span className="text-[13px] text-[#999]">
          {formatAgendaDate(selectedDate)}
        </span>
      </div>

      {/* AGENDA LIST */}
      <div className="mt-7 space-y-6">
        {agendaItems.map((item) => {
          const Icon = AGENDA_ICONS[item.iconType];

          return (
            <AgendaItem
              key={`${item.title}-${item.time}`}
              title={item.title}
              time={item.time}
              color={item.color}
              icon={<Icon size={22} />}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CalendarWidget;
