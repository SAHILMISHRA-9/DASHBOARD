// Mock summary API for dashboard KPIs
export default function handler(req, res) {
  const response = {
    kpis: [
      { label: "Active Pregnancies", value: 5, icon: "🤰" },
      { label: "Babies Under Care", value: 6, icon: "👶" },
      { label: "High-Risk Cases", value: 8, icon: "⚠️" },
      { label: "ASHA Coverage", value: "95%", icon: "✅" }
    ],
    highRiskCases: {
      total: 8,
      top: [
        { id: 1, category: "ANC", name: "Rekha Devi", reason: "High BP" },
        { id: 2, category: "Child", name: "Aman Kumar (child)", reason: "MUAC alert" },
        { id: 3, category: "NCD", name: "Pooja Singh", reason: "Very high sugar" }
      ]
    },
    moduleSummaries: [
      // maternal
      { slug: "anc", group: "maternal", title: "Pregnancy / ANC", href: "/dashboard/anc", count: 5, subtitle: "Active pregnancies", icon: "🤰" },
      { slug: "pnc", group: "maternal", title: "Post-Natal Care (PNC)", href: "/dashboard/pnc", count: 3, subtitle: "Post-delivery followups", icon: "🤱" },

      // child
      { slug: "immunization", group: "child", title: "Child Immunization", href: "/dashboard/immunization", count: 3, subtitle: "Missed & due vaccines", icon: "💉" },

      // screening
      { slug: "tb", group: "screening", title: "TB Screening", href: "/dashboard/tb", count: 3, icon: "🦠" },
      { slug: "ncd", group: "screening", title: "NCD Screening", href: "/dashboard/ncd", count: 3, icon: "💓" },
      { slug: "general", group: "screening", title: "General Health Visits", href: "/dashboard/general", count: 3, icon: "🩺" },

      // ops
      { slug: "tasks", group: "ops", title: "Task Management", href: "/dashboard/tasks", count: 3, subtitle: "Pending tasks", icon: "🗂️" },
      { slug: "asha", group: "ops", title: "ASHA Performance", href: "/dashboard/asha-performance", count: 4, subtitle: "Active ASHAs", icon: "📈" },
      { slug: "family", group: "ops", title: "Family & Member Records", href: "/dashboard/family", count: 5, subtitle: "Households", icon: "🏠" }
    ],

    tasksSummary: { pending: 3, completed: 12 },
    ashaPerformance: { avgVisitsPerWeek: 8, syncIssues: 1 },
    familySummary: { totalFamilies: 120, totalMembers: 560 },

    // local path to the SIH PDF you uploaded — using the local path from your project environment
    report_url: "/mnt/data/SIH2025-INNOVENGERS20251003095306 (1).pdf"
  };

  res.status(200).json(response);
}
