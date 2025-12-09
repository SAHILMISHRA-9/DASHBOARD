import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";

export default function SurveyTypes() {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");

  useEffect(() => {
    loadTypes();
  }, []);

  async function loadTypes() {
    try {
      const res = await axios.get("/api/phc/surveys/types");
      setTypes(res.data || []);
    } catch (err) {
      console.error("Error loading types:", err);
    }
  }

  async function addType() {
    if (!newType.trim()) return alert("Enter a type name");

    try {
      await axios.post("/api/phc/surveys/types", { name: newType.trim() });
      setNewType("");
      loadTypes();
    } catch (err) {
      console.error("Add type error:", err);
      alert("Failed to add survey type");
    }
  }

  async function removeType(id) {
    if (!confirm("Delete this survey type?")) return;

    try {
      await axios.delete(`/api/phc/surveys/types/${id}`);
      loadTypes();
    } catch (err) {
      console.error("Delete type error:", err);
      alert("Failed to delete survey type");
    }
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-xl">
          <h1 className="text-2xl font-bold mb-4">Survey Types</h1>

          {/* ADD NEW TYPE */}
          <div className="flex gap-3 mb-6">
            <input
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="New type name"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addType}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          {/* LIST TYPES */}
          <div className="bg-white p-4 rounded shadow">
            {types.length === 0 ? (
              <p className="text-gray-500">No types available</p>
            ) : (
              <ul className="space-y-2">
                {types.map((t) => (
                  <li
                    key={t.id}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <span>{t.name}</span>

                    <button
                      onClick={() => removeType(t.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
