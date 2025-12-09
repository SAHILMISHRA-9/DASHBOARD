import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

export default function ANCList() {
  const [ancList, setAncList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/anc/list");
        setAncList(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to load ANC list", err);
      }
    }
    load();
  }, []);

  // Search + Filter logic
  useEffect(() => {
    let data = [...ancList];

    if (search.trim() !== "") {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== "all") {
      data = data.filter((item) => item.status === filter);
    }

    setFiltered(data);
  }, [search, filter, ancList]);

  return (
    <div className="flex min-h-screen">
      <SidebarANM />

      <div className="flex-1 ml-64">
        <Navbar />

        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">Pregnancy / ANC Records</h1>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-5">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded w-60"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="all">All</option>
              <option value="high-risk">High-Risk</option>
              <option value="normal">Normal</option>
              <option value="visit-due">Visit Due</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left text-sm">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">LMP</th>
                  <th className="p-3">Trimester</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3">{item.lmp}</td>
                    <td className="p-3">{item.trimester}</td>
                    <td className="p-3">{item.phone}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          item.status === "high-risk"
                            ? "bg-red-100 text-red-700"
                            : item.status === "visit-due"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <Link
                        href={`/dashboard/anc/${item.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
