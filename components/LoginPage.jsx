"use client";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [role, setRole] = useState("anm");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();

    const res = await axios.post("/api/auth/login", {
      role,
      mobile,
      password,
    });

    if (!res.data.success) {
      alert("Invalid credentials");
      return;
    }

    const { token, user } = res.data;

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_role", user.role);

    document.cookie = `auth_token=${token}; path=/;`;
    document.cookie = `auth_role=${user.role}; path=/;`;

    if (user.role === "anm") window.location.href = "/dashboard";
    if (user.role === "phc") window.location.href = "/phc/dashboard";
    if (user.role === "doctor") window.location.href = "/doctor/dashboard";
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

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
