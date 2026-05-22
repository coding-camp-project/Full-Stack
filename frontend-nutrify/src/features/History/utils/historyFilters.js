export const TIME_FILTERS = [
  { label: "24 Jam Terakhir", value: "all-time" },
];

export const DEFAULT_TIME_FILTER = "all-time";

const DATE_LOCALE = "id-ID";
const WEEK_RANGE_DAYS = 6;

function startOfDay(date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function addMonths(date, months) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function isDateInRange(date, startDate, endDate) {
  return date >= startDate && date < endDate;
}

export function formatCurrentWeekRange(date) {
  const endDate = addDays(date, WEEK_RANGE_DAYS);

  const startText = date.toLocaleDateString(DATE_LOCALE, {
    day: "numeric",
    month: "long",
  });

  const endText = endDate.toLocaleDateString(DATE_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${startText} - ${endText}`;
}

export function getTimeFilterLabel(filterValue) {
  return (
    TIME_FILTERS.find((filter) => filter.value === filterValue)?.label ??
    TIME_FILTERS.at(-1).label
  );
}

export function filterHistoryByTimeRange(items, filterValue, referenceDate = new Date()) {
  if (filterValue === DEFAULT_TIME_FILTER) {
    return items;
  }

  const todayStart = startOfDay(referenceDate);
  const tomorrowStart = addDays(todayStart, 1);
  let startDate = null;
  let endDate = tomorrowStart;

  if (filterValue === "today") {
    startDate = todayStart;
  }

  if (filterValue === "yesterday") {
    startDate = addDays(todayStart, -1);
    endDate = todayStart;
  }

  if (filterValue === "last-7-days") {
    startDate = addDays(todayStart, -6);
  }

  if (filterValue === "last-week") {
    startDate = addDays(todayStart, -13);
    endDate = addDays(todayStart, -6);
  }

  if (filterValue === "last-month") {
    startDate = startOfDay(addMonths(referenceDate, -1));
  }

  if (!startDate) {
    return items;
  }

  return items.filter((item) => {
    const itemDate = new Date(item.date);

    if (Number.isNaN(itemDate.getTime())) {
      return false;
    }

    return isDateInRange(itemDate, startDate, endDate);
  });
}
