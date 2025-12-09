// // pages/phc/dashboard.jsx
// import { useEffect, useState } from "react";
// import SidebarPHC from "../../components/layout/SidebarPHC.jsx";
// import Navbar from "../../components/layout/Navbar";
// import axios from "axios";
// import Link from "next/link";

// export default function PhcDashboard() {
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     async function load() {
//       try {
//         const res = await axios.get("/api/phc/summary");
//         if (!mounted) return;
//         setSummary(res.data);
//       } catch (e) {
//         console.error("PHC summary error:", e);
//         if (!mounted) return;
//         setError("Failed to load PHC summary");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }
//     load();
//     return () => { mounted = false; };
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen">
//         <SidebarPHC />
//         <div className="flex-1 ml-64">
//           <Navbar role="phc" />
//           <main className="p-6">Loading PHC Dashboard…</main>
//         </div>
//       </div>
//     );
//   }

//   if (error || !summary) {
//     return (
//       <div className="flex min-h-screen">
//         <SidebarPHC />
//         <div className="flex-1 ml-64">
//           <Navbar role="phc" />
//           <main className="p-6 text-red-600">{error || "No data"}</main>
//         </div>
//       </div>
//     );
//   }

//   const {
//     totalANM,
//     totalASHA,
//     totalFamilies,
//     totalMembers,
//     highRiskPregnancies,
//     highRiskChildren,
//     tbSuspects,
//     ncdHighRisk,
//     tasksInProgress,
//     surveysRunning,
//     ashaSync,
//     areaCoverage,
//     links
//   } = summary;

//   return (
//     <div className="flex min-h-screen">
//       <SidebarPHC />
//       <div className="flex-1 ml-64">
//         <Navbar role="phc" />

//         <main className="p-6 space-y-6">
//           <h1 className="text-3xl font-bold">PHC Dashboard</h1>
//           <p className="text-gray-600">Administrative overview of PHC operations and field workforce.</p>

//           {/* OVERVIEW GRID */}
//           <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
//             <StatCard label="ANM Workers" value={totalANM} />
//             <StatCard label="ASHA Workers" value={totalASHA} />
//             <StatCard label="Families" value={totalFamilies} />
//             <StatCard label="Members" value={totalMembers} />
//           </section>

//           <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//             <StatCard label="High-Risk Pregnancies" value={highRiskPregnancies} warning />
//             <StatCard label="High-Risk Children" value={highRiskChildren} warning />
//             <StatCard label="TB Suspects" value={tbSuspects} />
//             <StatCard label="NCD High-Risk" value={ncdHighRisk} />
//           </section>

//           <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
//             <StatCard label="Tasks in Progress" value={tasksInProgress} />
//             <StatCard label="Active Surveys" value={surveysRunning} />
//             <div className="bg-white p-4 rounded shadow">
//               <p className="text-sm text-gray-500">Quick Actions</p>
//               <div className="mt-2 flex flex-col gap-2">
//                 <Link href={links?.workforce || "/phc/workforce"} className="px-3 py-2 rounded bg-blue-50 hover:bg-blue-100">Workforce Management</Link>
//                 <Link href={links?.areas || "/phc/areas"} className="px-3 py-2 rounded bg-blue-50 hover:bg-blue-100">Area Management</Link>
//                 <Link href={links?.surveys || "/phc/surveys"} className="px-3 py-2 rounded bg-blue-50 hover:bg-blue-100">Surveys & Campaigns</Link>
//               </div>
//             </div>
//           </section>

//           {/* ASHA SYNC */}
//           <section className="bg-white p-4 rounded shadow mt-6">
//             <h2 className="font-semibold mb-3">Last ASHA Sync Status</h2>
//             {ashaSync && ashaSync.length > 0 ? (
//               ashaSync.map((a) => (
//                 <div key={a.id} className="border p-3 rounded mb-2">
//                   <p className="font-medium">{a.name}</p>
//                   <p className="text-sm text-gray-600">Last Sync: {a.lastSync}</p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-sm">No sync records available.</p>
//             )}
//           </section>

//           {/* AREA COVERAGE */}
//           <section className="bg-white p-4 rounded shadow mt-6">
//             <h2 className="font-semibold mb-3">Area Coverage Summary</h2>
//             <div className="space-y-3">
//               {areaCoverage && areaCoverage.length > 0 ? (
//                 areaCoverage.map((area) => (
//                   <div key={area.id} className="rounded border p-3">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <div className="font-medium">{area.name}</div>
//                         <div className="text-xs text-gray-500">Area ID: {area.id}</div>
//                       </div>
//                       <div className="w-1/3 text-right">
//                         <div className="text-sm font-semibold">{area.coverage}%</div>
//                       </div>
//                     </div>

//                     <div className="mt-2 bg-gray-100 w-full h-2 rounded">
//                       <div style={{ width: `${area.coverage}%` }} className="h-2 rounded bg-green-600"></div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-sm">No area data.</p>
//               )}
//             </div>
//           </section>

//         </main>
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value, warning }) {
//   return (
//     <div className="bg-white p-4 rounded shadow">
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className={`text-2xl font-bold ${warning ? "text-red-600" : ""}`}>{value ?? "--"}</p>
//     </div>
//   );
// }





// pages/phc/dashboard.jsx
import { useEffect, useState } from "react";
import SidebarPHC from "../../components/layout/SidebarPHC.jsx";
import Navbar from "../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function PhcDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          if (!mounted) return;
          setError("Please login as PHC Admin to view the dashboard");
          setLoading(false);
          return;
        }

        // 1️⃣ Get backend summary (for high-risk, tasks, surveys, etc.)
        // 2️⃣ Get ASHA + ANM list from phcAdmin endpoints
        // 3️⃣ Get families list (for families count, maybe members)
        const [summaryRes, ashaRes, anmRes, famRes] = await Promise.all([
          axios.get("/api/phc/summary"),
          axios.get(`${BASE_URL}/phcAdmin/ashas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/phcAdmin/anms`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/phc/families", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!mounted) return;

        const backendSummary = summaryRes.data || {};

        const ashaList = Array.isArray(ashaRes.data) ? ashaRes.data : [];
        const anmList = Array.isArray(anmRes.data) ? anmRes.data : [];

        // families API might return [] or { families: [...] }
        let familiesList = famRes.data;
        if (familiesList && Array.isArray(familiesList.families)) {
          familiesList = familiesList.families;
        }
        if (!Array.isArray(familiesList)) {
          familiesList = [];
        }

        // ✅ FRONTEND COUNTS
        const totalASHA = ashaList.length;
        const totalANM = anmList.length;
        const totalFamilies = familiesList.length;

        // Members count – only if we have per-family member counts; otherwise fallback to backend
        let totalMembers = backendSummary.totalMembers ?? 0;
        if (
          familiesList.length > 0 &&
          familiesList[0].members_count !== undefined
        ) {
          totalMembers = familiesList.reduce(
            (acc, f) => acc + (Number(f.members_count) || 0),
            0
          );
        }

        // Merge frontend counts + backend summary
        setSummary({
          ...backendSummary,
          totalASHA,
          totalANM,
          totalFamilies,
          totalMembers,
        });
      } catch (e) {
        console.error("PHC summary error:", e);
        if (!mounted) return;
        setError("Failed to load PHC summary");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <SidebarPHC />
        <div className="flex-1 ml-64">
          <Navbar role="phc" />
          <main className="p-6">Loading PHC Dashboard…</main>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex min-h-screen">
        <SidebarPHC />
        <div className="flex-1 ml-64">
          <Navbar role="phc" />
          <main className="p-6 text-red-600">{error || "No data"}</main>
        </div>
      </div>
    );
  }

  const {
    totalANM,
    totalASHA,
    totalFamilies,
    totalMembers,
    highRiskPregnancies,
    highRiskChildren,
    tbSuspects,
    ncdHighRisk,
    tasksInProgress,
    surveysRunning,
    ashaSync,
    areaCoverage,
    links,
  } = summary;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-64">
        <Navbar role="phc" />

        <main className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">PHC Dashboard</h1>
          <p className="text-gray-600">
            Administrative overview of PHC operations and field workforce.
          </p>

          {/* OVERVIEW GRID */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <StatCard label="ANM Workers" value={totalANM} />
            <StatCard label="ASHA Workers" value={totalASHA} />
            <StatCard label="Families" value={totalFamilies} />
            <StatCard label="Members" value={totalMembers} />
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <StatCard
              label="High-Risk Pregnancies"
              value={highRiskPregnancies}
              warning
            />
            <StatCard
              label="High-Risk Children"
              value={highRiskChildren}
              warning
            />
            <StatCard label="TB Suspects" value={tbSuspects} />
            <StatCard label="NCD High-Risk" value={ncdHighRisk} />
          </section>

          <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <StatCard label="Tasks in Progress" value={tasksInProgress} />
            <StatCard label="Active Surveys" value={surveysRunning} />
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Quick Actions</p>
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  href={links?.workforce || "/phc/workforce"}
                  className="px-3 py-2 rounded bg-blue-50 hover:bg-blue-100"
                >
                  Workforce Management
                </Link>
                <Link
                  href={links?.areas || "/phc/areas"}
                  className="px-3 py-2 rounded bg-blue-50 hover:bg-blue-100"
                >
                  Area Management
                </Link>
                <Link
                  href={links?.surveys || "/phc/surveys"}
                  className="px-3 py-2 rounded bg-blue-50 hover:bg-blue-100"
                >
                  Surveys &amp; Campaigns
                </Link>
              </div>
            </div>
          </section>

          {/* ASHA SYNC */}
          <section className="bg-white p-4 rounded shadow mt-6">
            <h2 className="font-semibold mb-3">Last ASHA Sync Status</h2>
            {ashaSync && ashaSync.length > 0 ? (
              ashaSync.map((a) => (
                <div key={a.id} className="border p-3 rounded mb-2">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-gray-600">
                    Last Sync: {a.lastSync}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No sync records available.
              </p>
            )}
          </section>

          {/* AREA COVERAGE */}
          <section className="bg-white p-4 rounded shadow mt-6">
            <h2 className="font-semibold mb-3">Area Coverage Summary</h2>
            <div className="space-y-3">
              {areaCoverage && areaCoverage.length > 0 ? (
                areaCoverage.map((area) => (
                  <div key={area.id} className="rounded border p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{area.name}</div>
                        <div className="text-xs text-gray-500">
                          Area ID: {area.id}
                        </div>
                      </div>
                      <div className="w-1/3 text-right">
                        <div className="text-sm font-semibold">
                          {area.coverage}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 bg-gray-100 w-full h-2 rounded">
                      <div
                        style={{ width: `${area.coverage}%` }}
                        className="h-2 rounded bg-green-600"
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No area data.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, warning }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`text-2xl font-bold ${
          warning ? "text-red-600" : ""
        }`}
      >
        {value ?? "--"}
      </p>
    </div>
  );
}
