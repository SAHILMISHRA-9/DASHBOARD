// components/layout/SidebarPHC.jsx
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function SidebarPHC() {
  const router = useRouter();
  const path = router.pathname;

  const navItem = (href, label, small = false) => {
    const active = path.startsWith(href);
    return (
      <li>
        <Link
          href={href}
          className={`block px-4 py-2 rounded-md transition-colors ${
            active ? "bg-blue-700 text-white" : "text-white/90 hover:bg-blue-600"
          } ${small ? "text-sm" : "text-base font-medium"}`}
        >
          {label}
        </Link>
      </li>
    );
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 bg-[#0b3b78] text-white shadow-lg overflow-y-auto"
      aria-label="PHC navigation"
    >
      <div className="px-6 py-6">
        <div className="text-xl font-bold mb-4">PHC Portal</div>

        <nav>

          {/* DASHBOARD */}
          <ul className="space-y-1">
            {navItem("/phc/dashboard", "Dashboard")}
          </ul>

          {/* WORKFORCE MANAGEMENT */}
          <div className="mt-6 px-2 text-xs text-blue-200 uppercase font-semibold">
            Workforce Management
          </div>
          <ul className="mt-2 space-y-1 px-2">
            {navItem("/phc/workforce/anm", "ANM Workers")}
            {navItem("/phc/workforce/asha", "ASHA Workers")}
          </ul>

          {/* ANALYTICS */}
          <div className="mt-6 px-2 text-xs text-blue-200 uppercase font-semibold">
            Analytics
          </div>
          <ul className="mt-2 space-y-1 px-2">
            {navItem("/phc/workforce/dashboard", "Workforce Dashboard")}
          </ul>

          {/* RISK DASHBOARD (NEW SECTION) */}
          <div className="mt-6 px-2 text-xs text-blue-200 uppercase font-semibold">
            Risk Dashboard
          </div>
          <ul className="mt-2 space-y-1 px-2">
            {navItem("/phc/highrisk", "High-Risk Central Board")}
          </ul>

          {/* AREA MANAGEMENT */}
          <div className="mt-6 px-2 text-xs text-blue-200 uppercase font-semibold">
            Area Management
          </div>
          <ul className="mt-2 space-y-1 px-2">
            {navItem("/phc/areas", "Manage Areas")}
          </ul>

          {/* SURVEYS */}
          <div className="mt-6 px-2 text-xs text-blue-200 uppercase font-semibold">
            Surveys & Campaigns
          </div>
          <ul className="mt-2 space-y-1 px-2">
            {navItem("/phc/surveys", "Surveys & Campaigns")}
          </ul>

          {/* CASE MONITORING */}
          <div className="mt-6 px-2 text-xs text-blue-200 uppercase font-semibold">
            Case Monitoring
          </div>
          <ul className="mt-2 space-y-1 px-2">
            {navItem("/phc/cases/anc", "Pregnancy (ANC)")}
            {navItem("/phc/cases/pnc", "PNC")}
            {navItem("/phc/cases/child", "Child Immunization")}
            {navItem("/phc/cases/tb", "TB Screening")}
            {navItem("/phc/cases/ncd", "NCD Screening")}
            {/* High-risk removed from here permanently */}
          </ul>

          {/* FAMILY REGISTRY */}
          <div className="mt-6 px-2 text-xs text-blue-200 uppercase font-semibold">
            Family Registry
          </div>
          <ul className="mt-2 space-y-1 px-2">
            {navItem("/phc/families", "Families & Members")}
          </ul>

          {/* TASK & REPORTS */}
          <div className="mt-6 px-2 text-xs text-blue-200 uppercase font-semibold">
            Task & Reports
          </div>
          <ul className="mt-2 space-y-1 px-2">
            {navItem("/phc/task-management", "Task Management")}
            {navItem("/phc/reports", "Reports")}
            {navItem("/phc/settings", "Settings")}
          </ul>

        </nav>
      </div>
    </aside>
  );
}
