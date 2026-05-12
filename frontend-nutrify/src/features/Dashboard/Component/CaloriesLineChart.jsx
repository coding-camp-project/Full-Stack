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

function CaloriesLineChart() {
  const data = {
    labels: [
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
    ],

    datasets: [
      {
        label: "Asupan Kalori",

        data: [40, 105, 75, 120, 80, 135],

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
        label: "Target (2.000 kkal)",

        data: [100, 100, 100, 100, 100, 100],

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
        max: 150,

        ticks: {
          stepSize: 50,
          color: "#666",
        },

        grid: {
          color: "#E5E7EB",
        },
      },
    },
  };

  return (
    <div className="h-62.5 w-full">
      <Line
        data={data}
        options={options}
      />
    </div>
  );
}

export default CaloriesLineChart;