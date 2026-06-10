import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function CaloriesLineChart({ historyItems = [], targetCalories = 2000 }) {
  const labels = [];
  const dataPoints = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }));
    
    const dayItems = historyItems.filter(item => {
      const itemDateStr = new Date(item.date || item.createdAt).toDateString();
      return itemDateStr === d.toDateString();
    });
    const sum = dayItems.reduce((acc, curr) => acc + curr.calories, 0);
    dataPoints.push(sum);
  }

  const maxCalories = Math.max(...dataPoints, targetCalories);
  const targetData = labels.map(() => targetCalories);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Asupan Kalori",
        data: dataPoints,
        borderColor: "#0EA5E9",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(14, 165, 233, 0.1)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(14, 165, 233, 0.25)");
          gradient.addColorStop(1, "rgba(14, 165, 233, 0.00)");
          return gradient;
        },
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#0EA5E9",
        pointBorderWidth: 2.5,
        fill: true,
      },
      {
        label: `Target (${targetCalories.toLocaleString("id-ID")} kkal)`,
        data: targetData,
        borderColor: "#10B981",
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          color: "#475569",
          font: {
            family: "Poppins",
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { family: "Poppins", size: 12, weight: "700" },
        bodyFont: { family: "Poppins", size: 12 },
        padding: 10,
        cornerRadius: 8,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748B",
          font: {
            family: "Poppins",
            size: 11,
          },
        },
      },
      y: {
        min: 0,
        max: Math.ceil(maxCalories / 500) * 500,
        ticks: {
          stepSize: 500,
          color: "#64748B",
          font: {
            family: "Poppins",
            size: 11,
          },
        },
        grid: {
          color: "rgba(226, 232, 240, 0.6)",
        },
      },
    },
  };

  return (
    <div className="h-48 w-full min-w-0 sm:h-56 lg:h-62.5">
      <Line
        data={data}
        options={options}
      />
    </div>
  );
}

export default CaloriesLineChart;