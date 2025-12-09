import {
  Line,
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function PerformanceCharts({ history }) {
  const labels = history.map(h => h.month);

  const visitsData = {
    labels,
    datasets: [
      {
        label: "Visits This Month",
        data: history.map(h => h.visits),
        borderWidth: 2,
      },
    ],
  };

  const tasksData = {
    labels,
    datasets: [
      {
        label: "Tasks Completed",
        data: history.map(h => h.tasks),
        backgroundColor: "rgba(59,130,246,0.6)",
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-5 shadow rounded">
        <h3 className="text-lg font-semibold mb-4">Monthly Visits Trend</h3>
        <Line data={visitsData} />
      </div>

      <div className="bg-white p-5 shadow rounded">
        <h3 className="text-lg font-semibold mb-4">Tasks Completed Trend</h3>
        <Bar data={tasksData} />
      </div>
    </div>
  );
}
