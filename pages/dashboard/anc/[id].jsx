import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";

export default function ANCDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [newVisit, setNewVisit] = useState({
    date: "",
    bp: "",
    hb: "",
    weight: "",
    fetalMovement: "",
    symptoms: "",
    notes: "",
    asha: "",
  });

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get(`/api/anc/detail?id=${id}`);
        setData(res.data);
      } catch (e) {
        console.error("ANC detail error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const addVisit = (e) => {
    e.preventDefault();

    const visit = {
      id: Date.now(),
      ...newVisit,
    };

    setData((prev) => ({
      ...prev,
      visits: [visit, ...prev.visits],
    }));

    setShowAdd(false);
    setNewVisit({
      date: "",
      bp: "",
      hb: "",
      weight: "",
      fetalMovement: "",
      symptoms: "",
      notes: "",
      asha: "",
    });
  };

  const markHighRisk = () => {
    if (!confirm("Mark mother as HIGH-RISK?")) return;

    setData((prev) => ({
      ...prev,
      riskFlags: [
        ...prev.riskFlags,
        {
          severity: "high",
          label: "Marked High-Risk by ANM",
          note: "Needs follow-up",
        },
      ],
    }));
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex flex-col flex-1 overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20">
            Loading ANC details…
          </main>
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
          <main className="flex-1 overflow-y-auto p-6 pt-20 text-red-500">
            Record not found.
          </main>
        </div>
      </div>
    );
  }

  const { mother, visits, riskFlags } = data;

  /* ---------- MAIN LAYOUT ---------- */
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 overflow-hidden pl-64">
        <Navbar />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 pt-20 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">ANC — {mother.name}</h1>
              <p className="text-sm text-gray-600">
                LMP: {mother.lmp} • EDD: {mother.edd} • Trimester: {mother.trimester}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="bg-blue-600 text-white px-3 py-2 rounded"
                onClick={() => setShowAdd(true)}
              >
                + Add ANC Visit
              </button>

              <button
                className="bg-red-600 text-white px-3 py-2 rounded"
                onClick={markHighRisk}
              >
                Mark High-Risk
              </button>
            </div>
          </div>

          {/* MOTHER INFO */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Mother Details</h2>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Name:</span> {mother.name}</div>
              <div><span className="text-gray-500">Phone:</span> {mother.phone}</div>
              <div><span className="text-gray-500">Address:</span> {mother.address}</div>
              <div><span className="text-gray-500">Gravida:</span> {mother.gravida}</div>
              <div><span className="text-gray-500">Parity:</span> {mother.parity}</div>
            </div>

            {riskFlags.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-red-600">Risk Flags</h3>
                <div className="mt-2 space-y-2">
                  {riskFlags.map((r, i) => (
                    <div
                      key={i}
                      className="bg-red-50 border-l-4 border-red-300 p-2 rounded"
                    >
                      <div className="text-sm font-medium">{r.label}</div>
                      <div className="text-xs text-gray-500">{r.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* VISITS */}
          <section className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">ANC Visit History</h2>
              <span className="text-sm text-gray-500">{visits.length} visits</span>
            </div>

            <div className="mt-4 space-y-3">
              {visits.map((v) => (
                <div key={v.id} className="border p-3 rounded hover:shadow-sm">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{v.date}</div>
                      <div className="text-xs text-gray-500">By ASHA: {v.asha}</div>
                    </div>
                    <div className="text-xs text-gray-600">
                      BP: {v.bp} • HB: {v.hb} • Wt: {v.weight}
                    </div>
                  </div>

                  <div className="mt-1 text-sm">
                    <div>Fetal movement: {v.fetalMovement}</div>
                    <div>Symptoms: {v.symptoms}</div>
                    <div className="text-gray-700 mt-1">{v.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ADD VISIT FORM */}
          {showAdd && (
            <section className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-3">Add New ANC Visit</h2>

              <form
                onSubmit={addVisit}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  type="date"
                  value={newVisit.date}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, date: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Blood Pressure (e.g. 120/80)"
                  value={newVisit.bp}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, bp: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="HB level (e.g. 10.5)"
                  value={newVisit.hb}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, hb: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Weight"
                  value={newVisit.weight}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, weight: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                />

                <input
                  type="text"
                  placeholder="Fetal movement"
                  value={newVisit.fetalMovement}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, fetalMovement: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                />

                <input
                  type="text"
                  placeholder="Symptoms"
                  value={newVisit.symptoms}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, symptoms: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                />

                <textarea
                  placeholder="Notes"
                  value={newVisit.notes}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, notes: e.target.value })
                  }
                  className="border px-3 py-2 rounded md:col-span-2"
                />

                <input
                  type="text"
                  placeholder="ASHA worker name"
                  value={newVisit.asha}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, asha: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                  required
                />

                <div className="flex gap-2 md:col-span-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-3 py-2 border rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-3 py-2 bg-green-600 text-white rounded"
                  >
                    Save Visit
                  </button>
                </div>
              </form>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
