// pages/phc/areas/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import Link from "next/link";

export default function AreaDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [area, setArea] = useState(null);
  const [anms, setAnms] = useState([]);
  const [ashas, setAshas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const a = await axios.get(`/api/phc/areas/${id}`);
        setArea(a.data);

        const resAnm = await axios.get("/api/phc/workforce/anm-list");
        setAnms(resAnm.data || []);

        const resAsha = await axios.get("/api/phc/workforce/asha-list");
        setAshas(resAsha.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ------------------------
  // REMOVE ANM FROM AREA
  // ------------------------
  const removeANM = async (anmId) => {
    try {
      await axios.post(`/api/phc/areas/assign-anm/${id}`, {
        anm_id: anmId,
        action: "remove",
      });
      location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to remove ANM.");
    }
  };

  // ------------------------
  // REMOVE ASHA FROM AREA
  // ------------------------
  const removeASHA = async (ashaId) => {
    try {
      await axios.post(`/api/phc/areas/assign-asha/${id}`, {
        asha_id: ashaId,
        action: "remove",
      });
      location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to remove ASHA.");
    }
  };

  // ------------------------
  // DELETE AREA (with modal)
  // ------------------------
  const deleteArea = async () => {
    try {
      await axios.delete(`/api/phc/areas/${id}`);
      router.push("/phc/areas");
    } catch (err) {
      console.error(err);
      alert("Failed to delete area.");
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!area) return <div className="p-6">Area not found</div>;

  const assignedANMs = anms.filter((a) => area.anm_ids?.includes(a.id));
  const assignedASHAs = ashas.filter((a) => area.asha_ids?.includes(a.id));

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="p-6 mt-16 max-w-3xl">

          <h1 className="text-2xl font-bold mb-4">{area.name}</h1>

          {/* AREA INFO */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <p className="text-gray-600">{area.description}</p>
            <p className="mt-2">
              <strong>Coverage:</strong> {area.coverage}%
            </p>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/phc/areas/edit/${area.id}`}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </Link>

              <Link
                href={`/phc/areas/assign-anm/${area.id}`}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Assign ANM
              </Link>

              <Link
                href={`/phc/areas/assign-asha/${area.id}`}
                className="px-3 py-1 bg-purple-600 text-white rounded"
              >
                Assign ASHA
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3 py-1 border rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>

          {/* ANM SECTION */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Assigned ANMs</h3>

            {assignedANMs.length === 0 ? (
              <p className="text-gray-500 text-sm">No ANMs assigned.</p>
            ) : (
              assignedANMs.map((a) => (
                <div key={a.id} className="flex justify-between items-center border-b py-2">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-gray-500">Phone: {a.phone}</div>
                  </div>
                  <button
                    onClick={() => removeANM(a.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ASHA SECTION */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Assigned ASHAs</h3>

            {assignedASHAs.length === 0 ? (
              <p className="text-gray-500 text-sm">No ASHAs assigned.</p>
            ) : (
              assignedASHAs.map((a) => (
                <div key={a.id} className="flex justify-between items-center border-b py-2">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-gray-500">Phone: {a.phone}</div>
                  </div>
                  <button
                    onClick={() => removeASHA(a.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </main>

        {/* -----------------------------
           DELETE CONFIRMATION MODAL
        ------------------------------ */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-3">Delete Area</h2>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this area? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteArea}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Yes, delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
