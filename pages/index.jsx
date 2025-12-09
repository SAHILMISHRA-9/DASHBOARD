import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const role = localStorage.getItem("auth_role");

    if (role === "anm") router.replace("/dashboard");
    else if (role === "phc") router.replace("/phc/dashboard");
    else if (role === "doctor") router.replace("/doctor/dashboard");
    else router.replace("/login");

    setReady(true);
  }, []);

  if (!ready) return null;

  return null;
}
