import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NewChild() {
  const router = useRouter();

  const [form, setForm] = useState({
    patient_name: "",
    age: "",
    risk_level: "low",
    anm_id: "",
    asha_id: "",
    area_id: ""
  });

  const [anms, setAnms] = useState([]);
  const [ashas, setAshas] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    async function load() {
      const [A, B, C] = await Promise.all([
        axios.get("/api/phc/areas"),
        axios.get("/api/phc/workforce/anm-list"),
        axios.get("/api/phc/workforce/asha-list"),
      ]);

      setAreas(A.data || []);
      setAnms(B.data || []);
      setAshas(C.data || []);
    }
    load();
  }, []);

  async function save() {
    if (!form.patient_name.trim()) return alert("Patient name required");

    await axios.post("/api/phc/cases", {
      ...form,
      category: "CHILD"
    });

    router.push("/phc/cases/child");
  }

  function update(k, v) {
    setForm({ ...form, [k]: v });
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-2xl">

          <h1 className="text-2xl font-bold mb-4">New Child Immunization Case</h1>

          <label>Patient Name</label>
          <input className="w-full p-2 border rounded mb-3"
                 value={form.patient_name}
                 onChange={e => update("patient_name", e.target.value)} />

          <label>Age</label>
          <input className="w-full p-2 border rounded mb-3"
                 value={form.age}
                 onChange={e => update("age", e.target.value)} />

          <label>Risk Level</label>
          <select className="w-full p-2 border rounded mb-3"
                  value={form.risk_level}
                  onChange={e => update("risk_level", e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label>ANM</label>
          <select className="w-full p-2 border rounded mb-3"
                  value={form.anm_id}
                  onChange={e => update("anm_id", e.target.value)}>
            <option value="">—</option>
            {anms.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <label>ASHA</label>
          <select className="w-full p-2 border rounded mb-3"
                  value={form.asha_id}
                  onChange={e => update("asha_id", e.target.value)}>
            <option value="">—</option>
            {ashas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <label>Area</label>
          <select className="w-full p-2 border rounded mb-3"
                  value={form.area_id}
                  onChange={e => update("area_id", e.target.value)}>
            <option value="">—</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
          <Link href="/phc/cases/child" className="ml-3 px-4 py-2 border rounded">Cancel</Link>

        </main>
      </div>
    </div>
  );
}
