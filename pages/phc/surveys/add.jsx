// pages/phc/surveys/add.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AddSurvey() {
  const router = useRouter();
  const [types, setTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({
    title: "",
    type_id: "",
    area_id: "",
    description: "",
    start_date: "",
    end_date: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const t = await axios.get("/api/phc/surveys/types");
        setTypes(t.data || []);
        const a = await axios.get("/api/phc/areas");
        setAreas(a.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.title) return alert("Title required");
    setSaving(true);
    try {
      await axios.post("/api/phc/surveys", {
        ...form,
        type_id: form.type_id ? Number(form.type_id) : null,
        area_id: form.area_id ? Number(form.area_id) : null
      });
      router.push("/phc/surveys");
    } catch (err) {
      console.error(err);
      alert("Failed to create");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16 max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Create Survey / Campaign</h1>

          <label className="block mb-2">Title</label>
          <input name="title" value={form.title} onChange={handle} className="w-full p-2 border rounded mb-4" />

          <label className="block mb-2">Type</label>
          <select name="type_id" value={form.type_id} onChange={handle} className="w-full p-2 border rounded mb-4">
            <option value="">Select Type</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <label className="block mb-2">Area (optional)</label>
          <select name="area_id" value={form.area_id} onChange={handle} className="w-full p-2 border rounded mb-4">
            <option value="">Whole PHC</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <label className="block mb-2">Description</label>
          <textarea name="description" value={form.description} onChange={handle} className="w-full p-2 border rounded mb-4" />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Start Date</label>
              <input name="start_date" type="date" value={form.start_date} onChange={handle} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-2">End Date</label>
              <input name="end_date" type="date" value={form.end_date} onChange={handle} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">{saving ? "Creating…" : "Create"}</button>
            <Link href="/phc/surveys" className="px-4 py-2 border rounded">Cancel</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
