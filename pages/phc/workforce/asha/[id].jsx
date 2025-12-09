// pages/phc/workforce/asha/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function AshaDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null); // { profile, areas, families, tasks }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Please login as PHC Admin to view ASHA details");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${BASE_URL}/phcAdmin/ashas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.error("ASHA details error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to load ASHA details";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <SidebarPHC />
        <div className="flex-1 ml-60">
          <Navbar />
          <main className="p-6 mt-16">
            <div className="text-gray-500">Loading ASHA details…</div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen">
        <SidebarPHC />
        <div className="flex-1 ml-60">
          <Navbar />
          <main className="p-6 mt-16 max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error loading ASHA</p>
              <p className="text-sm mt-1">{error || "ASHA not found"}</p>
            </div>
            <Link
              href="/phc/workforce/asha"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
            >
              ← Back to ASHA List
            </Link>
          </main>
        </div>
      </div>
    );
  }

  const { profile, areas, families, tasks } = data;
  const areaNames =
    Array.isArray(areas) && areas.length > 0
      ? areas.map((a) => a.area_name).join(", ")
      : "—";

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60 bg-gray-50">
        <Navbar />

        <main className="p-6 mt-16 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">ASHA Details</h1>

          {/* Top card */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <div className="text-xl font-semibold mb-2">
              {profile?.name || "ASHA"}
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              {/* Email not in backend yet, show placeholder */}
              <div>
                <span className="font-medium">Email:</span>{" "}
                {profile?.email || "Not available"}
              </div>

              <div>
                <span className="font-medium">Phone:</span>{" "}
                {profile?.phone || "Not available"}
              </div>

              <div>
                <span className="font-medium">Supervisor (ANM):</span>{" "}
                {profile?.anm_worker_id
                  ? `ANM #${profile.anm_worker_id}`
                  : "Not assigned"}
              </div>

              <div>
                <span className="font-medium">Area Assigned:</span>{" "}
                {areaNames}
              </div>

              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    profile?.status === "active"
                      ? "text-green-600 font-medium"
                      : "text-gray-600"
                  }
                >
                  {profile?.status || "unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions row (buttons only UI for now) */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded bg-blue-600 text-white text-sm">
                Edit ASHA
              </button>
              <button className="px-4 py-2 rounded bg-green-600 text-white text-sm">
                Assign ANM
              </button>
              <button className="px-4 py-2 rounded bg-purple-600 text-white text-sm">
                Assign Area
              </button>
              <button className="px-4 py-2 rounded bg-yellow-500 text-white text-sm">
                View Performance
              </button>
              <button className="px-4 py-2 rounded bg-red-600 text-white text-sm">
                Disable ASHA
              </button>
            </div>
          </div>

          {/* Optional: Families summary */}
          <section className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Families</h3>
            {!families || families.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No families assigned to this ASHA yet.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {families.map((f) => (
                  <li key={f.family_id} className="border rounded p-2">
                    <div className="font-medium">
                      Family #{f.family_id.slice(0, 8)}…
                    </div>
                    <div className="text-gray-600">
                      {f.address_line || "No address"}
                      {f.landmark && ` · Landmark: ${f.landmark}`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Optional: Tasks summary */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Tasks</h3>
            {!tasks || tasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks assigned.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {tasks.map((t) => (
                  <li key={t.id} className="border rounded p-2">
                    <div className="font-medium">
                      {t.title || `Task #${t.id}`}
                    </div>
                    <div className="text-gray-600">
                      {t.status && `Status: ${t.status}`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="mt-4">
            <Link
              href="/phc/workforce/asha"
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to ASHA List
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
