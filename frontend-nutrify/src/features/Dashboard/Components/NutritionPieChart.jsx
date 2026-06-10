import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function NutritionPieChart({ calories = 0, carbs = 0, protein = 0, fat = 0, nutrition = {} }) {
  const excludeKeys = ["calories", "carbs", "fat", "protein"];
  const lainnya = Object.keys(nutrition).reduce((sum, key) => {
    if (excludeKeys.includes(key)) return sum;
    const value = parseFloat(nutrition[key]) || 0;
    if (key.toLowerCase() === "sodium" || key.toLowerCase() === "natrium") {
      return sum + (value / 1000);
    }
    return sum + value;
  }, 0);

  const total = carbs + protein + fat + lainnya;
  const carbsPct = total > 0 ? Math.round((carbs / total) * 100) : 0;
  const proteinPct = total > 0 ? Math.round((protein / total) * 100) : 0;
  const fatPct = total > 0 ? Math.round((fat / total) * 100) : 0;
  const otherPct = total > 0 ? Math.max(0, 100 - carbsPct - proteinPct - fatPct) : 0;

  const data = {
    labels: [
      "Karbohidrat",
      "Protein",
      "Lemak",
      "Lainnya",
    ],
    datasets: [
      {
        data: total > 0 ? [carbsPct, proteinPct, fatPct, otherPct] : [1],
        backgroundColor: total > 0 ? [
          "#3AC46B",
          "#F5B74F",
          "#8B5CF6",
          "#A3A3A3",
        ] : ["#E5E7EB"],
        borderWidth: 0,
        hoverOffset: total > 0 ? 5 : 0,
      },
    ],
  };

  const options = {
    cutout: "74%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { family: "Poppins", size: 12, weight: "700" },
        bodyFont: { family: "Poppins", size: 12 },
        padding: 10,
        cornerRadius: 8,
        boxPadding: 6,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
      easing: "easeOutBack",
    },
  };

  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      
      {/* CHART */}
      <div className="relative mx-auto aspect-square h-44 w-44 shrink-0 sm:h-52 sm:w-52 lg:h-55 lg:w-55 group">
        <Doughnut
          data={data}
          options={options}
        />

        {/* CENTER TEXT */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-[#103020]/10 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-xs transition-all duration-300 group-hover:scale-105 sm:h-32 sm:w-32">
            <p className="text-xl font-extrabold text-[#1E1E1E] sm:text-[28px] leading-none">
              {Math.round(calories).toString()}
            </p>

            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              kkal total
            </span>
          </div>
        </div>
      </div>

      {/* LEGEND */}
      <div className="w-full min-w-0 grid grid-cols-2 gap-3 sm:w-auto sm:flex sm:flex-col sm:gap-4 sm:space-y-0">
        
        {/* ITEM */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100/80 bg-slate-50/30 p-2.5 shadow-2xs transition-all duration-300 hover:scale-[1.03] hover:border-[#103020]/15 hover:bg-white sm:p-3 sm:px-4 sm:min-w-44">
          <div className="h-3 w-3 shrink-0 rounded-full bg-[#3AC46B]" />

          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-800">
              Karbohidrat
            </p>

            <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
              {Math.round(carbs)} g ({carbsPct}%)
            </span>
          </div>
        </div>

        {/* ITEM */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100/80 bg-slate-50/30 p-2.5 shadow-2xs transition-all duration-300 hover:scale-[1.03] hover:border-[#103020]/15 hover:bg-white sm:p-3 sm:px-4 sm:min-w-44">
          <div className="h-3 w-3 shrink-0 rounded-full bg-[#F5B74F]" />

          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-800">
              Protein
            </p>

            <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
              {Math.round(protein)} g ({proteinPct}%)
            </span>
          </div>
        </div>

        {/* ITEM */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100/80 bg-slate-50/30 p-2.5 shadow-2xs transition-all duration-300 hover:scale-[1.03] hover:border-[#103020]/15 hover:bg-white sm:p-3 sm:px-4 sm:min-w-44">
          <div className="h-3 w-3 shrink-0 rounded-full bg-[#8B5CF6]" />

          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-800">
              Lemak
            </p>

            <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
              {Math.round(fat)} g ({fatPct}%)
            </span>
          </div>
        </div>

        {/* ITEM */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100/80 bg-slate-50/30 p-2.5 shadow-2xs transition-all duration-300 hover:scale-[1.03] hover:border-[#103020]/15 hover:bg-white sm:p-3 sm:px-4 sm:min-w-44">
          <div className="h-3 w-3 shrink-0 rounded-full bg-[#A3A3A3]" />

          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-800">
              Lainnya
            </p>

            <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
              {parseFloat(lainnya.toFixed(2))} g ({otherPct}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionPieChart;