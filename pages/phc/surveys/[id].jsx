// pages/phc/surveys/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import SurveyCharts from "../../../components/surveys/SurveyCharts";
import Link from "next/link";

export default function SurveyAnalytics() {
  const router = useRouter();
  const { id } = router.query;

  const [survey, setSurvey] = useState(null);
  const [anmList, setAnmList] = useState([]);
  const [ashaList, setAshaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD SURVEY DATA
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const [surveyRes, anmRes, ashaRes] = await Promise.all([
          axios.get(`/api/phc/surveys/${id}`),
          axios.get("/api/phc/workforce/anm-list"),
          axios.get("/api/phc/workforce/asha-list")
        ]);

        setSurvey(surveyRes.data);
        setAnmList(anmRes.data || []);
        setAshaList(ashaRes.data || []);
      } catch (err) {
        console.error("Error loading:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // ⭐ FIXED — Task generation function IN SCOPE
  async function generateTasks(count) {
    try {
      setSaving(true);
      await axios.post(`/api/phc/tasks/generate/${id}`, { count });

      const sRes = await axios.get(`/api/phc/surveys/${id}`);
      setSurvey(sRes.data);

      alert(`Generated ${count} tasks`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate tasks");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!survey) return <div className="p-6">Survey not found</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16 max-w-4xl">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{survey.title}</h1>
              <p className="text-sm text-gray-500">Survey ID: {survey.id}</p>
            </div>

            <div className="flex gap-2">
              <Link className="px-3 py-2 border rounded" href={`/phc/surveys/assign-anm/${survey.id}`}>
                Manage ANMs
              </Link>
              <Link className="px-3 py-2 border rounded" href={`/phc/surveys/assign-asha/${survey.id}`}>
                Manage ASHAs
              </Link>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Stat label="Total Households" value={survey.total_households} />
            <Stat label="Completed" value={survey.completed} />
            <Stat label="Pending" value={survey.pending} />
            <Stat label="High-Risk Found" value={survey.high_risk_found} warning />
          </div>

          {/* ⭐ FIXED — TASK GENERATION UI ALWAYS VISIBLE WHEN NO TASKS */}
          {true && (
            <div className="bg-yellow-50 p-4 rounded mb-6 border border-yellow-300">
              <h3 className="font-semibold mb-2">Generate Tasks</h3>
              <p className="text-sm text-gray-700">This survey has no tasks yet. Generate tasks (one per household).</p>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => generateTasks(50)}
                  disabled={saving}
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                >
                  Generate 50 Tasks
                </button>

                <button
                  onClick={() => generateTasks(100)}
                  disabled={saving}
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                >
                  Generate 100 Tasks
                </button>
              </div>
            </div>
          )}

          {/* ASSIGNED ANMs */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Assigned ANMs</h3>

            {survey.anm_assigned.length === 0 ? (
              <p className="text-gray-500">No ANMs assigned.</p>
            ) : (
              <ul className="space-y-2">
                {survey.anm_assigned.map(aid => {
                  const anm = anmList.find(x => x.id === aid) || { id: aid, name: `ANM #${aid}` };
                  return (
                    <li key={aid} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">{anm.name}</div>
                        <div className="text-sm text-gray-500">{anm.phone || "No phone"}</div>
                      </div>
                      <Link href={`/phc/workforce/anm/${anm.id}`} className="text-blue-600">
                        View ANM
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* ASSIGNED ASHAs */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Assigned ASHAs</h3>

            {(survey.asha_assigned || []).length === 0 ? (
              <p className="text-gray-500">No ASHAs assigned.</p>
            ) : (
              <ul className="space-y-2">
                {survey.asha_assigned.map(aId => {
                  const asha =
                    ashaList.find(x => x.id === aId) ||
                    { id: aId, name: `ASHA #${aId}` };

                  return (
                    <li key={aId} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">{asha.name}</div>
                        <div className="text-sm text-gray-500">Phone: {asha.phone || "—"}</div>
                      </div>

                      <Link href={`/phc/workforce/asha/${asha.id}`} className="text-blue-600">
                        View ASHA
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* CHARTS */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Progress Charts</h3>
            <SurveyCharts survey={survey} />
          </div>
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value, warning }) {
  return (
    <div className="bg-white p-5 rounded shadow text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <h2 className={`text-2xl font-bold ${warning ? "text-red-600" : "text-blue-700"}`}>
        {value}
      </h2>
    </div>
  );
}
