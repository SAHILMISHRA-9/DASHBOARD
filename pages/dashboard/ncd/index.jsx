import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

export default function NCDList() {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/ncd/list");
        setList(res.data);
        setFiltered(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let data = [...list];

    if (search)
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );

    if (filter !== "all") data = data.filter((p) => p.status === filter);

    setFiltered(data);
  }, [search, filter, list]);

  return (
    <div className="flex min-h-screen">
      <SidebarANM />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">NCD Screening (BP & Sugar)</h1>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search person..."
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
              <option value="bp-high">High BP</option>
              <option value="sugar-high">High Sugar</option>
              <option value="high-risk">High-Risk</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">BP</th>
                  <th className="p-3">Sugar</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.age}</td>
                    <td className="p-3">{p.bp}</td>
                    <td className="p-3">{p.sugar}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          p.status === "bp-high"
                            ? "bg-yellow-100 text-yellow-700"
                            : p.status === "sugar-high"
                            ? "bg-orange-100 text-orange-700"
                            : p.status === "high-risk"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <Link
                        href={`/dashboard/ncd/${p.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
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
