
import NutritionPieChart from "../Components/NutritionPieChart";
import CaloriesLineChart from "../Components/CaloriesLineChart";
import FoodHistorySection from "./FoodHistorySection";
import InsightCard from "../Components/InsightCard";
import CalendarWidget from "../Components/CalendarWidget";
import WaterIntakeWidget from "../Components/WaterIntakeWidget";

function DashboardContentSection({ 
  historyItems = [], 
  totalCalories = 0, 
  totalCarbs = 0, 
  totalFat = 0, 
  totalProtein = 0,
  aggregatedNutrition = {},
  targets = {}
}) {
  return (
    <section className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12">
      <div className="min-w-0 space-y-4 sm:space-y-5 lg:col-span-8 xl:col-span-9">
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-2">
          
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-[#FBFDFD]/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] sm:p-5">
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              Ringkasan Nutrisi
            </h2>
 
            <div className="mt-4 min-w-0 sm:mt-5">
                <NutritionPieChart 
                  calories={totalCalories}
                  carbs={totalCarbs}
                  fat={totalFat}
                  protein={totalProtein}
                  nutrition={aggregatedNutrition}
                />
            </div>
          </div>
 
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-[#FBFDFD]/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] sm:p-5">
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              Tren Asupan Kalori
            </h2>
 
            <div className="mt-4 min-w-0 sm:mt-5">
                <CaloriesLineChart historyItems={historyItems} targetCalories={targets.targetCalories || 2000} />
            </div>  
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-[#FBFDFD]/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] sm:p-5">
          <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
            Riwayat Makanan
          </h2>

          <div className="mt-4 min-w-0 sm:mt-5">
            <FoodHistorySection items={historyItems} />
            </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-[#FBFDFD]/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] sm:p-5">
            <InsightCard 
              totalCalories={totalCalories}
              totalCarbs={totalCarbs}
              totalFat={totalFat}
              totalProtein={totalProtein}
            />
        </div>
      </div>

      <div className="min-w-0 space-y-4 sm:space-y-5 lg:col-span-4 xl:col-span-3">
        
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-[#FBFDFD]/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] sm:p-5">
          <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
            Kalender
          </h2>
          <div className="mt-4 min-w-0 sm:mt-5">
            <CalendarWidget />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-[#FBFDFD]/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)]">
          <WaterIntakeWidget />
        </div>
        
      </div>
    </section>
  );
} 

export default DashboardContentSection;