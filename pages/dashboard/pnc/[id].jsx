// pages/dashboard/pnc/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";

export default function PNCDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [newVisit, setNewVisit] = useState({
    date: "",
    type: "Follow-up",
    asha: "",
    vitals: "",
    notes: "",
  });

  // LOAD DATA
  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/pnc/detail?id=${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch PNC detail", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ADD VISIT
  const handleAddVisit = (e) => {
    e.preventDefault();

    const visit = {
      id: Date.now(),
      date: newVisit.date,
      type: newVisit.type,
      asha: newVisit.asha,
      vitals: { raw: newVisit.vitals },
      notes: newVisit.notes,
    };

    setData((prev) => ({
      ...prev,
      visits: [visit, ...prev.visits],
    }));

    setShowAdd(false);
    setNewVisit({
      date: "",
      type: "Follow-up",
      asha: "",
      vitals: "",
      notes: "",
    });
  };

  // MARK HIGH RISK
  const markHighRisk = () => {
    if (!confirm("Mark mother as HIGH-RISK?")) return;

    setData((prev) => ({
      ...prev,
      riskFlags: [
        ...prev.riskFlags,
        {
          label: "Marked High-Risk",
          severity: "high",
          note: "Marked manually by ANM",
        },
      ],
    }));
  };

  /* ------------------ LOADING ------------------ */
  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex flex-col flex-1 overflow-hidden pl-64">
          <Navbar />
          <main className="p-6 pt-20 flex-1 overflow-y-auto">Loading PNC detail…</main>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex flex-col flex-1 overflow-hidden pl-64">
          <Navbar />
          <main className="p-6 pt-20 flex-1 overflow-y-auto text-red-600">
            PNC record not found.
          </main>
        </div>
      </div>
    );
  }

  const { mother, baby, visits, riskFlags } = data;

  /* ------------------ MAIN LAYOUT ------------------ */
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      {/* MAIN REGION */}
      <div className="flex flex-col flex-1 overflow-hidden pl-64">
        <Navbar />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 pt-20 space-y-6">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">PNC — {mother.name}</h1>
              <p className="text-sm text-gray-600">
                Delivery: {mother.deliveryDate} • Age: {mother.age}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdd(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded shadow"
              >
                + Add Visit
              </button>
              <button
                onClick={markHighRisk}
                className="bg-red-500 text-white px-3 py-2 rounded shadow"
              >
                Mark High-Risk
              </button>
            </div>
          </div>

          {/* TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* MOTHER CARD */}
            <div className="col-span-2 bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Mother Details</h3>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Name:</span> {mother.name}</div>
                <div><span className="text-gray-500">Phone:</span> {mother.phone}</div>
                <div><span className="text-gray-500">Address:</span> {mother.address}</div>
                <div><span className="text-gray-500">Gravida/Parity:</span> {mother.gravida} / {mother.parity}</div>
                <div><span className="text-gray-500">Delivery Date:</span> {mother.deliveryDate}</div>
              </div>

              {riskFlags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-600">Risk Alerts</h4>
                  <div className="mt-2 space-y-2">
                    {riskFlags.map((r, i) => (
                      <div key={i} className="p-2 bg-red-50 border-l-4 border-red-300 rounded">
                        <div className="text-sm font-medium">
                          {r.label} <span className="text-xs text-gray-400">({r.severity})</span>
                        </div>
                        <div className="text-xs text-gray-500">{r.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BABY CARD */}
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Baby Details</h3>
              <div className="text-sm space-y-1">
                <div><span className="text-gray-500">DOB:</span> {baby.dob}</div>
                <div><span className="text-gray-500">Weight:</span> {baby.weightKg} kg</div>
                <div><span className="text-gray-500">Breastfeeding:</span> {baby.breastfeeding}</div>
                <div><span className="text-gray-500">MUAC:</span> {baby.muac} cm</div>

                <div className="mt-2">
                  <div className="text-gray-500 text-sm">Immunization</div>
                  <ul className="mt-1 space-y-1 text-sm">
                    {baby.immunization.map((v, i) => (
                      <li key={i}>{v.vaccine} — <span className="text-gray-500 text-xs">{v.date}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* VISITS LIST */}
          <section className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">PNC Visit History</h3>
              <span className="text-sm text-gray-500">{visits.length} visits</span>
            </div>

            <div className="mt-4 space-y-3">
              {visits.map((v) => (
                <div key={v.id} className="p-3 border rounded hover:shadow-sm">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{v.type} — {v.date}</div>
                      <div className="text-xs text-gray-500">Visited by: {v.asha}</div>
                    </div>

                    <div className="text-xs text-gray-500">
                      {v.vitals?.raw || "—"}
                    </div>
                  </div>
                  <div className="mt-2 text-sm">{v.notes}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ADD VISIT FORM */}
          {showAdd && (
            <section className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-3">Add New Visit</h3>
              <form onSubmit={handleAddVisit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                <input
                  type="date"
                  value={newVisit.date}
                  onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })}
                  className="border px-3 py-2 rounded"
                  required
                />

                <select
                  value={newVisit.type}
                  onChange={(e) => setNewVisit({ ...newVisit, type: e.target.value })}
                  className="border px-3 py-2 rounded"
                >
                  <option>Follow-up</option>
                  <option>PNC Day 1</option>
                  <option>PNC Day 7</option>
                </select>

                <input
                  type="text"
                  placeholder="ASHA worker"
                  value={newVisit.asha}
                  onChange={(e) => setNewVisit({ ...newVisit, asha: e.target.value })}
                  className="border px-3 py-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Vitals"
                  value={newVisit.vitals}
                  onChange={(e) => setNewVisit({ ...newVisit, vitals: e.target.value })}
                  className="border px-3 py-2 rounded md:col-span-2"
                />

                <textarea
                  placeholder="Notes"
                  value={newVisit.notes}
                  onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
                  className="border px-3 py-2 rounded md:col-span-3"
                />

                <div className="flex gap-2 justify-end md:col-span-3">
                  <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-3 py-2 bg-green-600 text-white rounded">Save Visit</button>
                </div>

              </form>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
