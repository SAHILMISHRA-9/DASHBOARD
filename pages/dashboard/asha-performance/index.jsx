import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

export default function ASHAPerformance() {
  const [ashaList, setAshaList] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/asha/performance");
        setAshaList(res.data);
      } catch (e) {
        console.error("Error loading ASHA performance", e);
      }
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen">
      <SidebarANM />
      <div className="flex-1 ml-64">
        <Navbar />

        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">ASHA Performance Panel</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ashaList.map((asha) => (
              <Link
                key={asha.id}
                href={`/dashboard/asha-performance/${asha.id}`}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border"
              >
                <h2 className="text-xl font-semibold">{asha.name}</h2>

                <div className="mt-3 text-sm space-y-1">
                  <p>Total Visits: <span className="font-medium">{asha.totalVisits}</span></p>
                  <p>Completed Tasks: <span className="font-medium">{asha.completedTasks}</span></p>
                  <p>Pending Tasks: <span className="font-medium">{asha.pendingTasks}</span></p>
                  <p>High-Risk Found: <span className="font-medium text-red-600">{asha.highRiskCases}</span></p>
                  <p>Last Sync: <span className="font-medium">{asha.lastSync}</span></p>
                </div>

                {/* Score Bar */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Performance Score
                  </p>

                  <div className="w-full bg-gray-200 h-3 rounded mt-1">
                    <div
                      style={{ width: `${asha.performanceScore}%` }}
                      className="h-3 bg-blue-600 rounded"
                    ></div>
                  </div>

                  <p className="mt-1 text-sm">{asha.performanceScore}%</p>
                </div>

                <div className="mt-3 text-blue-600 text-sm font-medium">
                  View Details →
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
