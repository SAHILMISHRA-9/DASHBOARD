import Link from "next/link";
import { useRouter } from "next/router";
import {
  Heart,
  Users,
  Activity,
  TrendingUp,
  BarChart3,
  Briefcase,
  Baby,
  Droplet,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Pregnancy/ANC", href: "/dashboard/anc", icon: Heart },
    { name: "Post-Natal (PNC)", href: "/dashboard/pnc", icon: Baby },
    { name: "Child Immunization", href: "/dashboard/immunization", icon: Droplet },
    { name: "TB Screening", href: "/dashboard/tb", icon: Activity },
    { name: "NCD Screening", href: "/dashboard/ncd", icon: TrendingUp },
    { name: "General Visits", href: "/dashboard/general", icon: Users },
    { name: "High-Risk Cases", href: "/dashboard/high-risk", icon: Activity },
    { name: "Tasks", href: "/dashboard/tasks", icon: Briefcase },
    { name: "ASHA Performance", href: "/dashboard/asha-performance", icon: TrendingUp },
    { name: "Family Records", href: "/dashboard/family", icon: Users },
  ];

  const isActive = (path) => router.pathname.startsWith(path);

  return (
    <aside className="w-64 bg-white shadow h-screen p-5 fixed border-r border-gray-200 select-none">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-3xl">💙</div>
        <h1 className="font-bold text-xl mt-1">ANM Portal</h1>
        <p className="text-xs text-gray-500 -mt-1">Healthcare Management</p>
      </div>

      {/* Menu */}
      <nav className="space-y-1">
        {menu.map((item, index) => {
          const Icon = item.icon;  // extract actual component

          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
                isActive(item.href)
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}