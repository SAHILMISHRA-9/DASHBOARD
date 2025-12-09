// pages/phc/areas/index.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import Link from "next/link";

export default function AreasList() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await axios.get("/api/phc/areas");
      setAreas(res.data || []);
    } catch (err) {
      console.error(err);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Areas</h1>
            <Link href="/phc/areas/add" className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Area</Link>
          </div>

          {loading ? (
            <div>Loading areas...</div>
          ) : areas.length === 0 ? (
            <div className="text-gray-600">No areas found.</div>
          ) : (
            <div className="space-y-3">
              {areas.map(area => (
                <div key={area.id} className="bg-white p-4 rounded shadow">
                  <div className="font-semibold">
                    {area.area_name || area.name || "Untitled area"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
