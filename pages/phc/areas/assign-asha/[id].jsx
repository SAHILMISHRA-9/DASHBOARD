// pages/phc/areas/assign-asha/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

export default function AssignASHA() {
  const router = useRouter();
  const { id } = router.query;
  const [area, setArea] = useState(null);
  const [ashas, setAshas] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const a = await axios.get(`/api/phc/areas/${id}`);
        setArea(a.data);
        const res = await axios.get("/api/phc/workforce/asha-list");
        setAshas(res.data || []);
        setSelected(a.data.asha_ids?.[0] || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const save = async () => {
    if (!selected) return alert("Select ASHA");
    setSaving(true);
    try {
      await axios.post(`/api/phc/areas/assign-asha/${id}`, { asha_id: Number(selected) });
      router.push(`/phc/areas/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16 max-w-xl">
          <h1 className="text-2xl font-bold mb-4">Assign ASHA to Area</h1>

          <div className="bg-white p-4 rounded shadow mb-4">
            <div className="font-semibold">{area.name}</div>
            <div className="text-sm text-gray-600">Coverage: {area.coverage}%</div>
          </div>

          <label className="block mb-2">Select ASHA</label>
          <select value={selected} onChange={(e)=>setSelected(e.target.value)} className="w-full p-2 border rounded mb-6">
            <option value="">Select ASHA</option>
            {ashas.map(a=> <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="bg-purple-600 text-white px-4 py-2 rounded">{saving ? "Saving…" : "Assign"}</button>
            <Link href={`/phc/areas/${id}`} className="px-4 py-2 border rounded">Cancel</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
