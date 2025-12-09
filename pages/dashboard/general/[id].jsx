import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";

export default function GeneralVisitDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [person, setPerson] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const [newFollow, setNewFollow] = useState({
    date: "",
    symptoms: "",
    medicine: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get("/api/general/list");
        const match = res.data.find((x) => x.id == id);

        if (match) {
          setPerson(match);

          setFollowups([
            {
              date: "2024-01-18",
              symptoms: "Fever reduced",
              medicine: "Paracetamol",
              notes: "Asked to increase fluid intake",
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

  const addFollowup = (e) => {
    e.preventDefault();
    setFollowups([{ ...newFollow }, ...followups]);
    setNewFollow({ date: "", symptoms: "", medicine: "", notes: "" });
    setShowAdd(false);
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
          <main className="flex-1 overflow-y-auto p-6 pt-20 text-red-600">
            Record not found
          </main>
        </div>
      </div>
    );

  /* ---------------- MAIN PAGE ---------------- */
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      {/* Right-side layout */}
      <div className="flex-1 flex flex-col overflow-hidden pl-64">
        <Navbar />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 pt-20 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{person.name}</h1>
              <p className="text-sm text-gray-600">
                {person.age} years • Complaint: {person.complaint}
              </p>
              <p className="text-sm text-gray-500">Visit Date: {person.date}</p>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              + Add Follow-Up
            </button>
          </div>

          {/* COMPLAINT CARD */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Initial Complaint</h2>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Category:</span> {person.category}
              </div>
              <div>
                <span className="text-gray-500">Primary Symptoms:</span>{" "}
                {person.complaint}
              </div>
            </div>
          </section>

          {/* FOLLOW-UP HISTORY */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">
              Follow-Up Visits{" "}
              <span className="text-sm text-gray-500">({followups.length})</span>
            </h2>

            <div className="mt-3 space-y-3">
              {followups.map((f, i) => (
                <div key={i} className="border p-3 rounded">
                  <div className="font-medium">{f.date}</div>
                  <div className="text-sm">Symptoms: {f.symptoms}</div>
                  <div className="text-sm">Medicine: {f.medicine}</div>
                  <div className="text-sm text-gray-700 mt-1">{f.notes}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ADD FOLLOW-UP FORM */}
          {showAdd && (
            <section className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-3">Add Follow-Up Visit</h2>

              <form onSubmit={addFollowup} className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newFollow.date}
                  onChange={(e) => setNewFollow({ ...newFollow, date: e.target.value })}
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Symptoms"
                  value={newFollow.symptoms}
                  onChange={(e) =>
                    setNewFollow({ ...newFollow, symptoms: e.target.value })
                  }
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Medicine given"
                  value={newFollow.medicine}
                  onChange={(e) =>
                    setNewFollow({ ...newFollow, medicine: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <textarea
                  placeholder="Notes"
                  value={newFollow.notes}
                  onChange={(e) =>
                    setNewFollow({ ...newFollow, notes: e.target.value })
                  }
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
                    className="px-3 py-2 bg-green-600 text-white rounded"
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
