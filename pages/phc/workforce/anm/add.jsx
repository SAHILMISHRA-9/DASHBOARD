

import { useState, useEffect } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function AddANM() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    area_id: "",
  });

  const [areas, setAreas] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load Areas from backend
  useEffect(() => {
    async function loadAreas() {
      try {
        const token = localStorage.getItem("auth_token");

        const res = await axios.get(`${BASE_URL}/phcs/areas/list`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setAreas(res.data.areas || []);
      } catch (err) {
        console.error("Failed to load areas:", err.response?.data || err.message);
      }
    }

    loadAreas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.name || !form.phone || !form.password || !form.area_id) {
      alert("All fields except Email are required");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("auth_token");

      const payload = {
        name: form.name,
        phone: form.phone,
        role: "anm",             // 👈 ANM role
        password: form.password,
        areas: [form.area_id],   // single area, as in ASHA
      };

      const res = await axios.post(`${BASE_URL}/phc/users/create`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const { message, user_id, worker_id } = res.data;

      alert(`${message}\nUser ID: ${user_id}\nWorker ID: ${worker_id}`);

      window.location.href = "/phc/workforce/anm";
    } catch (err) {
      console.error("Error creating ANM:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating ANM");
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
          <h1 className="text-2xl font-bold mb-4">Add ANM Worker</h1>

          {/* NAME */}
          <label className="block mb-2 font-medium">Name</label>
          <input
            name="name"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter ANM Name"
            onChange={handleChange}
          />

          {/* PHONE */}
          <label className="block mb-2 font-medium">Phone</label>
          <input
            name="phone"
            className="w-full p-2 border rounded mb-4"
            placeholder="Phone"
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <label className="block mb-2 font-medium">Password</label>
          <input
            name="password"
            type="password"
            className="w-full p-2 border rounded mb-4"
            placeholder="Password"
            onChange={handleChange}
          />

          {/* AREA SELECT */}
          <label className="block mb-2 font-medium">Assign Area</label>
          <select
            name="area_id"
            value={form.area_id}
            className="w-full p-2 border rounded mb-6 bg-white text-black"
            onChange={handleChange}
          >
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.area_name || area.name}
              </option>
            ))}
          </select>

          {/* SAVE BUTTON */}
          <button
            disabled={saving}
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save ANM"}
          </button>

          <Link href="/phc/workforce/anm" className="ml-4 text-gray-700">
            Cancel
          </Link>
        </main>
      </div>
    </div>
  );
}
