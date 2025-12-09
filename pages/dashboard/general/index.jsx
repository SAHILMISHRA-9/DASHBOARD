import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

export default function GeneralVisitList() {
  const [visits, setVisits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/general/list");
        setVisits(res.data);
        setFiltered(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let data = [...visits];

    if (search)
      data = data.filter((x) =>
        x.name.toLowerCase().includes(search.toLowerCase())
      );

    if (filter !== "all")
      data = data.filter((x) => x.category === filter);

    setFiltered(data);
  }, [search, filter, visits]);

  return (
    <div className="flex min-h-screen">
      <SidebarANM />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">General Health Visits</h1>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search name..."
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
              <option value="fever">Fever</option>
              <option value="viral">Viral / Seasonal</option>
              <option value="pain">Body Pain</option>
              <option value="skin">Skin Issue</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Complaint</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{v.name}</td>
                    <td className="p-3">{v.age}</td>
                    <td className="p-3">{v.complaint}</td>
                    <td className="p-3">{v.date}</td>
                    <td className="p-3 capitalize">{v.category}</td>

                    <td className="p-3">
                      <Link
                        className="text-blue-600 hover:underline"
                        href={`/dashboard/general/${v.id}`}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No visit records found.
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
