// Temporary in-memory static storage
let performanceData = [
  {
    asha_id: 1,
    visits_this_month: 10,
    tasks_completed: 28,
    performance_score: 84,
    last_updated: "2025-01-10T10:30:00Z",

    // ⭐ ADD THIS
    history: [
      { month: "Jan", visits: 8, tasks: 20 },
      { month: "Feb", visits: 10, tasks: 25 },
      { month: "Mar", visits: 12, tasks: 30 },
      { month: "Apr", visits: 9, tasks: 22 },
      { month: "May", visits: 11, tasks: 26 },
      { month: "Jun", visits: 13, tasks: 32 },
      { month: "Jul", visits: 14, tasks: 34 },
    ],
  },

  {
    asha_id: 2,
    visits_this_month: 14,
    tasks_completed: 35,
    performance_score: 90,
    last_updated: "2025-01-11T14:10:00Z",

    // ⭐ ADD THIS TOO
    history: [
      { month: "Jan", visits: 7, tasks: 18 },
      { month: "Feb", visits: 9, tasks: 22 },
      { month: "Mar", visits: 11, tasks: 28 },
      { month: "Apr", visits: 8, tasks: 21 },
      { month: "May", visits: 10, tasks: 24 },
      { month: "Jun", visits: 12, tasks: 29 },
      { month: "Jul", visits: 15, tasks: 36 },
    ],
  }
];


// Get performance for ASHA
export function getPerformance(id) {
  return performanceData.find((p) => p.asha_id === Number(id)) || null;
}

// Update performance (for backend readiness)
export function updatePerformance(id, updates) {
  const index = performanceData.findIndex((p) => p.asha_id === Number(id));
  if (index === -1) return null;

  performanceData[index] = { ...performanceData[index], ...updates };
  return performanceData[index];
}

// Create new performance entry if not exists
export function createPerformance(id) {
  const entry = {
    asha_id: Number(id),
    visits_this_month: 0,
    tasks_completed: 0,
    performance_score: 0,
    last_updated: new Date().toISOString(),
  };

  performanceData.push(entry);
  return entry;
}


