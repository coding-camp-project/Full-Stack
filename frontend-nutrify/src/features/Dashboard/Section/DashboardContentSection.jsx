
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
  totalProtein = 0 
}) {
  return (
    <section className="grid grid-cols-12 gap-5">
      
      {/* LEFT SIDE */}
      <div className="col-span-9 space-y-5">
        
        {/* TOP CONTENT */}
        <div className="grid grid-cols-2 gap-5">
          
          <div className="rounded-[18px] bg-white p-5 shadow-sm">
            <h2 className="text-[24px] font-bold">
              Ringkasan Nutrisi
            </h2>

            <div className="mt-5">
                <NutritionPieChart 
                  calories={totalCalories}
                  carbs={totalCarbs}
                  fat={totalFat}
                  protein={totalProtein}
                />
            </div>
          </div>

          <div className="rounded-[18px] bg-white p-5 shadow-sm">
            <h2 className="text-[24px] font-bold">
              Tren Asupan Kalori
            </h2>

            <div className="mt-5">
                <CaloriesLineChart historyItems={historyItems} />
            </div>  
          </div>
        </div>

        {/* FOOD HISTORY */}
        <div className="rounded-[18px] bg-white p-5 shadow-sm">
          <h2 className="text-[24px] font-bold">
            Riwayat Makanan
          </h2>

          <div className="mt-5">
            <FoodHistorySection items={historyItems} />
            </div>
        </div>

        {/* INSIGHT */}
        <div className="rounded-[18px] bg-white p-5 shadow-sm">
            <InsightCard />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-3 space-y-5">
        
        <div className="rounded-[18px] bg-white p-5 shadow-sm">
          <h2 className="text-[24px] font-bold">
            Kalender
          </h2>
          <div className="mt-5">
            <CalendarWidget />
          </div>
        </div>

        <div className="rounded-[18px] bg-white p-5 shadow-sm">
          <WaterIntakeWidget />
        </div>
        
      </div>
    </section>
  );
} 

export default DashboardContentSection;