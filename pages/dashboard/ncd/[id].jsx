import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";

export default function NCDDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [person, setPerson] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [newLog, setNewLog] = useState({
    date: "",
    bp: "",
    sugar: "",
    remarks: "",
  });

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get("/api/ncd/list");
        const p = res.data.find((x) => x.id == id);

        if (p) {
          setPerson(p);
          setLogs([
            {
              date: "2024-01-05",
              bp: p.bp,
              sugar: p.sugar,
              remarks: "Initial screening",
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

  const addRecord = (e) => {
    e.preventDefault();
    setLogs([{ ...newLog }, ...logs]);
    setNewLog({ date: "", bp: "", sugar: "", remarks: "" });
    setShowAdd(false);
  };

  const markHighRisk = () => {
    if (!confirm("Mark this patient as high-risk?")) return;

    setPerson((prev) => ({
      ...prev,
      status: "high-risk",
    }));
  };

  /* ---------------- LOADING ---------------- */
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

  /* ---------------- NOT FOUND ---------------- */
  if (!person)
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex-1 flex flex-col overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20 text-red-500">
            Record not found
          </main>
        </div>
      </div>
    );

  /* ---------------- MAIN PAGE ---------------- */
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      {/* RIGHT SIDE MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden pl-64">
        <Navbar />

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 pt-20 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{person.name}</h1>
              <p className="text-sm text-gray-600">
                Age: {person.age} • Status: {person.status}
              </p>
            </div>

            <div className="flex gap-3">
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
                + Add Reading
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Latest Screening</h2>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div><span className="text-gray-500">BP:</span> {person.bp}</div>
              <div><span className="text-gray-500">Sugar:</span> {person.sugar}</div>
            </div>
          </section>

          {/* HISTORY */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">
              Recording History{" "}
              <span className="text-sm text-gray-500">({logs.length})</span>
            </h2>

            <div className="mt-3 space-y-3">
              {logs.map((l, i) => (
                <div key={i} className="border p-3 rounded">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{l.date}</div>
                    <div className="text-sm text-gray-500">
                      BP: {l.bp} • Sugar: {l.sugar}
                    </div>
                  </div>
                  <div className="text-sm mt-1">{l.remarks}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ADD RECORD */}
          {showAdd && (
            <section className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-3">Add Reading</h2>

              <form onSubmit={addRecord} className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newLog.date}
                  onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="BP (e.g. 150/90)"
                  value={newLog.bp}
                  onChange={(e) => setNewLog({ ...newLog, bp: e.target.value })}
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Sugar (mg/dl)"
                  value={newLog.sugar}
                  onChange={(e) => setNewLog({ ...newLog, sugar: e.target.value })}
                  className="border p-2 rounded"
                  required
                />

                <textarea
                  placeholder="Remarks"
                  value={newLog.remarks}
                  onChange={(e) => setNewLog({ ...newLog, remarks: e.target.value })}
                  className="border p-2 rounded col-span-2"
                />

                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-3 py-2 border rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                  >
                    Save
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
