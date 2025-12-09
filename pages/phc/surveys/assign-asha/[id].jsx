import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

export default function AssignAshaPage() {
  const router = useRouter();
  const { id } = router.query;

  const [survey, setSurvey] = useState(null);
  const [ashaList, setAshaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const sRes = await axios.get(`/api/phc/surveys/${id}`);
        setSurvey(sRes.data);

        const ashaRes = await axios.get("/api/phc/workforce/asha-list");
        setAshaList(ashaRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function isAssigned(ashaId) {
    return (survey?.asha_assigned || []).includes(ashaId);
  }

  async function toggleAssign(ashaId) {
    setSaving(true);
    try {
      if (isAssigned(ashaId)) {
        await axios.delete(`/api/phc/surveys/assign-asha/${id}`, {
          data: { asha_id: ashaId }
        });
      } else {
        await axios.post(`/api/phc/surveys/assign-asha/${id}`, {
          asha_id: ashaId
        });
      }

      // Reload survey after update
      const sRes = await axios.get(`/api/phc/surveys/${id}`);
      setSurvey(sRes.data);

    } catch (err) {
      console.error(err);
      alert("Failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!survey) return <div className="p-6">Survey not found</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-3xl">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">
              Assign ASHAs — {survey.title}
            </h1>
            <Link
              href={`/phc/surveys/${survey.id}`}
              className="px-3 py-2 border rounded"
            >
              Back
            </Link>
          </div>

          {/* ASSIGNED ASHAs */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Assigned ASHAs</h3>

            {(survey.asha_assigned || []).length === 0 ? (
              <p className="text-gray-500">No ASHAs assigned.</p>
            ) : (
              <ul className="space-y-2">
                {survey.asha_assigned.map((aId) => {
                  const a =
                    ashaList.find((x) => x.id === aId) ||
                    { id: aId, name: `ASHA #${aId}` };

                  return (
                    <li
                      key={aId}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-sm text-gray-500">
                          Phone: {a.phone || "—"}
                        </div>
                      </div>

                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => toggleAssign(aId)}
                        disabled={saving}
                      >
                        Unassign
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* AVAILABLE ASHAs */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Available ASHAs</h3>

            <div className="space-y-3">
              {ashaList.map((a) => (
                <div
                  key={a.id}
                  className="p-3 border rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-gray-500">
                      Phone: {a.phone}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAssign(a.id)}
                    disabled={saving}
                    className={`px-3 py-1 rounded ${
                      isAssigned(a.id)
                        ? "text-red-600 border"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {isAssigned(a.id) ? "Unassign" : "Assign"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
