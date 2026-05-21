import { useEffect, useMemo, useState } from "react";
import { Droplets, Flame } from "lucide-react";

import foodImage from "../../../assets/healthy-food-img.png";

import HistoryFilter from "../components/HistoryFilter";
import HistoryList from "../components/HistoryList";
import InsightCard from "../components/InsightCard";
import NutritionSummaryCard from "../components/NutritionSummaryCard";
import {
  DEFAULT_TIME_FILTER,
  filterHistoryByTimeRange,
} from "../utils/historyFilters";

const ONE_MINUTE = 60 * 1000;

function getStoredHistoryItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const historyStr = localStorage.getItem("scanHistory");

    if (!historyStr) {
      return [];
    }

    return JSON.parse(historyStr).map((item) => ({
      ...item,
      image: item.image || foodImage,
    }));
  } catch (err) {
    console.error("Gagal membaca riwayat", err);
    return [];
  }
}

function HistorySection() {
  const [historyItems] = useState(getStoredHistoryItems);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(DEFAULT_TIME_FILTER);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, ONE_MINUTE);

    return () => clearInterval(intervalId);
  }, []);

  const filteredHistoryItems = useMemo(
    () =>
      filterHistoryByTimeRange(
        historyItems,
        selectedTimeFilter,
        currentDate
      ),
    [historyItems, selectedTimeFilter, currentDate]
  );

  // Hitung total hari ini
  const today = currentDate.toDateString();
  const todayItems = historyItems.filter(item => new Date(item.date).toDateString() === today);
  
  const totalCalories = todayItems.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = todayItems.reduce((sum, item) => sum + item.protein, 0);

  // Default target
  const targetCalories = 2000;
  const targetProtein = 80;

  const calProgress = Math.min(Math.round((totalCalories / targetCalories) * 100), 100);
  const proProgress = Math.min(Math.round((totalProtein / targetProtein) * 100), 100);

  return (
    <div className="w-full px-5 py-7 lg:px-7">
      <HistoryFilter
        currentDate={currentDate}
        selectedTimeFilter={selectedTimeFilter}
        onTimeFilterChange={setSelectedTimeFilter}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_16rem]">
        <NutritionSummaryCard
          icon={<Flame size={28} />}
          title="Total Kalori Hari Ini"
          value={totalCalories.toString()}
          unit="kkal"
          targetText={`${calProgress}% dari target ${targetCalories} kkal`}
          progress={calProgress}
          tone="green"
        />

        <NutritionSummaryCard
          icon={<Droplets size={28} />}
          title="Total Protein Hari Ini"
          value={totalProtein.toString()}
          unit="g"
          targetText={`${proProgress}% dari target ${targetProtein} g`}
          progress={proProgress}
          tone="blue"
        />

        <div className="hidden lg:block" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_16rem]">
        <HistoryList items={filteredHistoryItems} />
        <InsightCard />
      </div>
    </div>
  );
}

export default HistorySection;
