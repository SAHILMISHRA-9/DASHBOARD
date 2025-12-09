// components/common/layout/SidebarDOCTOR.jsx

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Sidebar menu config (easy to modify later)
const menu = [
  {
    label: "Dashboard",
    path: "/doctor/dashboard",
  },
  {
    label: "Family Health Cases",
    path: "/doctor/cases",
  },
  {
    label: "High-Risk Cases",
    path: "/doctor/high-risk",
  },
  {
    label: "ANC Summary",
    path: "/doctor/summary/anc",
  },
  {
    label: "PNC Summary",
    path: "/doctor/summary/pnc",
  },
  {
    label: "Child Immunization",
    path: "/doctor/summary/child",
  },
];

export default function SidebarDOCTOR() {
  const router = useRouter();

  return (
    <div className="h-screen w-64 bg-blue-900 text-white flex flex-col shadow-lg">
      {/* HEADER */}
      <div className="p-4 text-center font-bold text-xl border-b border-blue-700">
        Doctor Panel
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menu.map((item, index) => {
          const active = router.pathname === item.path;
          return (
            <Link href={item.path} key={index}>
              <div
                className={`cursor-pointer px-4 py-2 rounded-md text-sm transition ${
                  active
                    ? "bg-white text-blue-900 font-semibold"
                    : "hover:bg-blue-800"
                }`}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
