import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import Link from "next/link";

export default function FamiliesList() {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);   // filtered results
  const [search, setSearch] = useState("");       // search text
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  // Filter whenever search or list changes
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(list);
      return;
    }

    const s = search.toLowerCase();

    const result = list.filter((f) => {
      return (
        f.head_name?.toLowerCase().includes(s) ||
        f.address?.toLowerCase().includes(s) ||
        f.address_line?.toLowerCase().includes(s) ||
        f.landmark?.toLowerCase().includes(s)
      );
    });

    setFiltered(result);
  }, [search, list]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Please login to view families");
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/phc/families", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data || [];
      setList(data);
      setFiltered(data);
    } catch (err) {
      console.error("Families load error:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to load families";
      setError(errorMessage);
      setList([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60 bg-gray-50">
        <Navbar />

        {/* CENTERED CONTENT WRAPPER */}
        <div className="p-6 mt-16 max-w-3xl mx-auto">
          {/* SEARCH BAR */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search families by name, address, landmark..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border rounded shadow-sm bg-white"
            />
          </div>

          {loading ? (
            <div className="text-gray-500 text-center">Loading families…</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error loading families</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-500 text-center">
              No matching families found
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((f) => (
                <div
                  key={f.id}
                  className="bg-white p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {f.head_name && (
                        <span className="mr-1">{f.head_name} —</span>
                      )}
                      {f.address_line || f.address || "No address"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {f.landmark && <span>Landmark: {f.landmark}</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Link
                      href={`/phc/families/${f.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
