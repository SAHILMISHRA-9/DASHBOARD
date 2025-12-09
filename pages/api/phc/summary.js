import { areas } from "../../../data/areaDb.js";

// pages/api/phc/summary.js
export default function handler(req, res) {
  // Simple mock. Replace with DB queries later.
  const summary = {
    totalANM: 5,
    totalASHA: 18,
    totalFamilies: 230,
    totalMembers: 1020,
    highRiskPregnancies: 6,
    highRiskChildren: 4,
    tbSuspects: 3,
    ncdHighRisk: 7,
    tasksInProgress: 12,
    surveysRunning: 2,
    // last asha sync times
    ashaSync: [
      { id: 1, name: "ASHA Sunita", lastSync: "2024-01-10 08:30 AM" },
      { id: 2, name: "ASHA Renu", lastSync: "2024-01-10 08:45 AM" },
      { id: 3, name: "ASHA Preeti", lastSync: "2024-01-10 09:10 AM" }
    ],
    // area coverage summary — list of areas with coverage %
    areaCoverage: [
      { id: "A1", name: "Rampur - SC-001", coverage: 95 },
      { id: "A2", name: "Kumargaon - SC-002", coverage: 86 },
      { id: "A3", name: "Nagar - SC-003", coverage: 72 }
    ],
    // quick links (optional)
    links: {
      workforce: "/phc/workforce", // create pages later
      areas: "/phc/areas",
      surveys: "/phc/surveys",
      cases: "/phc/cases"
    }
  };

  res.status(200).json(summary);
}
