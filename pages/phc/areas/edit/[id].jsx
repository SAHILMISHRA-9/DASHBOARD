// pages/phc/areas/edit/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

export default function EditArea() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({ name: "", description: "", coverage: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await axios.get(`/api/phc/areas/${id}`);
        setForm({ name: res.data.name, description: res.data.description, coverage: res.data.coverage });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/phc/areas/${id}`, form);
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
        <main className="p-6 mt-16 max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Edit Area</h1>

          <label className="block mb-2">Name</label>
          <input name="name" value={form.name} onChange={handle} className="w-full p-2 border rounded mb-4" />

          <label className="block mb-2">Description</label>
          <textarea name="description" value={form.description} onChange={handle} className="w-full p-2 border rounded mb-4" />

          <label className="block mb-2">Coverage (%)</label>
          <input name="coverage" type="number" value={form.coverage} onChange={handle} className="w-full p-2 border rounded mb-6" />

          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">{saving ? "Saving…" : "Save"}</button>
            <Link href={`/phc/areas/${id}`} className="px-4 py-2 border rounded">Cancel</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
