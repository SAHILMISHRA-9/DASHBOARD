// pages/phc/workforce/asha/assign-anm/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../../components/layout/SidebarPHC";
import Navbar from "../../../../../components/layout/Navbar";
import Link from "next/link";

export default function AssignANM() {
  const router = useRouter();
  const { id } = router.query; // ASHA ID

  const [asha, setAsha] = useState(null);
  const [anmList, setAnmList] = useState([]);
  const [supervisor, setSupervisor] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load ASHA + ANM data
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const resAsha = await axios.get(`/api/phc/workforce/asha/${id}`);
        setAsha(resAsha.data);
        setSupervisor(resAsha.data.supervisor_id || "");

        const resANMs = await axios.get("/api/phc/workforce/anm-list");
        setAnmList(resANMs.data || []);
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const save = async () => {
    if (!supervisor) {
      alert("Please select an ANM");
      return;
    }

    setSaving(true);

    try {
      await axios.post(`/api/phc/workforce/asha/assign-anm/${id}`, {
        anm_id: Number(supervisor),
      });

      alert("Assigned ANM Successfully!");
      router.push(`/phc/workforce/asha/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to assign ANM");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!asha) return <div className="p-6">ASHA not found.</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-xl">
          <h1 className="text-2xl font-bold mb-4">Assign ANM to ASHA</h1>

          {/* ASHA INFO */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <p className="font-semibold">{asha.name}</p>
            <p className="text-gray-600">Phone: {asha.phone}</p>
          </div>

          {/* SELECT ANM */}
          <label className="block mb-2 font-medium">Select ANM</label>
          <select
            className="w-full p-2 border rounded mb-6"
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
          >
            <option value="">Choose ANM</option>
            {anmList.map((anm) => (
              <option key={anm.id} value={anm.id}>
                {anm.name}
              </option>
            ))}
          </select>

          {/* SAVE BUTTON */}
          <button
            disabled={saving}
            onClick={save}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving…" : "Assign ANM"}
          </button>

          <Link
            href={`/phc/workforce/asha/${id}`}
            className="ml-4 text-gray-700"
          >
            Cancel
          </Link>
        </main>
      </div>
    </div>
  );
}
