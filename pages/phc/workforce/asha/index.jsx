// // pages/phc/workforce/asha/index.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import SidebarPHC from "../../../../components/layout/SidebarPHC";
// import Navbar from "../../../../components/layout/Navbar";
// import Link from "next/link";

// export default function ASHAList() {
//   const [list, setList] = useState([]);
//   const [anms, setAnms] = useState([]);
//   const [areas, setAreas] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, []);

//   async function loadData() {
//     try {
//       const resAsha = await axios.get("/api/phc/workforce/asha-list");
//       setList(resAsha.data || []);

//       const resAnm = await axios.get("/api/phc/workforce/anm-list");
//       setAnms(resAnm.data || []);

//       const resAreas = await axios.get("/api/phc/workforce/summary");
//       setAreas(resAreas.data?.areas || []);
//     } catch (err) {
//       console.error("ASHA list load error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function getANMName(id) {
//     const anm = anms.find((a) => a.id == id);
//     return anm ? anm.name : "—";
//   }

//   function getAreaName(id) {
//     const area = areas.find((a) => a.id == id);
//     return area ? area.name : "—";
//   }

//   return (
//     <div className="flex min-h-screen">
//       <SidebarPHC />

//       <div className="flex-1 ml-60">
//         <Navbar />

//         <main className="p-6 mt-16">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">ASHA Workers</h1>

//             <Link
//               href="/phc/workforce/asha/add"
//               className="bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               + Add ASHA
//             </Link>
//           </div>

//           {loading ? (
//             <div>Loading ASHA workers…</div>
//           ) : list.length === 0 ? (
//             <div className="text-gray-600">No ASHA workers found.</div>
//           ) : (
//             <div className="space-y-3">
//               {list.map((a) => (
//                 <div
//                   key={a.id}
//                   className="bg-white p-4 rounded shadow flex justify-between items-center"
//                 >
//                   <div>
//                     <div className="font-semibold">{a.name}</div>
//                     <div className="text-sm text-gray-600">Phone: {a.phone}</div>
//                     <div className="text-sm text-gray-600">ANM: {getANMName(a.supervisor_id)}</div>
//                     <div className="text-sm text-gray-600">Area: {getAreaName(a.area_id)}</div>

//                     {/* ⭐ STATUS DISPLAY ADDED HERE */}
//                     <div className="text-sm mt-1">
//                       Status:{" "}
//                       {a.is_active ? (
//                         <span className="text-green-600 font-semibold">Active</span>
//                       ) : (
//                         <span className="text-red-600 font-semibold">Disabled</span>
//                       )}
//                     </div>
//                     {/* ⭐ END STATUS */}
//                   </div>

//                   <div className="flex gap-3">
//                     <Link
//                       href={`/phc/workforce/asha/${a.id}`}
//                       className="text-blue-600"
//                     >
//                       View
//                     </Link>

//                     <Link
//                       href={`/phc/workforce/asha/edit/${a.id}`}
//                       className="px-3 py-1 border rounded text-sm"
//                     >
//                       Edit
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }



// pages/phc/workforce/asha/index.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function AshaList() {
  const [ashas, setAshas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Please login as PHC Admin to view ASHA workers");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${BASE_URL}/phcAdmin/ashas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAshas(res.data || []);
    } catch (err) {
      console.error("ASHA list error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to load ASHA workers";
      setError(msg);
      setAshas([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60 bg-gray-50">
        <Navbar />

        <main className="p-6 mt-16 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">ASHA Workers</h1>

            <Link
              href="/phc/workforce/asha/add"
              className="bg-blue-600 text-white px-4 py-2 rounded shadow"
            >
              + Add ASHA
            </Link>
          </div>

          {loading ? (
            <div className="text-gray-500">Loading ASHA workers…</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error loading ASHA workers</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : ashas.length === 0 ? (
            <div className="text-gray-500">No ASHA workers found.</div>
          ) : (
            <div className="space-y-3">
              {ashas.map((a) => (
                <div
                  key={a.asha_id}
                  className="bg-white p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-sm text-gray-600">
                      Phone: {a.phone}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Areas:{" "}
                      {Array.isArray(a.areas) && a.areas.length > 0
                        ? a.areas.join(", ")
                        : "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Families: {a.total_families ?? 0} · Tasks:{" "}
                      {a.total_tasks ?? 0}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={
                        "text-xs px-2 py-1 rounded-full " +
                        (a.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700")
                      }
                    >
                      {a.status || "unknown"}
                    </span>

                    <Link
                      href={`/phc/workforce/asha/${a.asha_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
