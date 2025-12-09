// // pages/phc/families/[id].jsx
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";
// import SidebarPHC from "../../../components/layout/SidebarPHC";
// import Navbar from "../../../components/layout/Navbar";
// import Link from "next/link";

// export default function FamilyDetail() {
//   const router = useRouter();
//   const { id } = router.query;

//   const [familyData, setFamilyData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!id) return;
//     load();
//   }, [id]);

//   async function load() {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("auth_token");
//       if (!token) {
//         setError("Please login to view family details");
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(`/api/phc/families/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       // Backend returns { family, members, health_records }
//       const data = res.data;
      
//       // Transform health_records into visits and cases
//       const visits = (data.health_records || []).map(record => ({
//         id: record.id,
//         date: record.created_at ? new Date(record.created_at).toISOString().split('T')[0] : 'N/A',
//         purpose: record.visit_type || 'General visit',
//         description: record.data_json ? JSON.stringify(record.data_json) : ''
//       }));

//       // Group health_records by visit_type as cases
//       const casesMap = {};
//       (data.health_records || []).forEach(record => {
//         const visitType = record.visit_type || 'general';
//         if (!casesMap[visitType]) {
//           casesMap[visitType] = {
//             id: visitType,
//             category: visitType.toUpperCase(),
//             risk_level: record.data_json?.risk_level || record.data_json?.risk || 'normal',
//             records: []
//           };
//         }
//         casesMap[visitType].records.push(record);
//       });
//       const cases = Object.values(casesMap);

//       setFamilyData({
//         ...data.family,
//         members: data.members || [],
//         visits: visits,
//         cases: cases,
//         health_records: data.health_records || []
//       });
//     } catch (err) {
//       console.error("Family load error:", err);
//       const errorMessage = err.response?.data?.error || err.message || "Failed to load family details";
//       setError(errorMessage);
//       setFamilyData(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-screen">
//         <SidebarPHC />
//         <div className="flex-1 ml-60">
//           <Navbar />
//           <main className="p-6 mt-16">
//             <div className="text-gray-500">Loading family details…</div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   if (error || !familyData) {
//     return (
//       <div className="flex min-h-screen">
//         <SidebarPHC />
//         <div className="flex-1 ml-60">
//           <Navbar />
//           <main className="p-6 mt-16">
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               <p className="font-medium">Error loading family</p>
//               <p className="text-sm mt-1">{error || "Family not found"}</p>
//             </div>
//             <Link href="/phc/families" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">
//               Back to Families
//             </Link>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   const fam = familyData;

//   return (
//     <div className="flex min-h-screen">
//       <SidebarPHC />
//       <div className="flex-1 ml-60">
//         <Navbar />

//         <main className="p-6 mt-16 max-w-4xl">
//           <div className="flex justify-between items-center mb-4">
//             <div>
//               <h1 className="text-2xl font-bold">Family #{fam.id}</h1>
//               <div className="text-sm text-gray-600">
//                 {fam.address_line || fam.address || 'No address'}
//                 {fam.landmark && ` · ${fam.landmark}`}
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Link href="/phc/families" className="px-3 py-2 border rounded hover:bg-gray-50">Back</Link>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="bg-white p-4 rounded shadow">
//               <div className="text-sm text-gray-500">ASHA</div>
//               <div className="font-medium">
//                 {fam.asha_worker_id ? `ASHA #${fam.asha_worker_id}` : "—"}
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded shadow">
//               <div className="text-sm text-gray-500">ANM</div>
//               <div className="font-medium">
//                 {fam.anm_worker_id ? `ANM #${fam.anm_worker_id}` : "—"}
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded shadow">
//               <div className="text-sm text-gray-500">Area ID</div>
//               <div className="font-medium">{fam.area_id || "—"}</div>
//             </div>
//           </div>

//           <section className="bg-white p-4 rounded shadow mb-6">
//             <h3 className="font-semibold mb-3">Members</h3>
//             {(!fam.members || fam.members.length === 0) ? (
//               <p className="text-gray-500">No members.</p>
//             ) : (
//               <div className="space-y-2">
//                 {fam.members.map(m => (
//                   <div key={m.id} className="p-3 border rounded flex justify-between items-center hover:bg-gray-50">
//                     <div>
//                       <div className="font-medium">{m.name || 'Unnamed'}</div>
//                       <div className="text-xs text-gray-500">
//                         {m.age ? `${m.age} yrs` : 'Age not specified'} · {m.gender || 'Not specified'}
//                         {m.relation && ` · ${m.relation}`}
//                       </div>
//                     </div>

//                     <div className="flex gap-2 items-center">
//                       <Link href={`/phc/members/${m.id}`} className="text-blue-600 hover:underline">View</Link>
//                       <button 
//                         onClick={() => router.push(`/phc/members/${m.id}`)} 
//                         className="px-2 py-1 border rounded text-sm hover:bg-blue-50"
//                       >
//                         Open
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>

//           <section className="bg-white p-4 rounded shadow mb-6">
//             <h3 className="font-semibold mb-3">Visits</h3>
//             {(!fam.visits || fam.visits.length === 0) ? (
//               <p className="text-gray-500">No visits recorded.</p>
//             ) : (
//               <ul className="space-y-2">
//                 {fam.visits.map((v, idx) => (
//                   <li key={v.id || idx} className="p-2 border rounded">
//                     <div className="text-sm">
//                       <span className="font-medium">{v.date}</span>
//                       {v.purpose && <span> — {v.purpose}</span>}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </section>

//           <section className="bg-white p-4 rounded shadow">
//             <h3 className="font-semibold mb-3">Cases</h3>
//             {(!fam.cases || fam.cases.length === 0) ? (
//               <p className="text-gray-500">No cases.</p>
//             ) : (
//               <ul className="space-y-2">
//                 {fam.cases.map(c => (
//                   <li key={c.id} className="p-3 border rounded flex justify-between items-center hover:bg-gray-50">
//                     <div>
//                       <div className="font-medium">{c.category}</div>
//                       <div className="text-xs text-gray-500">
//                         Risk: <span className={c.risk_level === 'high' ? 'text-red-600 font-medium' : ''}>
//                           {c.risk_level || 'normal'}
//                         </span>
//                       </div>
//                     </div>

//                     <div>
//                       <Link 
//                         href={`/phc/cases/${(c.category || "case").toLowerCase()}/${c.id}`} 
//                         className="text-blue-600 hover:underline"
//                       >
//                         Open Case
//                       </Link>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </section>

//         </main>
//       </div>
//     </div>
//   );
// }



// pages/phc/families/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../components/layout/SidebarPHC";
import Navbar from "../../../components/layout/Navbar";
import Link from "next/link";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function FamilyDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Please login to view family details");
        setLoading(false);
        return;
      }

      // 👇 NEW: hit full-family backend route
      const res = await axios.get(`${BASE_URL}/families/${id}/full`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Expected shape: { family, members, health_records }
      const data = res.data || {};

      // Visits derived from health_records
      const visits = (data.health_records || []).map((record) => ({
        id: record.id,
        date: record.created_at
          ? new Date(record.created_at).toISOString().split("T")[0]
          : "N/A",
        purpose: record.visit_type || "General visit",
        description: record.data_json ? JSON.stringify(record.data_json) : "",
      }));

      // Cases grouped by visit_type
      const casesMap = {};
      (data.health_records || []).forEach((record) => {
        const visitType = record.visit_type || "general";
        if (!casesMap[visitType]) {
          casesMap[visitType] = {
            id: visitType,
            category: visitType.toUpperCase(),
            risk_level:
              record.data_json?.risk_level ||
              record.data_json?.risk ||
              "normal",
            records: [],
          };
        }
        casesMap[visitType].records.push(record);
      });
      const cases = Object.values(casesMap);

      setFamilyData({
        ...data.family,
        members: data.members || [],
        visits,
        cases,
        health_records: data.health_records || [],
      });
    } catch (err) {
      console.error("Family load error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to load family details";
      setError(errorMessage);
      setFamilyData(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <SidebarPHC />
        <div className="flex-1 ml-60">
          <Navbar />
          <main className="p-6 mt-16">
            <div className="text-gray-500">Loading family details…</div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !familyData) {
    return (
      <div className="flex min-h-screen">
        <SidebarPHC />
        <div className="flex-1 ml-60">
          <Navbar />
          <main className="p-6 mt-16">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error loading family</p>
              <p className="text-sm mt-1">{error || "Family not found"}</p>
            </div>
            <Link
              href="/phc/families"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
            >
              Back to Families
            </Link>
          </main>
        </div>
      </div>
    );
  }

  const fam = familyData;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">Family #{fam.id}</h1>
              <div className="text-sm text-gray-600">
                {fam.address_line || fam.address || "No address"}
                {fam.landmark && ` · ${fam.landmark}`}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/phc/families"
                className="px-3 py-2 border rounded hover:bg-gray-50"
              >
                Back
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">ASHA</div>
              <div className="font-medium">
                {fam.asha_worker_id ? `ASHA #${fam.asha_worker_id}` : "—"}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">ANM</div>
              <div className="font-medium">
                {fam.anm_worker_id ? `ANM #${fam.anm_worker_id}` : "—"}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Area ID</div>
              <div className="font-medium">{fam.area_id || "—"}</div>
            </div>
          </div>

          <section className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Members</h3>
            {!fam.members || fam.members.length === 0 ? (
              <p className="text-gray-500">No members.</p>
            ) : (
              <div className="space-y-2">
                {fam.members.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 border rounded flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{m.name || "Unnamed"}</div>
                      <div className="text-xs text-gray-500">
                        {m.age ? `${m.age} yrs` : "Age not specified"} ·{" "}
                        {m.gender || "Not specified"}
                        {m.relation && ` · ${m.relation}`}
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/phc/members/${m.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => router.push(`/phc/members/${m.id}`)}
                        className="px-2 py-1 border rounded text-sm hover:bg-blue-50"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Visits</h3>
            {!fam.visits || fam.visits.length === 0 ? (
              <p className="text-gray-500">No visits recorded.</p>
            ) : (
              <ul className="space-y-2">
                {fam.visits.map((v, idx) => (
                  <li key={v.id || idx} className="p-2 border rounded">
                    <div className="text-sm">
                      <span className="font-medium">{v.date}</span>
                      {v.purpose && <span> — {v.purpose}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Cases</h3>
            {!fam.cases || fam.cases.length === 0 ? (
              <p className="text-gray-500">No cases.</p>
            ) : (
              <ul className="space-y-2">
                {fam.cases.map((c) => (
                  <li
                    key={c.id}
                    className="p-3 border rounded flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{c.category}</div>
                      <div className="text-xs text-gray-500">
                        Risk:{" "}
                        <span
                          className={
                            c.risk_level === "high"
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {c.risk_level || "normal"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Link
                        href={`/phc/cases/${(c.category || "case")
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${c.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Open Case
                      </Link>
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
