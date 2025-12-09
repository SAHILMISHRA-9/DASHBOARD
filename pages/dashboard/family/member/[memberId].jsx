import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SidebarANM from "../../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../../components/layout/Navbar";
import axios from "axios";

export default function MemberDetail() {
  const router = useRouter();
  const { memberId } = router.query;

  const [member, setMember] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;

    async function load() {
      try {
        const res = await axios.get("/api/family/list");

        // Find member in all families
        let found = null;
        for (const f of res.data) {
          const m = f.members.find((x) => x.id == memberId);
          if (m) found = m;
        }

        setMember(found);

        // Mock activity timeline
        setTimeline([
          { date: "2024-01-10", type: "ANC Visit", note: "BP checked, normal" },
          { date: "2024-01-20", type: "General Visit", note: "Fever treated" },
          { date: "2024-01-25", type: "NCD Screening", note: "BP high" },
        ]);
      } catch (e) {
        console.error("Member detail error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [memberId]);

  /* ---------------------------- LOADING ---------------------------- */
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

  /* ---------------------------- NOT FOUND ---------------------------- */
  if (!member)
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex-1 flex flex-col overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20 text-red-600">
            Member not found.
          </main>
        </div>
      </div>
    );

  /* ---------------------------- MAIN UI ---------------------------- */
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      <div className="flex-1 flex flex-col overflow-hidden pl-64">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 pt-20 space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold">{member.name}</h1>
            <p className="text-gray-600">
              {member.age} years • {member.gender}
            </p>
          </div>

          {/* TIMELINE */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Health Timeline</h2>

            <div className="space-y-3">
              {timeline.map((t, i) => (
                <div key={i} className="border p-3 rounded">
                  <p className="font-medium">{t.date}</p>
                  <p className="text-sm text-blue-600">{t.type}</p>
                  <p className="text-sm text-gray-700 mt-1">{t.note}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
