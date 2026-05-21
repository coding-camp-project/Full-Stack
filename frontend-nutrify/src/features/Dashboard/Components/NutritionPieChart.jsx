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

function NutritionPieChart({ calories = 0, carbs = 0, protein = 0, fat = 0 }) {
  const total = carbs + protein + fat;
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
    cutout: "72%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6 sm:gap-0">
      
      {/* CHART */}
      <div className="relative h-55 w-55">
        <Doughnut
          data={data}
          options={options}
        />

        {/* CENTER TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[28px] font-bold text-[#1E1E1E]">
            {Math.round(calories).toString()}
          </p>

          <span className="text-[14px] text-[#777]">
            kkal total
          </span>
        </div>
      </div>

      {/* LEGEND */}
      <div className="space-y-5">
        
        {/* ITEM */}
        <div className="flex items-start gap-3">
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#3AC46B]" />

          <div>
            <p className="text-[15px] font-medium text-[#1E1E1E]">
              Karbohidrat
            </p>

            <span className="text-[13px] text-[#777]">
              {Math.round(carbs)} g ({carbsPct}%)
            </span>
          </div>
        </div>

        {/* ITEM */}
        <div className="flex items-start gap-3">
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#F5B74F]" />

          <div>
            <p className="text-[15px] font-medium text-[#1E1E1E]">
              Protein
            </p>

            <span className="text-[13px] text-[#777]">
              {Math.round(protein)} g ({proteinPct}%)
            </span>
          </div>
        </div>

        {/* ITEM */}
        <div className="flex items-start gap-3">
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />

          <div>
            <p className="text-[15px] font-medium text-[#1E1E1E]">
              Lemak
            </p>

            <span className="text-[13px] text-[#777]">
              {Math.round(fat)} g ({fatPct}%)
            </span>
          </div>
        </div>

        {/* ITEM */}
        <div className="flex items-start gap-3">
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#A3A3A3]" />

          <div>
            <p className="text-[15px] font-medium text-[#1E1E1E]">
              Lainnya
            </p>

            <span className="text-[13px] text-[#777]">
              0 g ({otherPct}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionPieChart;