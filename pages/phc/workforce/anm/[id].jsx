import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function ANMDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [anm, setAnm] = useState(null);              // profile
  const [ashaList, setAshaList] = useState([]);      // supervised_ashas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // LOAD ANM DETAILS
  useEffect(() => {
    if (!id) return;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Please login as PHC Admin to view ANM details");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/phcAdmin/anms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data || {};
        setAnm(data.profile || null);
        setAshaList(data.supervised_ashas || []);
      } catch (err) {
        console.error("ANM DETAILS ERROR:", err);
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load ANM details";
        setError(msg);
        setAnm(null);
        setAshaList([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <SidebarPHC />
        <div className="flex-1 ml-60">
          <Navbar />
          <main className="p-6 mt-16">
            <div className="text-gray-500">Loading ANM details…</div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !anm) {
    return (
      <div className="flex min-h-screen">
        <SidebarPHC />
        <div className="flex-1 ml-60">
          <Navbar />
          <main className="p-6 mt-16 max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error loading ANM</p>
              <p className="text-sm mt-1">{error || "ANM not found"}</p>
            </div>
            <Link
              href="/phc/workforce/anm"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
            >
              ← Back to ANM List
            </Link>
          </main>
        </div>
      </div>
    );
  }

  const anmId = anm.anm_id || id;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60 bg-gray-50">
        <Navbar />

        <main className="p-6 mt-16 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">ANM Details</h1>

          {/* DETAILS CARD – like your sample */}
          <div className="bg-white p-5 shadow rounded mb-6">
            <h2 className="text-xl font-semibold mb-3">
              {anm.name || "ANM"}
            </h2>

            <p className="text-sm">
              <span className="font-semibold">Phone:</span>{" "}
              {anm.phone || "Not available"}
            </p>

            <p className="text-sm mt-1">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={
                  anm.status === "active"
                    ? "text-green-600 font-medium"
                    : "text-gray-700"
                }
              >
                {anm.status || "unknown"}
              </span>
            </p>

            <p className="text-sm mt-1">
              <span className="font-semibold">ASHAs supervised:</span>{" "}
              {ashaList.length}
            </p>
          </div>

          {/* ASHA LIST CARD */}
          <div className="bg-white p-5 shadow rounded mb-6">
            <h3 className="text-lg font-semibold mb-2">
              ASHAs Under This ANM
            </h3>

            {ashaList.length === 0 ? (
              <p className="text-gray-600 text-sm">No ASHAs assigned.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {ashaList.map((asha) => (
                  <li key={asha.asha_id}>
                    <Link
                      href={`/phc/workforce/asha/${asha.asha_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {asha.name}{" "}
                      {asha.phone && (
                        <span className="text-gray-500">
                          ({asha.phone})
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <Link
              href={`/phc/workforce/anm/${anmId}/edit`}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Edit ANM
            </Link>
            <Link
              href={`/phc/workforce/anm/${anmId}/reset-password`}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Reset Password
            </Link>

            <Link
              href="/phc/workforce/anm"
              className="bg-gray-200 px-4 py-2 rounded text-sm"
            >
              Back
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
