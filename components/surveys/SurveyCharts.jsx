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

export default function SurveyCharts({ survey }) {

  // ⭐ Fix — Safely handle missing data
  const progress = survey.progress || [];
  const risk = survey.high_risk_breakdown || [];

  const labels = progress.map(p => p.date);

  const progressData = {
    labels,
    datasets: [
      {
        label: "Daily Completed",
        data: progress.map(p => p.completed),
        borderWidth: 2,
      },
    ],
  };

  const riskData = {
    labels: risk.map(r => `ANM ${r.anm_id}`),
    datasets: [
      {
        label: "High-risk Cases",
        data: risk.map(r => r.count),
        backgroundColor: "rgba(246, 59, 59, 0.6)",
      },
    ],
  };

  return (
    <div className="space-y-8">
      
      <div className="bg-white p-5 shadow rounded">
        <h3 className="text-lg font-semibold mb-4">Survey Progress Trend</h3>

        {progress.length === 0 ? (
          <p className="text-gray-500 text-sm">No progress data available.</p>
        ) : (
          <Line data={progressData} />
        )}
      </div>

      <div className="bg-white p-5 shadow rounded">
        <h3 className="text-lg font-semibold mb-4">High-Risk Distribution</h3>

        {risk.length === 0 ? (
          <p className="text-gray-500 text-sm">No high-risk breakdown found.</p>
        ) : (
          <Bar data={riskData} />
        )}
      </div>

    </div>
  );
}
