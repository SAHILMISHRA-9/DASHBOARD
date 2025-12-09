import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

export default function FamilyList() {
  const [families, setFamilies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/family/list");
        setFamilies(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const filtered = families.filter((f) =>
    f.familyHead.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <SidebarANM />
      <div className="flex-1 ml-64">
        <Navbar />

        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">Family Records</h1>

          {/* Search */}
          <input
            type="text"
            placeholder="Search family head..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-72 mb-6"
          />

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((family) => (
              <Link
                key={family.id}
                href={`/dashboard/family/${family.id}`}
                className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition border"
              >
                <h2 className="text-xl font-semibold">
                  {family.familyHead} <span className="text-sm">(Head)</span>
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  Members: {family.members.length}
                </p>

                <p className="text-sm mt-1">Village: {family.village}</p>

                <div className="text-blue-600 mt-4 text-sm font-medium">
                  View Family →
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
