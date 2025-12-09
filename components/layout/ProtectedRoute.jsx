import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProtectedRoute({ children, role }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const token = localStorage.getItem("auth_token");
    const userRole = localStorage.getItem("auth_role");

    if (!token || !userRole) {
      router.replace("/login");
      return;
    }

    if (role && role !== userRole) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router.isReady, role]);

  if (!ready) return <div className="w-full h-screen bg-gray-100"></div>;
  return children;
}
