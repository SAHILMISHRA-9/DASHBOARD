import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState("anm");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto redirect
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const r = localStorage.getItem("auth_role");

    if (token && r) {
      if (r === "anm") router.push("/dashboard");
      if (r === "phc") router.push("/phc/dashboard");
      if (r === "doctor") router.push("/doctor/dashboard");
    }
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        role,
        mobile,
        password,
      });

      if (!res.data.success) {
        alert("Invalid credentials");
        setLoading(false);
        return;
      }

      const { token, user } = res.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_role", user.role);

      if (user.role === "anm") router.push("/dashboard");
      if (user.role === "phc") router.push("/phc/dashboard");
      if (user.role === "doctor") router.push("/doctor/dashboard");

    } catch (err) {
      alert("Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={loginHandler} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Unified Login Portal</h2>

        <label className="block text-sm mb-1">Role</label>
        <select
          className="w-full border p-2 mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="anm">ANM</option>
          <option value="phc">PHC Officer</option>
          <option value="doctor">Doctor</option>
        </select>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-xs text-gray-500 mt-3">
          Test accounts:<br />
          ANM → 9999999999 / anm123<br />
          PHC → 8888888888 / phc123<br />
          Doctor → 7777777777 / doc123
        </p>
      </form>
    </div>
  );
}
