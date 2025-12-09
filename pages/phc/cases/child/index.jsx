import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

export default function ChildList() {
  const [list, setList] = useState([]);
  const [areas, setAreas] = useState([]);
  const [anms, setAnms] = useState([]);
  const [ashas, setAshas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    anm_id: "",
    asha_id: "",
    area_id: "",
    risk_level: "",
    q: ""
  });

  useEffect(() => {
    loadLookups();
    load();
  }, []);

  async function loadLookups() {
    try {
      const [A, B, C] = await Promise.all([
        axios.get("/api/phc/areas"),
        axios.get("/api/phc/workforce/anm-list"),
        axios.get("/api/phc/workforce/asha-list")
      ]);
      setAreas(A.data || []);
      setAnms(B.data || []);
      setAshas(C.data || []);
    } catch (e) {}
  }

  async function load() {
    setLoading(true);
    try {
      const res = await axios.get("/api/phc/cases", {
        params: { category: "CHILD", ...filters }
      });
      setList(res.data);
    } catch (e) {
      setList([]);
    }
    setLoading(false);
  }

  function h(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16">

          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Child Immunization</h1>
            <div>
              <Link href="/phc/cases/child/new" className="px-3 py-2 bg-blue-600 text-white rounded">+ New Case</Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded shadow mb-5">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <input name="q" value={filters.q} onChange={h} placeholder="Search..." className="p-2 border rounded md:col-span-2" />

              <select name="anm_id" value={filters.anm_id} onChange={h} className="p-2 border rounded">
                <option value="">All ANMs</option>
                {anms.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>

              <select name="asha_id" value={filters.asha_id} onChange={h} className="p-2 border rounded">
                <option value="">All ASHAs</option>
                {ashas.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>

              <select name="area_id" value={filters.area_id} onChange={h} className="p-2 border rounded">
                <option value="">All Areas</option>
                {areas.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>

              <select name="risk_level" value={filters.risk_level} onChange={h} className="p-2 border rounded">
                <option value="">All Risk</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={load} className="px-3 py-2 bg-blue-600 text-white rounded">Apply</button>
              <button onClick={() => setFilters({ anm_id:"", asha_id:"", area_id:"", risk_level:"", q:"" })} className="px-3 py-2 border rounded">Clear</button>
            </div>
          </div>

          {/* List */}
          {loading ? <div>Loading…</div> :
            list.length === 0 ?
              <div>No cases found</div> :
              <div className="space-y-3">
                {list.map(r => (
                  <div key={r.id} className="bg-white p-4 rounded shadow flex justify-between">
                    <div>
                      <div className="font-medium">{r.patient_name}</div>
                      <div className="text-sm text-gray-500">Risk: {r.risk_level}</div>
                    </div>
                    <Link href={`/phc/cases/child/${r.id}`} className="text-blue-600">View</Link>
                  </div>
                ))}
              </div>
          }

        </main>
      </div>
    </div>
  );
}
