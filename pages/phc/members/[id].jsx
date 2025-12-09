// pages/phc/members/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import Link from "next/link";

export default function MemberDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!id) return; load(); }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await axios.get(`/api/phc/members/${id}`);
      setMember(res.data);
    } catch (err) {
      console.error("Member load error:", err);
      setMember(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!member) return <div className="p-6">Member not found</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">{member.name}</h1>
              <div className="text-sm text-gray-500">Age: {member.age} · {member.gender}</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/phc/families/${member.family?.id || ""}`} className="px-3 py-2 border rounded">Back to Family</Link>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-2">Assigned</h3>
            <div className="text-sm text-gray-600">Family: {member.family ? `#${member.family.id} — ${member.family.address || ""}` : "—"}</div>
            <div className="text-sm text-gray-600">ASHA: {member.family?.asha_id ? `ASHA #${member.family.asha_id}` : "—"}</div>
            <div className="text-sm text-gray-600">ANM: {member.family?.anm_id ? `ANM #${member.family.anm_id}` : "—"}</div>
          </div>

          <section className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Visits</h3>
            {(!member.visits || member.visits.length === 0) ? (
              <p className="text-gray-500">No visits.</p>
            ) : (
              <ul className="space-y-2">
                {member.visits.map(v => (
                  <li key={v.id} className="p-2 border rounded">
                    <div className="text-sm">{v.date} · {v.purpose}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Cases</h3>
            {(!member.cases || member.cases.length === 0) ? (
              <p className="text-gray-500">No cases.</p>
            ) : (
              <ul className="space-y-2">
                {member.cases.map(c => (
                  <li key={c.id} className="p-2 border rounded flex justify-between items-center">
                    <div>
                      <div className="font-medium">{c.category}</div>
                      <div className="text-xs text-gray-500">Risk: {c.risk_level}</div>
                    </div>
                    <div>
                      <Link href={`/phc/cases/${(c.category || "case").toLowerCase()}/${c.id}`} className="text-blue-600">Open Case</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
