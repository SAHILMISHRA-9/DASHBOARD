// pages/phc/tasks/new.jsx
import { useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import { useRouter } from "next/router";

export default function NewTask() {
  const router = useRouter();

  const [familyId, setFamilyId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [ashaId, setAshaId] = useState("");
  const [anmId, setAnmId] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await axios.post("/api/phc/tasks/add", {
        family_id: Number(familyId),
        member_id: Number(memberId),
        assigned_asha: Number(ashaId),
        assigned_anm: Number(anmId)
      });

      alert("Task created");
      router.push("/phc/tasks");
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-lg">
          <h1 className="text-2xl font-bold mb-4">Create Task</h1>

          <label>Family ID</label>
          <input
            className="w-full border p-2 mb-4"
            value={familyId}
            onChange={e => setFamilyId(e.target.value)}
          />

          <label>Member ID</label>
          <input
            className="w-full border p-2 mb-4"
            value={memberId}
            onChange={e => setMemberId(e.target.value)}
          />

          <label>ASHA ID</label>
          <input
            className="w-full border p-2 mb-4"
            value={ashaId}
            onChange={e => setAshaId(e.target.value)}
          />

          <label>ANM ID</label>
          <input
            className="w-full border p-2 mb-4"
            value={anmId}
            onChange={e => setAnmId(e.target.value)}
          />

          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {saving ? "Saving..." : "Create Task"}
          </button>
        </main>
      </div>
    </div>
  );
}
