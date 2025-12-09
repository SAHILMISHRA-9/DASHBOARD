// import { useEffect, useState } from "react";
// import axios from "axios";
// import SidebarPHC from "../../../../components/layout/SidebarPHC";
// import Navbar from "../../../../components/layout/Navbar";
// import Link from "next/link";

// export default function PNCList() {
//   const [list, setList] = useState([]);
//   const [areas, setAreas] = useState([]);
//   const [anms, setAnms] = useState([]);
//   const [ashas, setAshas] = useState([]);
//   const [filters, setFilters] = useState({ anm_id: "", asha_id: "", area_id: "", risk_level: "", q: "" });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadLookups();
//     load();
//   }, []);

//   async function loadLookups() {
//     try {
//       const [aRes, anRes, ashRes] = await Promise.all([
//         axios.get("/api/phc/areas"),
//         axios.get("/api/phc/workforce/anm-list"),
//         axios.get("/api/phc/workforce/asha-list"),
//       ]);
//       setAreas(aRes.data || []);
//       setAnms(anRes.data || []);
//       setAshas(ashRes.data || []);
//     } catch (err) { console.error(err); }
//   }

//   async function load() {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/phc/cases", { params: { category: "PNC", ...filters }});
//       setList(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setList([]);
//     } finally { setLoading(false); }
//   }

//   function handleChange(e) {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   }

//   return (
//     <div className="flex min-h-screen">
//       <SidebarPHC />
//       <div className="flex-1 ml-60">
//         <Navbar />
//         <main className="p-6 mt-16">

//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">PNC Cases</h1>
//             <div className="flex gap-2">
//               <Link href="/phc/cases/pnc/new" className="px-3 py-2 bg-blue-600 text-white rounded">+ New Case</Link>
//               <button onClick={load} className="px-3 py-2 border rounded">Refresh</button>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="bg-white p-4 rounded shadow mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//               <input name="q" value={filters.q} onChange={handleChange} placeholder="Search patient" className="p-2 border rounded md:col-span-2" />
              
//               <select name="anm_id" value={filters.anm_id} onChange={handleChange} className="p-2 border rounded">
//                 <option value="">All ANMs</option>
//                 {anms.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
//               </select>

//               <select name="asha_id" value={filters.asha_id} onChange={handleChange} className="p-2 border rounded">
//                 <option value="">All ASHAs</option>
//                 {ashas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
//               </select>

//               <select name="area_id" value={filters.area_id} onChange={handleChange} className="p-2 border rounded">
//                 <option value="">All Areas</option>
//                 {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
//               </select>

//               <select name="risk_level" value={filters.risk_level} onChange={handleChange} className="p-2 border rounded">
//                 <option value="">All Risk</option>
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>

//             <div className="flex gap-2 mt-3">
//               <button onClick={load} className="px-3 py-2 bg-blue-600 text-white rounded">Apply</button>
//               <button onClick={() => setFilters({ anm_id: "", asha_id: "", area_id: "", risk_level: "", q: "" })} className="px-3 py-2 border rounded">Clear</button>
//             </div>
//           </div>

//           {/* List */}
//           {loading ? <div>Loading...</div> : (
//             list.length === 0 ? <div className="text-gray-500">No cases found</div> : (
//               <div className="space-y-3">
//                 {list.map(r => (
//                   <div key={r.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
//                     <div>
//                       <div className="font-medium">{r.patient_name}</div>
//                       <div className="text-sm text-gray-500">Risk: {r.risk_level} · Status: {r.status}</div>
//                     </div>
//                     <Link href={`/phc/cases/pnc/${r.id}`} className="text-blue-600">View</Link>
//                   </div>
//                 ))}
//               </div>
//             )
//           )}

//         </main>
//       </div>
//     </div>
//   );
// }



