// pages/phc/workforce/asha/tasks/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../../components/layout/SidebarPHC";
import Navbar from "../../../../../components/layout/Navbar";
import Link from "next/link";

export default function AshaTasksPage() {
  const router = useRouter();
  const { id } = router.query; // ASHA id

  const [asha, setAsha] = useState(null);
  const [tasksPayload, setTasksPayload] = useState({ list: [], count: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const [aRes, tRes] = await Promise.all([
        axios.get(`/api/phc/workforce/asha/${id}`), // expects your existing ASHA detail API
        axios.get(`/api/phc/tasks/asha/${id}`)
      ]);
      setAsha(aRes.data || { name: `ASHA #${id}` });
      setTasksPayload(tRes.data || { list: [], count: 0, completed: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(task) {
    setUpdating(true);
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      await axios.put(`/api/phc/tasks/${task.id}`, { status: newStatus });
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setUpdating(false);
    }
  }

  async function toggleHighRisk(task) {
    setUpdating(true);
    try {
      const newHigh = !task.high_risk;
      await axios.put(`/api/phc/tasks/${task.id}`, { high_risk: newHigh });

      // if marking high-risk true → create high-risk record for PHC tracking
      if (newHigh) {
        await axios.post('/api/phc/high-risk', {
          survey_id: task.survey_id,
          task_id: task.id,
          household_index: task.household_index,
          asha_id: Number(id),
          anm_id: task.assigned_anm || null,
          risk_type: "survey-reported",
          comments: ""
        });
      }

      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to update high-risk");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!asha) return <div className="p-6">ASHA not found.</div>;

  const list = tasksPayload.list || [];
  const filtered = list.filter(t => {
    if (filter === "all") return true;
    if (filter === "pending") return t.status !== "completed";
    if (filter === "completed") return t.status === "completed";
    if (filter === "high") return t.high_risk;
    return true;
  });

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16 max-w-4xl">
          <div className="flex justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Tasks — {asha.name}</h1>
              <p className="text-sm text-gray-500">Total: {tasksPayload.count} · Completed: {tasksPayload.completed}</p>
            </div>
            <div>
              <Link href="/phc/workforce/asha" className="px-3 py-1 border rounded">Back</Link>
            </div>
          </div>

          <div className="flex gap-3 items-center mb-4">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="high">High-risk</option>
            </select>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white p-4 rounded shadow">No tasks</div>
            ) : (
              filtered.map(t => (
                <div key={t.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-medium">House #{t.household_index}</div>
                    <div className="text-xs text-gray-500">Status: {t.status} {t.high_risk ? "· High-risk" : ""}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(t)} disabled={updating} className="px-3 py-1 rounded bg-green-600 text-white text-sm">
                      {t.status === "completed" ? "Mark Pending" : "Mark Completed"}
                    </button>
                    <button onClick={() => toggleHighRisk(t)} disabled={updating} className={`px-3 py-1 rounded text-sm ${t.high_risk ? "bg-red-600 text-white" : "border"}`}>
                      {t.high_risk ? "Unmark High Risk" : "Mark High Risk"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
