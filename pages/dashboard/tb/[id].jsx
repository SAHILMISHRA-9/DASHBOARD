import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";

export default function TBDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [record, setRecord] = useState(null);
  const [visits, setVisits] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newVisit, setNewVisit] = useState({
    date: "",
    weight: "",
    sputum: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get("/api/tb/list");
        const r = res.data.find((x) => x.id == id);

        if (r) {
          setRecord(r);

          setVisits([
            {
              date: "2024-01-05",
              weight: "52kg",
              sputum: "Positive",
              remarks: "Sent for X-ray",
            },
            {
              date: "2024-01-20",
              weight: "51kg",
              sputum: "Negative",
              remarks: "Improving",
            },
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const addVisit = (e) => {
    e.preventDefault();
    setVisits([{ ...newVisit }, ...visits]);
    setNewVisit({ date: "", weight: "", sputum: "", remarks: "" });
    setShowAdd(false);
  };

  const markConfirmed = () => {
    if (!confirm("Mark as confirmed TB?")) return;
    setRecord((prev) => ({ ...prev, status: "confirmed" }));
  };

  const markHighRisk = () => {
    if (!confirm("Mark as high-risk TB?")) return;
    setRecord((prev) => ({ ...prev, status: "high-risk" }));
  };

  /* ---------------------------------------------------
     LOADING + NOT FOUND
  --------------------------------------------------- */
  if (loading)
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex flex-col flex-1 overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20">Loading...</main>
        </div>
      </div>
    );

  if (!record)
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

  /* ---------------------------------------------------
     MAIN PAGE
  --------------------------------------------------- */
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      <div className="flex flex-col flex-1 overflow-hidden pl-64">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 pt-20 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{record.name}</h1>
              <p className="text-sm text-gray-600">
                Age: {record.age} • Status: {record.status}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={markConfirmed}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Mark Confirmed
              </button>
              <button
                onClick={markHighRisk}
                className="px-3 py-2 bg-red-600 text-white rounded"
              >
                Mark High-Risk
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                + Add TB Visit
              </button>
            </div>
          </div>

          {/* SYMPTOMS */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Symptoms</h2>
            <ul className="mt-2 text-sm space-y-1">
              {record.symptoms.map((s, i) => (
                <li key={i} className="text-gray-700">• {s}</li>
              ))}
            </ul>
          </section>

          {/* VISITS */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold flex justify-between">
              TB Follow-Up Visits <span>{visits.length} visits</span>
            </h2>

            <div className="mt-3 space-y-3">
              {visits.map((v, i) => (
                <div key={i} className="border p-3 rounded hover:shadow-sm">
                  <div className="flex justify-between">
                    <div className="font-medium">{v.date}</div>
                    <div className="text-sm text-gray-600">Sputum: {v.sputum}</div>
                  </div>
                  <div className="text-sm">Weight: {v.weight}</div>
                  <div className="text-sm text-gray-700 mt-1">{v.remarks}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ADD VISIT */}
          {showAdd && (
            <section className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-3">Add TB Visit</h2>

              <form onSubmit={addVisit} className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newVisit.date}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, date: e.target.value })
                  }
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Weight"
                  value={newVisit.weight}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, weight: e.target.value })
                  }
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Sputum result"
                  value={newVisit.sputum}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, sputum: e.target.value })
                  }
                  className="border p-2 rounded"
                  required
                />

                <textarea
                  placeholder="Remarks"
                  value={newVisit.remarks}
                  onChange={(e) =>
                    setNewVisit({ ...newVisit, remarks: e.target.value })
                  }
                  className="border p-2 rounded col-span-2"
                />

                <div className="flex gap-2 justify-end col-span-2">
                  <button
                    onClick={() => setShowAdd(false)}
                    type="button"
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
