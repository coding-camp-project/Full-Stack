import { useEffect, useMemo, useState } from "react";
import { Droplets, Flame } from "lucide-react";
 
import HistoryFilter from "../components/HistoryFilter";
import HistoryList from "../components/HistoryList";
import InsightCard from "../components/InsightCard";
import NutritionSummaryCard from "../components/NutritionSummaryCard";
import { getHistory, deleteHistoryItem } from "../services/historyService";
import { mapHistoryRecordToCardItem } from "../utils/historyMappers";
import { getUserData } from "@/utils/userSession";
import { calculateDailyNeeds } from "../../Dashboard/utils/targetCalculator";
 
const ONE_MINUTE = 60 * 1000;
 
function getStoredHistoryItems() {
  if (typeof window === "undefined") {
    return [];
  }
 
  try {
    const userData = getUserData();
    const userId = userData?.id || "guest";
    const localHistoryKey = `scanHistory_${userId}`;
    const historyStr = localStorage.getItem(localHistoryKey) || localStorage.getItem("scanHistory");
 
    if (!historyStr) {
      return [];
    }
 
    const allItems = JSON.parse(historyStr);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayTime = startOfToday.getTime();
    const filteredItems = allItems.filter(item => {
      const itemTime = new Date(item.date || item.createdAt).getTime();
      return itemTime >= startOfTodayTime;
    });
 
    // Clean up local storage
    localStorage.setItem(localHistoryKey, JSON.stringify(filteredItems));
 
    return filteredItems.map(mapHistoryRecordToCardItem);
  } catch (err) {
    console.error("Gagal membaca riwayat", err);
    return [];
  }
}
 
function HistorySection() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState({ startHour: 0, endHour: 23 });
  const [currentDate, setCurrentDate] = useState(() => new Date());
 
  const handleDeleteHistoryItem = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus riwayat makan ini?")) {
      return;
    }
    try {
      await deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
      
      // Update local storage fallback
      const userData = getUserData();
      const userId = userData?.id || "guest";
      const localHistoryKey = `scanHistory_${userId}`;
      const historyStr = localStorage.getItem(localHistoryKey);
      if (historyStr) {
        const history = JSON.parse(historyStr);
        const updated = history.filter((item) => (item.id || item._id) !== id);
        localStorage.setItem(localHistoryKey, JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Gagal menghapus riwayat:", err);
      alert(err.message || "Gagal menghapus riwayat.");
    }
  };
 
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
 
  const filteredHistoryItems = useMemo(() => {
    return historyItems.filter((item) => {
      const itemDate = new Date(item.date || item.createdAt);
      const hour = itemDate.getHours();
      return hour >= timeRange.startHour && hour <= timeRange.endHour;
    });
  }, [historyItems, timeRange]);
 
  const totalCalories = Math.round(
    filteredHistoryItems.reduce((sum, item) => sum + item.calories, 0)
  );
  const totalProtein = Math.round(
    filteredHistoryItems.reduce((sum, item) => sum + item.protein, 0)
  );
 
  // Dynamic target from personalized calculator
  const userData = getUserData();
  const targets = calculateDailyNeeds(userData);
  const targetCalories = targets.targetCalories || 2000;
  const targetProtein = targets.targetProtein || 80;
 
  const calProgress = Math.min(Math.round((totalCalories / targetCalories) * 100), 100);
  const proProgress = Math.min(Math.round((totalProtein / targetProtein) * 100), 100);
 
  const getCardTitle = (baseTitle) => {
    if (timeRange.startHour === 0 && timeRange.endHour === 23) {
      return `${baseTitle} (Hari Ini)`;
    }
    const startStr = String(timeRange.startHour).padStart(2, "0") + ":00";
    const endStr = String(timeRange.endHour).padStart(2, "0") + ":59";
    return `${baseTitle} (${startStr} - ${endStr})`;
  };
 
  return (
    <div className="w-full min-w-0 max-w-full px-4 py-5 sm:px-5 sm:py-7 lg:px-7 lg:max-w-[1360px] lg:mx-auto">
      <HistoryFilter
        currentDate={currentDate}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
 
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
        <NutritionSummaryCard
          icon={<Flame size={28} />}
          title={getCardTitle("Total Kalori")}
          value={totalCalories.toString()}
          unit="kkal"
          targetText={`${calProgress}% dari target ${targetCalories} kkal`}
          progress={calProgress}
          tone="green"
        />
 
        <NutritionSummaryCard
          icon={<Droplets size={28} />}
          title={getCardTitle("Total Protein")}
          value={totalProtein.toString()}
          unit="g"
          targetText={`${proProgress}% dari target ${targetProtein} g`}
          progress={proProgress}
          tone="blue"
        />
      </div>
 
      <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[1fr_minmax(0,16rem)]">
        <HistoryList items={filteredHistoryItems} loading={loading} onDelete={handleDeleteHistoryItem} />
        <InsightCard />
      </div>
    </div>
  );
}

export default HistorySection;
