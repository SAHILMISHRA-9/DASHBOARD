// pages/phc/workforce/performance/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";
import PerformanceCharts from "../../../../components/performance/PerformanceCharts";


export default function AshaPerformance() {
  const router = useRouter();
  const { id } = router.query;

  const [asha, setAsha] = useState(null);
  const [perf, setPerf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        // Load ASHA base info
        const resAsha = await axios.get(`/api/phc/workforce/asha/${id}`);
        setAsha(resAsha.data);

        // Load Performance
        const resPerf = await axios.get(
          `/api/phc/workforce/performance/${id}`
        );
        setPerf(resPerf.data);
      } catch (err) {
        console.error("Performance load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!asha || !perf) return <div className="p-6">Data not found.</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-3xl">

          <h1 className="text-2xl font-bold mb-6">
            ASHA Performance Overview
          </h1>

          {/* ASHA INFO CARD */}
          <div className="bg-white p-5 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">{asha.name}</h2>
            <p><strong>Phone:</strong> {asha.phone}</p>
            <p><strong>Email:</strong> {asha.email || "—"}</p>
          </div>

          {/* PERFORMANCE CARD */}
          <div className="bg-white p-5 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-3">Performance Summary</h3>

            <p className="text-gray-700 mb-2">
              <strong>Visits This Month:</strong> {perf.visits_this_month}
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Tasks Completed:</strong> {perf.tasks_completed}
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Performance Score:</strong> {perf.performance_score} / 100
            </p>

            <p className="text-gray-500 mt-2 text-sm">
              Last updated: {new Date(perf.last_updated).toLocaleString()}
            </p>
          </div>
          {/* PERFORMANCE GRAPHS */}
<PerformanceCharts history={perf.history || []} />

          <Link
  href={`/phc/workforce/performance/edit/${id}`}
  className="inline-block bg-blue-600 text-white px-4 py-2 rounded mt-4"
>
  Edit Performance
</Link>


          {/* BACK BUTTON */}
          <Link
            href={`/phc/workforce/asha/${id}`}
            className="text-gray-700"
          >
            ← Back to ASHA Details
          </Link>

        </main>
      </div>
    </div>
  );
}
