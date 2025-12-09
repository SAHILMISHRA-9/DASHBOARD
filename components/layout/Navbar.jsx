"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [title, setTitle] = useState("Health Portal"); // SSR-safe default

  useEffect(() => {
    const role = localStorage.getItem("auth_role");

    if (role === "doctor") setTitle("Doctor Health Portal");
    else if (role === "phc") setTitle("PHC Health Portal");
    else if (role === "anm") setTitle("ANM Dashboard");
    else setTitle("Health Portal");
  }, []);

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_role");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <div className="bg-white border-b">
      <div className="flex items-center justify-between p-4">

        {/* CLIENT-SAFE TITLE */}
        <div className="text-lg font-semibold text-gray-700">
          {title}
        </div>

        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>

      </div>
    </div>
  );
}
