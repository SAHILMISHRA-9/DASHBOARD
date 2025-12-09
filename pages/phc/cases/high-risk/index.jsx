// pages/phc/cases/high-risk/index.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

export default function HighRiskBoard() {
  const [data, setData] = useState({ cases: [], surveys: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await axios.get("/api/phc/cases/highrisk");
      setData(res.data || { cases: [], surveys: [] });
    } catch (err) {
      console.error(err);
      setData({ cases: [], surveys: [] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">High-Risk Board</h1>
            <button onClick={load} className="px-3 py-2 border rounded">Refresh</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3">High-Risk Cases</h3>
              {loading ? <div>Loading...</div> : (
                data.cases.length === 0 ? <div className="text-gray-500">No high-risk cases</div> : (
                  <div className="space-y-3">
                    {data.cases.map(c => (
                      <div key={c.id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <div className="font-medium">{c.patient_name} <span className="text-sm text-gray-500">({c.category})</span></div>
                          <div className="text-xs text-gray-500">ANM: {c.anm_id || "—"} · ASHA: {c.asha_id || "—"}</div>
                        </div>
                        <Link href={`/phc/cases/${c.category.toLowerCase()}/${c.id}`} className="text-blue-600">View</Link>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3">Survey High-risk Summary</h3>
              {loading ? <div>Loading...</div> : (
                data.surveys.length === 0 ? <div className="text-gray-500">No surveys</div> : (
                  <div className="space-y-2">
                    {data.surveys.map(s => (
                      <div key={s.survey_id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <div className="font-medium">{s.title}</div>
                        </div>
                        <div className="text-red-600 font-semibold">{s.highRiskCount}</div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
