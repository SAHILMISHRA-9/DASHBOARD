import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

export default function FamilyDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get("/api/family/list");
        const f = res.data.find((x) => x.id == id);
        setFamily(f);
      } catch (e) {
        console.error("Family detail error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /* ---------------------- LOADING ---------------------- */
  if (loading)
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex-1 flex flex-col overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20">Loading…</main>
        </div>
      </div>
    );

  if (!family)
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex-1 flex flex-col overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20 text-red-600">
            Family not found.
          </main>
        </div>
      </div>
    );

  /* ---------------------- MAIN UI ---------------------- */
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      <div className="flex-1 flex flex-col overflow-hidden pl-64">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 pt-20 space-y-6">
          
          {/* HEADER */}
          <h1 className="text-2xl font-bold">{family.familyHead} (Family)</h1>
          <p className="text-gray-600 text-sm">Village: {family.village}</p>

          {/* MEMBERS LIST */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Family Members</h2>

            <div className="space-y-3">
              {family.members.map((m) => (
                <Link
                  key={m.id}
                  href={`/dashboard/family/member/${m.id}`}
                  className="block p-3 border rounded hover:bg-gray-50 transition"
                >
                  <p className="text-lg font-medium">{m.name}</p>
                  <p className="text-sm text-gray-600">
                    {m.age} years • {m.gender}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
