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

function NutritionPieChart() {
  const data = {
    labels: [
      "Karbohidrat",
      "Protein",
      "Lemak",
      "Lainnya",
    ],

    datasets: [
      {
        data: [50, 15, 30, 5],

        backgroundColor: [
          "#3AC46B",
          "#F5B74F",
          "#8B5CF6",
          "#A3A3A3",
        ],

        borderWidth: 0,
        hoverOffset: 5,
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
    <div className="flex items-center justify-between">
      
      {/* CHART */}
      <div className="relative h-55 w-55">
        <Doughnut
          data={data}
          options={options}
        />

        {/* CENTER TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[28px] font-bold text-[#1E1E1E]">
            1.652
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
              210 g (15%)
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
              210 g (15%)
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
              210 g (15%)
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
              210 g (15%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionPieChart;