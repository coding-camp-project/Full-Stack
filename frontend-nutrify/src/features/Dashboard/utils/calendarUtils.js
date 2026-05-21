export const DATE_LOCALE = "id-ID";

const AGENDA_COLORS = {
  breakfast: "#45C16E",
  workout: "#9B6BFF",
  water: "#49AE84",
  check: "#F5B74F",
};

function startOfDay(date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function isSameMonth(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth()
  );
}

export function formatMonthYear(date) {
  return date.toLocaleDateString(DATE_LOCALE, {
    month: "long",
    year: "numeric",
  });
}

export function formatAgendaDate(date) {
  return date.toLocaleDateString(DATE_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateCalendarWeeks(monthDate) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const mondayOffset = (monthStart.getDay() + 6) % 7;
  const calendarStart = addDays(monthStart, -mondayOffset);
  const weeks = [];
  let currentDate = calendarStart;

  while (currentDate <= monthEnd || weeks.length < 5) {
    const week = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      week.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth: isSameMonth(currentDate, monthDate),
      });
      currentDate = addDays(currentDate, 1);
    }

    weeks.push(week);
  }

  return weeks;
}

export function getMockAgendaByDate(date) {
  const day = startOfDay(date).getDate();
  const isWeekend = [0, 6].includes(date.getDay());

  return [
    {
      title: "Sarapan",
      time: isWeekend ? "08.00 - 08.30" : "07.00 - 07.30",
      color: AGENDA_COLORS.breakfast,
      iconType: "calendar",
    },
    {
      title: isWeekend ? "Jalan santai" : "Gym",
      time: isWeekend ? "09.00 - 09.45" : "17.30 - 18.30",
      color: AGENDA_COLORS.workout,
      iconType: "workout",
    },
    {
      title: "Minum air",
      time: `${10 + (day % 3)}.00 - ${10 + (day % 3)}.10`,
      color: AGENDA_COLORS.water,
      iconType: "water",
    },
    {
      title: "Meal check",
      time: "20.00 - 20.15",
      color: AGENDA_COLORS.check,
      iconType: "check",
    },
  ];
}
