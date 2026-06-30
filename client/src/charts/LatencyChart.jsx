import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

/**
 * Renders average response time per API as a line chart.
 * The backend currently returns one aggregated average per URL
 * (not a time series), so each API is plotted as a point along
 * the x-axis, connected to make latency differences easy to scan.
 */
function LatencyChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="chart-empty">No latency data yet.</p>;
  }

  const chartData = {
    labels: data.map((item) => shortenUrl(item.url)),
    datasets: [
      {
        label: "Avg response time (ms)",
        data: data.map((item) => item.avgResponseTime),
        borderColor: "#5B8DEF",
        backgroundColor: "#5B8DEF",
        pointBackgroundColor: "#5B8DEF",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: false,
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
          label: (item) => `${item.raw} ms`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#7E8B99", callback: (val) => `${val}ms` },
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
      <Line data={chartData} options={options} />
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

export default LatencyChart;