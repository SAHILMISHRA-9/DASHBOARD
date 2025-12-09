// pages/phc/highrisk.jsx
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import SidebarPHC from "../../components/layout/SidebarPHC";
import Navbar from "../../components/layout/Navbar";
import axios from "axios";

export default function HighRiskCentralBoard() {
  const [cases, setCases] = useState([]);
  const [anm, setAnm] = useState("all");
  const [asha, setAsha] = useState("all");
  const [loading, setLoading] = useState(false);

  const phcId = 1; // Later replace with session PHC ID

  async function loadCases() {
    try {
      setLoading(true);
      const res = await axios.get(`/api/phc/high-risk?phc_id=${phcId}`);
      setCases(res.data.data || []);
    } catch (err) {
      console.error("Failed to load high-risk list:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  return (
    <ProtectedRoute role="phc">
      {/* Sidebar fixed */}
      <SidebarPHC />

      {/* Main container FIXED → added pl-64 so content starts after sidebar */}
      <div className="flex min-h-screen bg-gray-100 pl-64">
        <div className="flex-1 flex flex-col">
          <Navbar />

          <div className="p-6">
            <h1 className="text-2xl font-semibold">High-Risk Central Board</h1>
            <p className="text-gray-600 mb-4">
              All High-Risk cases across PHC (Pregnancy, Child, TB, NCD, Emergencies).
            </p>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                className="border p-2 rounded"
                value={anm}
                onChange={(e) => setAnm(e.target.value)}
              >
                <option value="all">All ANMs</option>
              </select>

              <select
                className="border p-2 rounded"
                value={asha}
                onChange={(e) => setAsha(e.target.value)}
              >
                <option value="all">All ASHAs</option>
              </select>

              <button
                onClick={loadCases}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Refresh
              </button>
            </div>

            {/* RESULTS */}
            {loading ? (
              <p>Loading...</p>
            ) : cases.length === 0 ? (
              <p className="text-gray-600 bg-white p-4 rounded shadow">
                No high-risk cases found.
              </p>
            ) : (
              <div className="space-y-4">
                {cases.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded shadow border-l-4 border-red-500"
                  >
                    <h3 className="font-semibold text-lg">
                      {c.category} — {c.risk_reason}
                    </h3>

                    <p className="text-gray-700">{c.details}</p>

                    <div className="mt-2 text-sm text-gray-500">
                      <p>ANM ID: {c.anm_id}</p>
                      <p>Date: {new Date(c.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
