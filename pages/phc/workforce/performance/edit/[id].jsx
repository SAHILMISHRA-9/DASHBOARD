// pages/phc/workforce/performance/edit/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../../components/layout/SidebarPHC";
import Navbar from "../../../../../components/layout/Navbar";
import Link from "next/link";

export default function EditPerformance() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    visits_this_month: 0,
    tasks_completed: 0,
    performance_score: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load current performance data
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get(`/api/phc/workforce/performance/${id}`);
        setForm({
          visits_this_month: res.data.visits_this_month,
          tasks_completed: res.data.tasks_completed,
          performance_score: res.data.performance_score,
        });
      } catch (err) {
        console.error("Performance load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value),
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/phc/workforce/performance/${id}`, form);

      alert("Performance updated successfully!");
      router.push(`/phc/workforce/performance/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update performance");
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
          <h1 className="text-2xl font-bold mb-6">Edit ASHA Performance</h1>

          {/* Visits */}
          <label className="block mb-2 font-medium">Visits This Month</label>
          <input
            name="visits_this_month"
            type="number"
            className="w-full p-2 border rounded mb-4"
            value={form.visits_this_month}
            onChange={handleChange}
          />

          {/* Tasks Completed */}
          <label className="block mb-2 font-medium">Tasks Completed</label>
          <input
            name="tasks_completed"
            type="number"
            className="w-full p-2 border rounded mb-4"
            value={form.tasks_completed}
            onChange={handleChange}
          />

          {/* Performance Score */}
          <label className="block mb-2 font-medium">Performance Score (0-100)</label>
          <input
            name="performance_score"
            type="number"
            max="100"
            min="0"
            className="w-full p-2 border rounded mb-6"
            value={form.performance_score}
            onChange={handleChange}
          />

          {/* Save Button */}
          <button
            disabled={saving}
            onClick={save}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>

          {/* Cancel */}
          <Link
            href={`/phc/workforce/performance/${id}`}
            className="ml-4 text-gray-700"
          >
            Cancel
          </Link>
        </main>
      </div>
    </div>
  );
}
