export default function handler(req, res) {
  const data = [
    {
      id: 1,
      name: "ASHA Rani",
      totalVisits: 42,
      completedTasks: 18,
      pendingTasks: 6,
      highRiskCases: 4,
      lastSync: "2024-02-01 10:25 AM",
      performanceScore: 88,
      visitBreakdown: {
        anc: 10,
        pnc: 6,
        child: 8,
        ncd: 7,
        tb: 3,
        general: 8,
      },
    },
    {
      id: 2,
      name: "ASHA Suman",
      totalVisits: 36,
      completedTasks: 14,
      pendingTasks: 4,
      highRiskCases: 2,
      lastSync: "2024-02-01 09:50 AM",
      performanceScore: 76,
      visitBreakdown: {
        anc: 7,
        pnc: 4,
        child: 10,
        ncd: 6,
        tb: 2,
        general: 7,
      },
    },
    {
      id: 3,
      name: "ASHA Parvati",
      totalVisits: 50,
      completedTasks: 21,
      pendingTasks: 5,
      highRiskCases: 5,
      lastSync: "2024-02-01 11:15 AM",
      performanceScore: 92,
      visitBreakdown: {
        anc: 12,
        pnc: 8,
        child: 10,
        ncd: 8,
        tb: 3,
        general: 9,
      },
    },
  ];

  res.status(200).json(data);
}
