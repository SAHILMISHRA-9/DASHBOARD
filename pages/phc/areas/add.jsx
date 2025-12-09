// pages/phc/areas/add.jsx
import { useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AddArea() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return alert("Name required");
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      await axios.post("/api/phc/areas", { name }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      router.push("/phc/areas");
    } catch (err) {
      console.error(err);
      alert("Failed");
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
          <h1 className="text-2xl font-bold mb-4">Add Area</h1>

          <label className="block mb-2">Name</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mb-6"
            placeholder="e.g., Ward 5"
          />

          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">{saving ? "Saving…" : "Save"}</button>
            <Link href="/phc/areas" className="px-4 py-2 border rounded">Cancel</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
