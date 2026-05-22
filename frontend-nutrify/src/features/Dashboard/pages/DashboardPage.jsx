import { useEffect, useState } from "react";
import SummarySection from "../Components/SummarySection";
import DashboardContentSection from "../Section/DashboardContentSection";
import { getHistory } from "@/features/History/services/historyService";
import { mapHistoryRecordToCardItem } from "@/features/History/utils/historyMappers";
import { getUserData } from "@/utils/userSession";

function DashboardPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const userData = getUserData();
    const userId = userData?.id || "guest";

    getHistory()
      .then((history) => {
        if (isMounted) {
          setHistoryItems(history.map(mapHistoryRecordToCardItem));
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil riwayat dari server, menggunakan fallback lokal:", err);
        
        if (isMounted) {
          const localHistoryKey = `scanHistory_${userId}`;
          const historyStr = localStorage.getItem(localHistoryKey);
          if (historyStr) {
            try {
              setHistoryItems(JSON.parse(historyStr));
            } catch (parseErr) {
              console.error("Gagal membaca riwayat lokal", parseErr);
            }
          }
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

  const today = new Date().toDateString();
  const todayItems = historyItems.filter(item => new Date(item.date).toDateString() === today);
  
  const totalCalories = todayItems.reduce((sum, item) => sum + item.calories, 0);
  const totalCarbs = todayItems.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = todayItems.reduce((sum, item) => sum + item.fat, 0);
  const totalProtein = todayItems.reduce((sum, item) => sum + item.protein, 0);

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 p-4 sm:space-y-6 sm:p-5 md:p-6 lg:max-w-[1360px] lg:mx-auto">
      
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
          Dashboard Page
        </h1>
      </div>

      <SummarySection 
        calories={totalCalories} 
        carbs={totalCarbs} 
        fat={totalFat} 
      />

      <DashboardContentSection 
        historyItems={historyItems}
        totalCalories={totalCalories}
        totalCarbs={totalCarbs}
        totalFat={totalFat}
        totalProtein={totalProtein}
      />
    </div>
  );
}

export default DashboardPage;
