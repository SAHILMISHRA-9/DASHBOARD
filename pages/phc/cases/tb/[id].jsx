import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

export default function TBDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [rec, setRec] = useState(null);
  const [anms, setAnms] = useState([]);
  const [ashas, setAshas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    const [r, an, ash, ar] = await Promise.all([
      axios.get(`/api/phc/cases/${id}`),
      axios.get("/api/phc/workforce/anm-list"),
      axios.get("/api/phc/workforce/asha-list"),
      axios.get("/api/phc/areas")
    ]);
    setRec(r.data);
    setAnms(an.data || []);
    setAshas(ash.data || []);
    setAreas(ar.data || []);
  }

  async function updateField(field, val) {
    await axios.put(`/api/phc/cases/${id}`, { [field]: val });
    load();
  }

  async function addNote() {
    if (!note.trim()) return;
    await axios.put(`/api/phc/cases/${id}`, { notes: { add: { text: note, by: "PHC" } } });
    setNote("");
    load();
  }

  if (!rec) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-3xl">

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{rec.patient_name}</h1>
            <Link href="/phc/cases/tb" className="px-3 py-2 border rounded">Back</Link>
          </div>

          <p className="text-gray-600 mb-3">TB Screening Case · ID: {rec.id}</p>

          {/* Assignments */}
          <div className="bg-white p-4 rounded shadow mb-5">
            <div className="grid grid-cols-2 gap-3">

              <div>
                <label>ANM</label>
                <select value={rec.anm_id || ""} onChange={e => updateField("anm_id", Number(e.target.value)||null)} className="w-full p-2 border rounded">
                  <option value="">—</option>
                  {anms.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
              </div>

              <div>
                <label>ASHA</label>
                <select value={rec.asha_id || ""} onChange={e => updateField("asha_id", Number(e.target.value)||null)} className="w-full p-2 border rounded">
                  <option value="">—</option>
                  {ashas.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
              </div>

              <div>
                <label>Area</label>
                <select value={rec.area_id || ""} onChange={e => updateField("area_id", Number(e.target.value)||null)} className="w-full p-2 border rounded">
                  <option value="">—</option>
                  {areas.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
              </div>

              <div>
                <label>Risk Level</label>
                <select value={rec.risk_level} onChange={e => updateField("risk_level", e.target.value)} className="w-full p-2 border rounded">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

            </div>
          </div>

          {/* Notes */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Notes</h3>

            {(rec.notes || []).map(n => (
              <div key={n.id} className="border p-2 rounded mb-2">
                <div>{n.text}</div>
                <div className="text-xs text-gray-500">{n.by} · {new Date(n.date).toLocaleString()}</div>
              </div>
            ))}

            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Add note..." className="w-full p-2 border rounded" />
            <button onClick={addNote} className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">Add Note</button>
          </div>

        </main>
      </div>
    </div>
  );
}
