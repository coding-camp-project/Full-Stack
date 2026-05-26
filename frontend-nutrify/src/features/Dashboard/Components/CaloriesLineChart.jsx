import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function CaloriesLineChart({ historyItems = [], targetCalories = 2000 }) {
  const labels = [];
  const dataPoints = [];
  
  // Hitung asupan 6 hari terakhir
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }));
    
    // Support either direct item.date or item.createdAt
    const dayItems = historyItems.filter(item => {
      const itemDateStr = new Date(item.date || item.createdAt).toDateString();
      return itemDateStr === d.toDateString();
    });
    const sum = dayItems.reduce((acc, curr) => acc + curr.calories, 0);
    dataPoints.push(sum);
  }

  // Set target based on max daily data to keep the graph readable, minimum targetCalories
  const maxCalories = Math.max(...dataPoints, targetCalories);
  const targetData = labels.map(() => targetCalories);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Asupan Kalori",
        data: dataPoints,
        borderColor: "#0EA5E9",
        backgroundColor: "#0EA5E9",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#0EA5E9",
        fill: false,
      },
      {
        label: `Target (${targetCalories.toLocaleString("id-ID")} kkal)`,
        data: targetData,
        borderColor: "#16A34A",
        borderDash: [6, 6],
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
          pointStyle: "line",
          padding: 20,
          color: "#444",
          font: {
            size: 13,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        min: 0,
        max: Math.ceil(maxCalories / 500) * 500, // round up to nearest 500
        ticks: {
          stepSize: 500,
          color: "#666",
        },
        grid: {
          color: "#E5E7EB",
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