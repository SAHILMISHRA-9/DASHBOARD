// pages/phc/surveys/index.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import Link from "next/link";

export default function SurveysList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await axios.get("/api/phc/surveys");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      setList([]);
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
            <h1 className="text-2xl font-bold">Surveys & Campaigns</h1>
            <div className="flex gap-2">
              <Link href="/phc/surveys/add" className="bg-blue-600 text-white px-4 py-2 rounded">+ Create Survey</Link>
              <Link href="/phc/surveys/types" className="px-3 py-2 border rounded">Manage Types</Link>
            </div>
          </div>

          {loading ? <div>Loading…</div> : list.length === 0 ? <div className="text-gray-600">No surveys</div> : (
            <div className="space-y-3">
              {list.map(s => (
                <div key={s.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-sm text-gray-600">{s.description}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {s.start_date} → {s.end_date} • Tasks: {s.progress?.total_tasks ?? 0} • Completed: {s.progress?.completed_tasks ?? 0}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/phc/surveys/${s.id}`} className="text-blue-600">View</Link>
                    <Link href={`/phc/surveys/edit/${s.id}`} className="px-3 py-1 border rounded text-sm">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
