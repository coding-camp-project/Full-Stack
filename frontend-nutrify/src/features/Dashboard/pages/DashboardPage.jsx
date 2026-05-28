import { useEffect, useState } from "react";
import SummarySection from "../Components/SummarySection";
import DashboardContentSection from "../Section/DashboardContentSection";
import { getDashboardSummary } from "@/features/History/services/historyService";
import { mapHistoryRecordToCardItem } from "@/features/History/utils/historyMappers";
import { getUserData } from "@/utils/userSession";
import { calculateDailyNeeds } from "../utils/targetCalculator";

function DashboardPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState({
    targetCalories: 2000,
    targetCarbs: 300,
    targetFat: 70,
    targetProtein: 80,
    targetSugar: 50,
    targetSodium: 2000,
    targetFiber: 25,
  });
  const [aggregatedNutrition, setAggregatedNutrition] = useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    sugar: 0,
    sodium: 0,
    fiber: 0,
  });
  const [chartData, setChartData] = useState([]);

  const loadData = () => {
    const userData = getUserData();
    const userId = userData?.id || "guest";

    // Pre-calculate local targets immediately for snappy UI
    const localTargets = calculateDailyNeeds(userData);
    setTargets(localTargets);

    getDashboardSummary()
      .then((data) => {
        if (data) {
          setTargets(data.targets || localTargets);
          setAggregatedNutrition(data.aggregatedNutrition || {
            calories: 0,
            carbs: 0,
            fat: 0,
            protein: 0,
            sugar: 0,
            sodium: 0,
            fiber: 0,
          });
          setChartData(data.chartData || []);
          if (data.history) {
            setHistoryItems(data.history.map(mapHistoryRecordToCardItem));
          }
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil ringkasan dashboard dari server, menggunakan fallback lokal:", err);
        
        const localHistoryKey = `scanHistory_${userId}`;
        const historyStr = localStorage.getItem(localHistoryKey);
        let localHistory = [];
        if (historyStr) {
          try {
            const allItems = JSON.parse(historyStr);
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const startOfTodayTime = startOfToday.getTime();
            localHistory = allItems.filter(item => {
              const itemTime = new Date(item.date || item.createdAt).getTime();
              return itemTime >= startOfTodayTime;
            });
            localStorage.setItem(localHistoryKey, JSON.stringify(localHistory));
          } catch (parseErr) {
            console.error("Gagal membaca riwayat lokal", parseErr);
          }
        }

        const mappedItems = localHistory.map(mapHistoryRecordToCardItem);
        setHistoryItems(mappedItems);

        // Aggregate local history for today
        const totalCalories = Math.round(mappedItems.reduce((sum, item) => sum + (item.calories || 0), 0));
        const totalCarbs = Math.round(mappedItems.reduce((sum, item) => sum + (item.carbs || 0), 0));
        const totalFat = Math.round(mappedItems.reduce((sum, item) => sum + (item.fat || 0), 0));
        const totalProtein = Math.round(mappedItems.reduce((sum, item) => sum + (item.protein || 0), 0));
        const totalSugar = Math.round(mappedItems.reduce((sum, item) => sum + (item.sugar || item.raw?.sugar || 0), 0));
        const totalSodium = Math.round(mappedItems.reduce((sum, item) => sum + (item.sodium || item.raw?.sodium || 0), 0));
        const totalFiber = Math.round(mappedItems.reduce((sum, item) => sum + (item.fiber || item.raw?.fiber || 0), 0));

        setAggregatedNutrition({
          calories: totalCalories,
          carbs: totalCarbs,
          fat: totalFat,
          protein: totalProtein,
          sugar: totalSugar,
          sodium: totalSodium,
          fiber: totalFiber,
        });

        // Compute local 6-day trend
        const localTrend = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dayItems = mappedItems.filter(item => new Date(item.date || item.createdAt).toDateString() === d.toDateString());
          const sum = dayItems.reduce((acc, curr) => acc + (curr.calories || 0), 0);
          localTrend.push({
            date: d.toISOString(),
            label: d.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
            calories: Math.round(sum)
          });
        }
        setChartData(localTrend);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();

    // Refresh dashboard if user finishes scan or storage updates
    window.addEventListener("storage", loadData);
    window.addEventListener("userDataUpdated", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("userDataUpdated", loadData);
    };
  }, []);

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 p-4 sm:space-y-6 sm:p-5 md:p-6 lg:max-w-[1360px] lg:mx-auto">
      
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
          Dashboard Page
        </h1>
      </div>

      <SummarySection 
        calories={aggregatedNutrition.calories} 
        carbs={aggregatedNutrition.carbs} 
        fat={aggregatedNutrition.fat} 
        targets={targets}
      />

      <DashboardContentSection 
        historyItems={historyItems}
        totalCalories={aggregatedNutrition.calories}
        totalCarbs={aggregatedNutrition.carbs}
        totalFat={aggregatedNutrition.fat}
        totalProtein={aggregatedNutrition.protein}
        aggregatedNutrition={aggregatedNutrition}
        targets={targets}
      />
    </div>
  );
}

export default DashboardPage;
