import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function ANMList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Please login as PHC Admin to view ANM workers");
        setLoading(false);
        return;
      }

      // 🔥 use PHC Admin API
      const res = await axios.get(`${BASE_URL}/phcAdmin/anms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setList(res.data || []);
    } catch (err) {
      console.error("ANM list load error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to load ANM workers";
      setError(msg);
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60 bg-gray-50">
        <Navbar />

        <main className="p-6 mt-16 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">ANM Workers</h1>
            <Link
              href="/phc/workforce/anm/add"
              className="bg-blue-600 text-white px-4 py-2 rounded shadow"
            >
              + Add ANM
            </Link>
          </div>

          {loading ? (
            <div className="text-gray-500">Loading ANM workers…</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error loading ANMs</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : list.length === 0 ? (
            <div className="text-gray-600">No ANM workers found.</div>
          ) : (
            <div className="space-y-3">
              {list.map((a) => (
                <div
                  key={a.anm_id}
                  className="bg-white p-4 rounded shadow flex justify-between items-center"
                >
                  {/* Left side: basic info like your sample card */}
                  <div>
                    <div className="font-semibold text-lg">
                      {a.name || "ANM"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Phone: {a.phone || "Not available"}
                    </div>
                    <div className="text-sm text-gray-500">
                      ASHAs supervised: {a.total_ashas ?? 0}
                    </div>
                    {/* If later you add areas for ANM, show them here */}
                    {/* <div className="text-sm text-gray-500">
                      Areas: {a.areas?.join(", ") || "—"}
                    </div> */}
                  </div>

                  {/* Right side: status + actions */}
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        "text-xs px-2 py-1 rounded-full " +
                        (a.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700")
                      }
                    >
                      {a.status || "unknown"}
                    </span>

                    <div className="flex gap-2">
                      <Link
                        href={`/phc/workforce/anm/${a.anm_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/phc/workforce/anm/${a.anm_id}`}
                        className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                    </div>
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
