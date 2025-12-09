// pages/phc/surveys/assign-anm/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

export default function AssignANMPage() {
  const router = useRouter();
  const { id } = router.query; // survey ID

  const [survey, setSurvey] = useState(null);
  const [anms, setAnms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadAll();
  }, [id]);

  async function loadAll() {
    try {
      setLoading(true);
      const sRes = await axios.get(`/api/phc/surveys/${id}`);
      const aRes = await axios.get("/api/phc/workforce/anm-list");

      setSurvey(sRes.data);
      setAnms(aRes.data || []);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }

  function isAssigned(anmId) {
    return (survey?.anm_assigned || []).includes(anmId);
  }

  async function toggleAssign(anmId) {
    setSaving(true);
    try {
      if (isAssigned(anmId)) {
        await axios.delete(`/api/phc/surveys/assign-anm/${id}`, {
          data: { anm_id: anmId }
        });
      } else {
        await axios.post(`/api/phc/surveys/assign-anm/${id}`, {
          anm_id: anmId
        });
      }

      const sRes = await axios.get(`/api/phc/surveys/${id}`);
      setSurvey(sRes.data);
    } catch (err) {
      console.error("Assign error:", err);
      alert("Failed");
    } finally {
      setSaving(false);
    }
  }

  // ⭐ NEW — Assign all tasks under this survey to this ANM (supervision)
  async function assignTasksToANM(anmId) {
    try {
      await axios.post(`/api/phc/tasks/assign-anm/${id}`, { anm_id: anmId });
      alert("Tasks assigned to ANM successfully");
    } catch (err) {
      console.error("ANM task assignment error:", err);
      alert("Failed to assign tasks");
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!survey) return <div className="p-6">Survey not found.</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Assign ANMs — {survey.title}</h1>
              <p className="text-sm text-gray-600">Survey ID: {survey.id}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/phc/surveys/${survey.id}`} className="px-3 py-2 border rounded">
                Back
              </Link>
              <Link href="/phc/surveys" className="px-3 py-2 border rounded">
                All Surveys
              </Link>
            </div>
          </div>

          {/* Assigned ANMs */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Assigned ANMs</h3>

            {(survey.anm_assigned || []).length === 0 ? (
              <p className="text-gray-500">No ANMs assigned yet.</p>
            ) : (
              <ul className="space-y-2">
                {survey.anm_assigned.map((anmId) => {
                  const a =
                    anms.find((x) => x.id === anmId) || { id: anmId, name: `ANM #${anmId}` };

                  return (
                    <li
                      key={anmId}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <span>{a.name}</span>

                      <div className="flex gap-2">
                        {/* NEW: Assign tasks button */}
                        <button
                          onClick={() => assignTasksToANM(a.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Assign Tasks
                        </button>

                        <button
                          onClick={() => toggleAssign(aId)}
                          disabled={saving}
                          className="text-sm text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Available ANMs */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Available ANMs</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {anms.length === 0 ? (
                <p className="text-gray-500">No ANMs found.</p>
              ) : (
                anms.map((anm) => (
                  <div
                    key={anm.id}
                    className="p-3 border rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{anm.name}</div>
                      <div className="text-sm text-gray-500">Phone: {anm.phone}</div>
                    </div>

                    <button
                      onClick={() => toggleAssign(anm.id)}
                      disabled={saving}
                      className={`px-3 py-1 rounded ${
                        isAssigned(anm.id)
                          ? "border text-red-600"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {isAssigned(anm.id) ? "Unassign" : "Assign"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
