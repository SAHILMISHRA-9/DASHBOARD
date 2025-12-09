import PHCSidebar from "../../components/layout/SidebarPHC.jsx";
import Navbar from "../../components/layout/Navbar"; // reuse same navbar

export default function PHCDashboard() {
  // Mock summary data – later replace with API (/api/phc/summary)
  const summary = {
    anmCount: 8,
    ashaCount: 42,
    familyCount: 1200,
    memberCount: 5600,
    highRiskPregnancy: 23,
    highRiskChild: 15,
    tbSuspects: 9,
    ncdHighRisk: 31,
    tasksInProgress: 18,
    surveysRunning: 3,
    lastSync: "Today, 2:35 PM",
    coverage: "78% households covered this month",
  };

  const highRiskTable = [
    { type: "Pregnancy", count: 23, last24h: 2 },
    { type: "Child (nutrition)", count: 15, last24h: 1 },
    { type: "TB suspects", count: 9, last24h: 0 },
    { type: "NCD (BP/Sugar)", count: 31, last24h: 4 },
  ];

  const taskSnapshot = [
    { name: "Dengue Fever Survey", progress: 72, due: "3 days left" },
    { name: "ANC Home Visit Drive", progress: 54, due: "5 days left" },
    { name: "Child Vaccine Week", progress: 38, due: "7 days left" },
  ];

  const anmSnapshot = [
    { name: "ANM Rekha", area: "Ward 1–3", asha: 6, lastSync: "1h ago" },
    { name: "ANM Pooja", area: "Ward 4–6", asha: 5, lastSync: "3h ago" },
    { name: "ANM Kavita", area: "Ward 7–9", asha: 4, lastSync: "Yesterday" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <PHCSidebar />

      {/* Main content */}
      <div className="flex-1 ml-64">
        <Navbar />

        <main className="p-6 space-y-6">
          {/* Page Heading */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">PHC Dashboard</h1>
              <p className="text-sm text-gray-600">
                Overview of ANMs, ASHAs, high-risk cases & campaigns under this PHC.
              </p>
            </div>
            <div className="text-xs text-gray-500">
              Last ASHA Sync:{" "}
              <span className="font-semibold text-gray-700">
                {summary.lastSync}
              </span>
              <br />
              Coverage:{" "}
              <span className="font-semibold text-gray-700">
                {summary.coverage}
              </span>
            </div>
          </div>

          {/* Top Stats Cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="ANM Workers" value={summary.anmCount} />
            <StatCard label="ASHA Workers" value={summary.ashaCount} />
            <StatCard label="Families" value={summary.familyCount} />
            <StatCard label="Members" value={summary.memberCount} />
          </section>

          {/* High-Risk & Tasks Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* High-risk counters */}
            <div className="bg-white rounded-xl shadow p-4 col-span-2">
              <h2 className="font-semibold mb-3">High-Risk Snapshot</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <MiniCard label="High-Risk Pregnancy" value={summary.highRiskPregnancy} />
                <MiniCard label="High-Risk Child" value={summary.highRiskChild} />
                <MiniCard label="TB Suspects" value={summary.tbSuspects} />
                <MiniCard label="NCD High-Risk" value={summary.ncdHighRisk} />
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-1">Case Type</th>
                    <th className="py-1">Total High-Risk</th>
                    <th className="py-1">New (Last 24h)</th>
                  </tr>
                </thead>
                <tbody>
                  {highRiskTable.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-1">{row.type}</td>
                      <td className="py-1 font-semibold">{row.count}</td>
                      <td className="py-1">{row.last24h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tasks & Campaigns */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="font-semibold mb-3">Campaigns & Tasks</h2>
              <p className="text-xs text-gray-500 mb-2">
                Active surveys and drives under this PHC.
              </p>
              <ul className="space-y-2">
                {taskSnapshot.map((task, idx) => (
                  <li
                    key={idx}
                    className="border rounded-lg px-3 py-2 text-sm flex flex-col"
                  >
                    <span className="font-semibold">{task.name}</span>
                    <span className="text-xs text-gray-500">
                      Progress: {task.progress}%
                    </span>
                    <span className="text-xs text-gray-500">
                      {task.due}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ANM Overview Row */}
          <section className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-3">ANM & ASHA Overview</h2>
            <p className="text-xs text-gray-500 mb-2">
              Quick view of ANMs, areas and ASHAs under this PHC.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-1">ANM</th>
                    <th className="py-1">Area</th>
                    <th className="py-1">ASHAs</th>
                    <th className="py-1">Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {anmSnapshot.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-1 font-semibold">{row.name}</td>
                      <td className="py-1">{row.area}</td>
                      <td className="py-1">{row.asha}</td>
                      <td className="py-1 text-xs text-gray-500">{row.lastSync}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// Small reusable stat cards
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function MiniCard({ label, value }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
