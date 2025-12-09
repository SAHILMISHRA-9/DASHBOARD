import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";

export default function ASHADetail() {
  const router = useRouter();
  const { id } = router.query;

  const [asha, setAsha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get("/api/asha/performance");
        const match = res.data.find((x) => x.id == id);
        if (match) setAsha(match);
      } catch (e) {
        console.error("ASHA detail error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /* ------------------- LOADING ------------------- */
  if (loading)
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex-1 flex flex-col overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20">Loading…</main>
        </div>
      </div>
    );

  if (!asha)
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex-1 flex flex-col overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20 text-red-600">
            ASHA record not found.
          </main>
        </div>
      </div>
    );

  const breakdown = asha.visitBreakdown;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      {/* RIGHT SIDE AREA */}
      <div className="flex-1 flex flex-col overflow-hidden pl-64">
        <Navbar />

        {/* SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-6 pt-20 space-y-6">

          {/* HEADER */}
          <h1 className="text-2xl font-bold">{asha.name}</h1>

          {/* OVERVIEW CARD */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Overview</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>Total Visits: <b>{asha.totalVisits}</b></p>
              <p>Completed Tasks: <b>{asha.completedTasks}</b></p>
              <p>Pending Tasks: <b>{asha.pendingTasks}</b></p>
              <p>High-Risk Cases Identified: <b>{asha.highRiskCases}</b></p>
              <p className="col-span-2">Last Sync: {asha.lastSync}</p>
            </div>
          </section>

          {/* BREAKDOWN CARD */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Visit Breakdown</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <p>ANC Visits: <b>{breakdown.anc}</b></p>
              <p>PNC Visits: <b>{breakdown.pnc}</b></p>
              <p>Child Visits: <b>{breakdown.child}</b></p>
              <p>NCD Visits: <b>{breakdown.ncd}</b></p>
              <p>TB Visits: <b>{breakdown.tb}</b></p>
              <p>General Visits: <b>{breakdown.general}</b></p>
            </div>
          </section>

          {/* PERFORMANCE SCORE */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Performance Score</h2>

            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                style={{ width: `${asha.performanceScore}%` }}
                className="h-3 bg-green-600 rounded"
              />
            </div>

            <p className="mt-2 text-sm">{asha.performanceScore}%</p>
          </section>

        </main>
      </div>
    </div>
  );
}
