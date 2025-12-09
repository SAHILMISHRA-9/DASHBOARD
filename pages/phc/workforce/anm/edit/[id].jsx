import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../../components/layout/SidebarPHC";
import Navbar from "../../../../../components/layout/Navbar";
import Link from "next/link";

export default function EditANM() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    hr_id: "",
    areas: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load ANM Details into Form
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get(`/api/phc/workforce/anm/${id}`);
        const data = res.data;

        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
          hr_id: data.hr_id,
          areas: data.areas || [],
        });
      } catch (err) {
        console.error("Failed to load ANM", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateANM = async () => {
    setSaving(true);

    try {
      await axios.put(`/api/phc/workforce/anm/${id}`, form);

      alert("ANM Updated Successfully!");

      router.push(`/phc/workforce/anm/${id}`);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update ANM");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Edit ANM</h1>

          {/* NAME */}
          <label className="block mb-2 font-medium">Name</label>
          <input
            name="name"
            className="w-full p-2 border rounded mb-4"
            value={form.name}
            onChange={handleChange}
          />

          {/* EMAIL */}
          <label className="block mb-2 font-medium">Email</label>
          <input
            name="email"
            className="w-full p-2 border rounded mb-4"
            value={form.email}
            onChange={handleChange}
          />

          {/* PHONE */}
          <label className="block mb-2 font-medium">Phone</label>
          <input
            name="phone"
            className="w-full p-2 border rounded mb-4"
            value={form.phone}
            onChange={handleChange}
          />

          {/* HR ID */}
          <label className="block mb-2 font-medium">HR ID</label>
          <input
            name="hr_id"
            className="w-full p-2 border rounded mb-4"
            value={form.hr_id}
            onChange={handleChange}
          />

          {/* AREA INPUT */}
          <label className="block mb-2 font-medium">Areas (comma separated)</label>
          <input
            className="w-full p-2 border rounded mb-6"
            value={form.areas.join(", ")}
            onChange={(e) => {
              const list = e.target.value
                .split(",")
                .map((x) => Number(x.trim()))
                .filter((x) => x > 0);
              setForm({ ...form, areas: list });
            }}
          />

          {/* SAVE BUTTON */}
          <button
            disabled={saving}
            onClick={updateANM}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>

          <Link href={`/phc/workforce/anm/${id}`} className="ml-4 text-gray-700">
            Cancel
          </Link>
        </main>
      </div>
    </div>
  );
}