// pages/phc/cases/pnc/index.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function PNCList() {
  const [list, setList] = useState([]);
  const [areas, setAreas] = useState([]);
  const [anms, setAnms] = useState([]);
  const [ashas, setAshas] = useState([]);
  const [filters, setFilters] = useState({
    anm_id: "",
    asha_id: "",
    area_id: "",
    risk_level: "",
    q: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLookups();
    load();
  }, []);

  function getAuthHeaders() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null;

    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // safe reader for hr.data_json (can be object or string)
  function getPncData(row) {
    const raw = row?.data_json;
    if (!raw) return {};
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    return raw;
  }

  // Load Areas / ANMs / ASHAs directly from backend
  async function loadLookups() {
    try {
      const headers = getAuthHeaders();

      const [aRes, anRes, ashRes] = await Promise.all([
        axios.get(`${BASE_URL}/phcs/areas/list`, { headers }),
        axios.get(`${BASE_URL}/phcAdmin/anms`, { headers }),
        axios.get(`${BASE_URL}/phcAdmin/ashas`, { headers }),
      ]);

      setAreas(aRes.data?.areas || aRes.data || []);
      setAnms(anRes.data || []);
      setAshas(ashRes.data || []);
    } catch (err) {
      console.error("PNC lookups load error:", err.response?.data || err.message);
    }
  }

  // Load ALL cases then keep only PNC on frontend
  async function load() {
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      const res = await axios.get(`${BASE_URL}/phcAdmin/cases`, {
        params: { ...filters }, // no category, same as ANC
        headers,
      });

      const all = res.data || [];

      // only PNC visit_type
      const onlyPNC = all.filter((r) =>
        (r.visit_type || "").toLowerCase().includes("pnc")
      );

      setList(onlyPNC);
    } catch (err) {
      console.error("PNC cases load error:", err.response?.data || err.message);
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function clearFilters() {
    setFilters({
      anm_id: "",
      asha_id: "",
      area_id: "",
      risk_level: "",
      q: "",
    });
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">PNC Cases</h1>
            <div className="flex gap-2">
              <Link
                href="/phc/cases/pnc/new"
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                + New Case
              </Link>
              <button onClick={load} className="px-3 py-2 border rounded">
                Refresh
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <input
                name="q"
                value={filters.q}
                onChange={handleChange}
                placeholder="Search patient"
                className="p-2 border rounded md:col-span-2"
              />

              <select
                name="anm_id"
                value={filters.anm_id}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">All ANMs</option>
                {anms.map((a) => (
                  <option key={a.anm_id || a.id} value={a.anm_id || a.id}>
                    {a.name}
                  </option>
                ))}
              </select>

              <select
                name="asha_id"
                value={filters.asha_id}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">All ASHAs</option>
                {ashas.map((a) => (
                  <option key={a.asha_id || a.id} value={a.asha_id || a.id}>
                    {a.name}
                  </option>
                ))}
              </select>

              <select
                name="area_id"
                value={filters.area_id}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">All Areas</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.area_name || a.name}
                  </option>
                ))}
              </select>

              <select
                name="risk_level"
                value={filters.risk_level}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">All Risk</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={load}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="px-3 py-2 border rounded"
              >
                Clear
              </button>
            </div>
          </div>

          {/* LIST */}
          {loading ? (
            <div>Loading...</div>
          ) : list.length === 0 ? (
            <div className="text-gray-500">No cases found</div>
          ) : (
            <div className="space-y-3">
              {list.map((r) => {
                const d = getPncData(r); // full PNC payload (if you want to use fields later)

                return (
                  <div
                    key={r.id}
                    className="bg-white p-4 rounded shadow flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">
                        {r.patient_name}{" "}
                        <span className="text-sm text-gray-500">
                          {r.age ? `(${r.age})` : ""}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Risk: {r.risk_level || d.risk_level || "—"} · Status:{" "}
                        {r.status}
                      </div>
                    </div>
                    <Link
                      href={`/phc/cases/pnc/${r.id}`}
                      className="text-blue-600"
                    >
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
