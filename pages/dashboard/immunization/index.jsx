import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

export default function ImmunizationList() {
  const [children, setChildren] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/immunization/list");
        setChildren(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let data = [...children];

    if (search)
      data = data.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );

    if (filter !== "all") data = data.filter((c) => c.status === filter);

    setFiltered(data);
  }, [search, filter, children]);

  return (
    <div className="flex min-h-screen">
      <SidebarANM />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">Child Immunization</h1>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search child..."
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
              <option value="due">Vaccine Due</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed Dose</option>
              <option value="high-risk">High-Risk</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-3">Child Name</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Mother</th>
                  <th className="p-3">Due Dose</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((child) => (
                  <tr key={child.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{child.name}</td>
                    <td className="p-3">{child.age}</td>
                    <td className="p-3">{child.mother}</td>
                    <td className="p-3">{child.dueDose || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          child.status === "due"
                            ? "bg-yellow-100 text-yellow-700"
                            : child.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : child.status === "missed"
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {child.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/immunization/${child.id}`}
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
