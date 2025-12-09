// pages/phc/surveys/assign-tasks/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

export default function AssignTasksPage() {
  const router = useRouter();
  const { id } = router.query;

  const [survey, setSurvey] = useState(null);
  const [tasksSummary, setTasksSummary] = useState(null);
  const [ashaList, setAshaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [mode, setMode] = useState("auto");
  const [manualMap, setManualMap] = useState({});

  useEffect(() => {
    if (!id) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadAll() {
    setLoading(true);
    try {
      const [sRes, tRes, aRes] = await Promise.all([
        axios.get(`/api/phc/surveys/${id}`),
        axios.get(`/api/phc/tasks/survey/${id}`),
        axios.get("/api/phc/workforce/asha-list")
      ]);
      setSurvey(sRes.data);
      setTasksSummary(tRes.data);
      setAshaList(aRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function runAutoAssign() {
    if (!ashaList.length) return alert("No ASHAs available");
    setAssigning(true);
    try {
      await axios.post(`/api/phc/tasks/assign-tasks/${id}`, { mode: "auto", ashaIds: ashaList.map(a => a.id) });
      await loadAll();
      alert("Tasks auto-assigned");
    } catch (err) {
      console.error(err);
      alert("Failed to assign");
    } finally {
      setAssigning(false);
    }
  }

  async function runManualAssign() {
    setAssigning(true);
    try {
      await axios.post(`/api/phc/tasks/assign-tasks/${id}`, { mode: "manual", mapping: manualMap });
      await loadAll();
      alert("Manual assignments saved");
    } catch (err) {
      console.error(err);
      alert("Failed to assign manually");
    } finally {
      setAssigning(false);
    }
  }

  function setManual(taskId, ashaId) {
    setManualMap(prev => ({ ...prev, [taskId]: Number(ashaId) }));
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!survey) return <div className="p-6">Survey not found</div>;

  const tasks = tasksSummary?.list || [];

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16 max-w-5xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">Assign Tasks — {survey.title}</h1>
              <p className="text-sm text-gray-500">Survey ID: {survey.id}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/phc/surveys/${survey.id}`} className="px-3 py-2 border rounded">Back</Link>
              <Link href="/phc/surveys" className="px-3 py-2 border rounded">All Surveys</Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Total tasks</p>
              <p className="text-2xl font-bold">{tasksSummary?.total ?? 0}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{tasksSummary?.completed ?? 0}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{tasksSummary?.pending ?? 0}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Assignment Mode</h3>

            <div className="flex items-center gap-4 mb-4">
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={mode === "auto"} onChange={() => setMode("auto")} />
                <span>Auto distribute evenly</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={mode === "manual"} onChange={() => setMode("manual")} />
                <span>Manual (assign each task)</span>
              </label>
            </div>

            {mode === "auto" ? (
              <div className="flex gap-3 items-center">
                <div className="text-sm text-gray-600">ASHAs available: {ashaList.length}</div>
                <button onClick={runAutoAssign} disabled={assigning} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {assigning ? "Assigning…" : "Auto Assign Tasks"}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3">Manual: choose ASHA for tasks below</p>

                <div className="max-h-[400px] overflow-auto border rounded p-2">
                  {tasks.length === 0 ? (
                    <p className="text-gray-500">No tasks.</p>
                  ) : (
                    tasks.slice(0, 500).map(t => (
                      <div key={t.id} className="flex items-center justify-between py-2 px-2 border-b">
                        <div>
                          <div className="font-medium">House #{t.household_index}</div>
                          <div className="text-xs text-gray-500">Status: {t.status}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select value={manualMap[t.id] || ""} onChange={(e) => setManual(t.id, e.target.value)} className="p-1 border rounded">
                            <option value="">Assign ASHA</option>
                            {ashaList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3">
                  <button onClick={runManualAssign} disabled={assigning} className="px-4 py-2 bg-blue-600 text-white rounded">
                    {assigning ? "Assigning…" : "Save Manual Assignments"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
