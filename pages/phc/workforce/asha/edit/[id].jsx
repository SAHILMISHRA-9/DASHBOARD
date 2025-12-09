// pages/phc/workforce/asha/edit/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../../components/layout/SidebarPHC";
import Navbar from "../../../../../components/layout/Navbar";
import Link from "next/link";

export default function EditASHA() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    supervisor_id: "",
    area_id: "",
  });

  const [anms, setAnms] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load data
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        // Load ASHA details
        const ashaRes = await axios.get(`/api/phc/workforce/asha/${id}`);
        const data = ashaRes.data;

        setForm({
          name: data.name,
          email: data.email || "",
          phone: data.phone || "",
          supervisor_id: data.supervisor_id || "",
          area_id: data.area_id || "",
        });

        // Load ANM list
        const anmRes = await axios.get("/api/phc/workforce/anm-list");
        setAnms(anmRes.data || []);

        // Load Area list
        const areaRes = await axios.get("/api/phc/workforce/summary");
        setAreas(areaRes.data?.areas || []);
      } catch (err) {
        console.error("Error loading ASHA:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveChanges = async () => {
    setSaving(true);

    try {
      await axios.put(`/api/phc/workforce/asha/${id}`, {
        ...form,
        supervisor_id: Number(form.supervisor_id),
        area_id: Number(form.area_id),
      });

      alert("ASHA updated successfully!");
      router.push(`/phc/workforce/asha/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update ASHA.");
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

          <h1 className="text-2xl font-bold mb-4">Edit ASHA</h1>

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

          {/* SUPERVISOR (ANM) */}
          <label className="block mb-2 font-medium">Supervisor (ANM)</label>
          <select
            name="supervisor_id"
            className="w-full p-2 border rounded mb-4"
            value={form.supervisor_id}
            onChange={handleChange}
          >
            <option value="">Select ANM</option>
            {anms.map((anm) => (
              <option key={anm.id} value={anm.id}>
                {anm.name}
              </option>
            ))}
          </select>

          {/* AREA */}
          <label className="block mb-2 font-medium">Area Assigned</label>
          <select
            name="area_id"
            className="w-full p-2 border rounded mb-6"
            value={form.area_id}
            onChange={handleChange}
          >
            <option value="">Select Area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          {/* SAVE BUTTON */}
          <button
            disabled={saving}
            onClick={saveChanges}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>

          <Link href={`/phc/workforce/asha/${id}`} className="ml-4 text-gray-700">
            Cancel
          </Link>

        </main>
      </div>
    </div>
  );
}
