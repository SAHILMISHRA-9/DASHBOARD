// import Link from "next/link";
// import SidebarPHC from "../../../components/layout/SidebarPHC.jsx";
// import Navbar from "../../../components/layout/Navbar";

// export default function WorkforceHome() {
//   return (
//     <div className="flex min-h-screen">
//       <SidebarPHC />
//       <div className="flex-1 ml-64">
//         <Navbar role="phc" />

//         <main className="p-6 space-y-6">
//           <h1 className="text-2xl font-bold">Workforce Management</h1>
//           <p className="text-gray-600 mb-4">Manage ANM & ASHA field workforce.</p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//             <Link href="/phc/workforce/anm" className="block p-6 bg-white shadow rounded hover:bg-gray-50">
//               <h2 className="text-xl font-semibold">ANM Management</h2>
//               <p className="text-gray-600 text-sm mt-1">Add, edit & supervise ANM workers.</p>
//             </Link>

//             <Link href="/phc/workforce/asha" className="block p-6 bg-white shadow rounded hover:bg-gray-50">
//               <h2 className="text-xl font-semibold">ASHA Management</h2>
//               <p className="text-gray-600 text-sm mt-1">Assign ANM/Area & track performance.</p>
//             </Link>

//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }




// pages/phc/workforce/index.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import PerformanceCharts from "../../../components/performance/PerformanceCharts";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function WorkforceDashboard() {
  const [ashas, setAshas] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedAsha, setSelectedAsha] = useState(null);

  const [stats, setStats] = useState({
    total_ashas: 0,
    active_ashas: 0,
    disabled_ashas: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("Missing auth token");
        setLoading(false);
        return;
      }

      // 1️⃣ Get ASHA summary (total / active / disabled) from backend
      const summaryRes = await axios.get(`${BASE_URL}/phcAdmin/ashas/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(summaryRes.data || {});

      // 2️⃣ Get ASHA list from PHC Admin list endpoint
      const resAsha = await axios.get(`${BASE_URL}/phcAdmin/ashas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = resAsha.data || [];
      setAshas(list);

      // 3️⃣ For each ASHA, fetch performance (still using your old API)
      const perf = [];
      for (const a of list) {
        // NOTE: adjust this URL if your performance endpoint path changes
        const res = await axios.get(
          `/api/phc/workforce/performance/${a.asha_id}`
        );
        perf.push({
          asha_id: a.asha_id,
          asha: a.name,
          ...res.data,
        });
      }
      setPerformanceData(perf);

      // Default selected ASHA = first ASHA in list
      if (perf.length > 0) setSelectedAsha(perf[0].asha_id);
    } catch (err) {
      console.error("Workforce dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  const avgScore =
    performanceData.length > 0
      ? performanceData.reduce((acc, p) => acc + p.performance_score, 0) /
        performanceData.length
      : 0;

  const selectedPerf = performanceData.find(
    (p) => p.asha_id === selectedAsha
  );

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16">
          <h1 className="text-2xl font-bold mb-6">
            Workforce Analytics Dashboard
          </h1>

          {/* METRIC CARDS – now using backend stats */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded shadow">
              <p className="text-gray-600">Total ASHAs</p>
              <h2 className="text-3xl font-bold">
                {stats.total_ashas ?? 0}
              </h2>
            </div>

            <div className="bg-white p-5 rounded shadow">
              <p className="text-gray-600">Active ASHAs</p>
              <h2 className="text-3xl font-bold text-green-600">
                {stats.active_ashas ?? 0}
              </h2>
            </div>

            <div className="bg-white p-5 rounded shadow">
              <p className="text-gray-600">Disabled ASHAs</p>
              <h2 className="text-3xl font-bold text-red-600">
                {stats.disabled_ashas ?? 0}
              </h2>
            </div>
          </div>

          {/* AVERAGE SCORE */}
          <div className="bg-white p-5 rounded shadow mb-6">
            <p className="text-gray-600">Average Performance Score</p>
            <h2 className="text-4xl font-bold">
              {avgScore.toFixed(1)}%
            </h2>
          </div>

          {/* ASHA SELECTOR */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <p className="text-gray-600 mb-2 font-medium">
              Select ASHA for Performance Analytics
            </p>
            <select
              value={selectedAsha || ""}
              onChange={(e) => setSelectedAsha(e.target.value)}
              className="p-2 border rounded w-full"
            >
              {performanceData.map((p) => (
                <option key={p.asha_id} value={p.asha_id}>
                  {p.asha}
                </option>
              ))}
            </select>
          </div>

          {/* ASHA PERFORMANCE CARDS */}
          <h2 className="text-xl font-semibold mb-3">
            ASHA Performance Overview
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {performanceData.map((p) => (
              <div
                key={p.asha_id}
                className="bg-white p-4 rounded shadow"
              >
                <h3 className="font-semibold">{p.asha}</h3>
                <p className="text-sm text-gray-600">
                  Score: <strong>{p.performance_score}%</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Visits: {p.visits_this_month}
                </p>
                <p className="text-sm text-gray-600">
                  Tasks: {p.tasks_completed}
                </p>
              </div>
            ))}
          </div>

          {/* PERFORMANCE CHARTS FOR SELECTED ASHA */}
          <h2 className="text-xl font-semibold mb-3">
            Performance Trends
          </h2>

          {selectedPerf ? (
            <PerformanceCharts history={selectedPerf.history || []} />
          ) : (
            <p className="text-gray-500">
              No performance data available.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
