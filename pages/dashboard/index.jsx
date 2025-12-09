// pages/dashboard/index.jsx

import { useEffect, useState } from "react";
import SidebarANM from "../../components/layout/SidebarANM.jsx"; 
import Navbar from "../../components/layout/Navbar.jsx"; 
import axios from "axios";
import Link from "next/link";

export default function DashboardHome() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/dashboard/summary");
        setSummary(res.data || {});
      } catch (err) {
        console.error("Failed to load summary:", err);
        setSummary({});
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ------------------------
  // SECURE LOADING UI
  // ------------------------
  if (loading || !summary) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex flex-col flex-1 overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-[80px]">
            Loading dashboard…
          </main>
        </div>
      </div>
    );
  }

  const kpis = summary?.kpis || [];
  const highRiskCases = summary?.highRiskCases || { top: [], total: 0 };
  const moduleSummaries = summary?.moduleSummaries || [];

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 overflow-hidden pl-64">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 pt-[80px]">

          {/* HEADER */}
          <section className="mb-6">
            <h1 className="text-3xl font-bold mb-1">Welcome to ANM Portal</h1>
            <p className="text-sm text-gray-500">
              Comprehensive maternal and child health management system.
            </p>
          </section>

          {/* KPI CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((k, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-500">{k.label}</p>
                  <p className="text-2xl font-semibold mt-1">{k.value}</p>
                </div>
                <div className="text-3xl text-gray-300">{k.icon}</div>
              </div>
            ))}
          </section>

          {/* HIGH-RISK DASHBOARD */}
          <section className="mb-6">
            <div className="border rounded-lg bg-red-50 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-red-600 font-semibold">⚠️ PRIORITY</span>
                    <h2 className="text-lg font-bold">High-Risk Dashboard</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    View all cases across categories marked high-risk.
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-red-700">{highRiskCases.total}</p>
                  <p className="text-sm text-gray-500">Requires attention</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {highRiskCases.top.map((h) => (
                  <div key={h.id} className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">{h.category}</p>
                    <p className="font-medium">{h.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{h.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* MODULE GROUPS */}
          <section className="space-y-10">

            <ModuleGroup
              title="Maternal Health"
              list={moduleSummaries.filter((m) => m.group === "maternal")}
            />

            <ModuleGroup
              title="Child Health"
              list={moduleSummaries.filter((m) => m.group === "child")}
            />

            <ModuleGroup
              title="Screening & Monitoring"
              list={moduleSummaries.filter((m) => m.group === "screening")}
              columns="sm:grid-cols-3"
            />

            <ModuleGroup
              title="Operations & Administration"
              list={moduleSummaries.filter((m) => m.group === "ops")}
              columns="sm:grid-cols-3"
            />

          </section>
        </main>
      </div>
    </div>
  );
}

function ModuleGroup({ title, list, columns = "sm:grid-cols-2" }) {
  return (
    <div>
      <h3 className="font-semibold mb-3 text-gray-700">{title}</h3>

      <div className={`grid grid-cols-1 ${columns} gap-4`}>
        {list.map((m) => (
          <Link
            key={m.slug}
            href={m.href}
            className="block bg-white rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{m.title}</p>
                <p className="text-xl font-semibold mt-1">{m.count}</p>
                <p className="text-xs text-gray-400 mt-1">{m.subtitle}</p>
              </div>
              <div className="text-3xl text-gray-200">{m.icon}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
