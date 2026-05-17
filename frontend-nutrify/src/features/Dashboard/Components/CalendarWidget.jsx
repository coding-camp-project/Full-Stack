import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ClipboardList,
  Dumbbell,
} from "lucide-react";

import AgendaItem from "./AgendaItem";

function CalendarWidget() {
  const dates = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31],
  ];

  return (
    <div>
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        
        <button className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-[14px] font-medium text-[#444]">
          Hari Ini
        </button>

        <div className="flex items-center gap-2">
          
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#7BC9A7] text-[#49AE84]">
            <ChevronLeft size={16} />
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#7BC9A7] text-[#49AE84]">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* DAYS */}
      <div className="mt-6 grid grid-cols-7 text-center text-[12px] font-semibold text-[#999]">
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
        <span>SUN</span>
      </div>

      {/* DATES */}
      <div className="mt-5 space-y-3">
        {dates.map((week, index) => (
          <div
            key={index}
            className="grid grid-cols-7 text-center"
          >
            {week.map((date) => (
              <div
                key={date}
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[14px]
                  
                  ${
                    date === 16
                      ? "bg-[#44B678] font-semibold text-white"
                      : "text-[#777]"
                  }
                `}
              >
                {date}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* AGENDA HEADER */}
      <div className="mt-10 flex items-center justify-between">
        
        <h3 className="text-[24px] font-bold text-[#1E1E1E]">
          Agenda Hari Ini
        </h3>

        <span className="text-[13px] text-[#999]">
          16 Mei 2026
        </span>
      </div>

      {/* AGENDA LIST */}
      <div className="mt-7 space-y-6">
        
        <AgendaItem
          title="Hari Ini"
          time="08.30 - 09.00"
          color="#45C16E"
          icon={<CalendarDays size={22} />}
        />

        <AgendaItem
          title="Hari Ini"
          time="08.30 - 09.00"
          color="#F5B74F"
          icon={<ClipboardList size={22} />}
        />

        <AgendaItem
          title="Hari Ini"
          time="08.30 - 09.00"
          color="#9B6BFF"
          icon={<Dumbbell size={22} />}
        />
      </div>
    </div>
  );
}

export default CalendarWidget;