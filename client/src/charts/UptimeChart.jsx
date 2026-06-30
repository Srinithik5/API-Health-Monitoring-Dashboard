import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/**
 * Renders per-API uptime percentage as a horizontal-feel bar chart.
 * Bars are colored per-bar based on uptime severity:
 *   >= 99%  -> healthy (green)
 *   >= 90%  -> degraded (amber)
 *   < 90%   -> critical (red)
 */
function UptimeChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="chart-empty">No uptime data yet.</p>;
  }

  const getColor = (uptime) => {
    if (uptime >= 99) return "#2DD4A7";
    if (uptime >= 90) return "#F2B441";
    return "#F2495C";
  };

  const chartData = {
    labels: data.map((item) => shortenUrl(item.url)),
    datasets: [
      {
        label: "Uptime %",
        data: data.map((item) => item.uptime),
        backgroundColor: data.map((item) => getColor(item.uptime)),
        borderRadius: 4,
        maxBarThickness: 48,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => data[items[0].dataIndex].url,
          label: (item) => `Uptime: ${item.raw}%`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { color: "#7E8B99", callback: (val) => `${val}%` },
        grid: { color: "#1E2630" },
      },
      x: {
        ticks: { color: "#7E8B99" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="chart-canvas-wrap">
      <Bar data={chartData} options={options} />
    </div>
  );
}

function shortenUrl(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default UptimeChart;