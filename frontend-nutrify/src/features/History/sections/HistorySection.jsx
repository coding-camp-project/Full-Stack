import { useEffect, useMemo, useState } from "react";
import { Droplets, Flame } from "lucide-react";

import HistoryFilter from "../components/HistoryFilter";
import HistoryList from "../components/HistoryList";
import InsightCard from "../components/InsightCard";
import NutritionSummaryCard from "../components/NutritionSummaryCard";
import { getHistory } from "../services/historyService";
import { mapHistoryRecordToCardItem } from "../utils/historyMappers";
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

    return JSON.parse(historyStr).map(mapHistoryRecordToCardItem);
  } catch (err) {
    console.error("Gagal membaca riwayat", err);
    return [];
  }
}

function HistorySection() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(DEFAULT_TIME_FILTER);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    let isMounted = true;

    getHistory()
      .then((history) => {
        if (isMounted) {
          setHistoryItems(history.map(mapHistoryRecordToCardItem));
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil riwayat dari server", err);

        if (isMounted) {
          setHistoryItems(getStoredHistoryItems());
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
    <div className="w-full min-w-0 max-w-full px-4 py-5 sm:px-5 sm:py-7 lg:px-7 lg:max-w-[1360px] lg:mx-auto">
      <HistoryFilter
        currentDate={currentDate}
        selectedTimeFilter={selectedTimeFilter}
        onTimeFilterChange={setSelectedTimeFilter}
      />

      <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
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
      </div>

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[1fr_minmax(0,16rem)]">
        <HistoryList items={filteredHistoryItems} loading={loading} />
        <InsightCard />
      </div>
    </div>
  );
}

export default HistorySection;
