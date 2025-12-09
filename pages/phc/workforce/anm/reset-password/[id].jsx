import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SidebarPHC from "../../../../../components/layout/SidebarPHC";
import Navbar from "../../../../../components/layout/Navbar";
import Link from "next/link";

export default function ResetPasswordANM() {
  const router = useRouter();
  const { id } = router.query;

  const [anm, setAnm] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load ANM info
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get(`/api/phc/workforce/anm/${id}`);
        setAnm(res.data);
      } catch (err) {
        console.error("Failed to load ANM");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const resetPassword = async () => {
    setSaving(true);

    try {
      const res = await axios.post(
        `/api/phc/workforce/anm/reset-password/${id}`
      );

      setNewPass(res.data.newPassword);
    } catch (err) {
      console.error("Reset error:", err);
      alert("Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!anm) return <div className="p-6">ANM not found.</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-xl">
          <h1 className="text-2xl font-bold mb-4">Reset Password (ANM)</h1>

          <div className="bg-white p-4 rounded shadow mb-6">
            <p className="font-semibold">{anm.name}</p>
            <p className="text-gray-600">Phone: {anm.phone}</p>
            <p className="text-gray-600">Email: {anm.email}</p>
          </div>

          {/* BUTTON */}
          <button
            disabled={saving}
            onClick={resetPassword}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Resetting…" : "Reset Password"}
          </button>

          {newPass && (
            <div className="mt-4 bg-green-100 border p-4 rounded">
              <p className="font-semibold">New Password:</p>
              <p className="text-lg">{newPass}</p>
            </div>
          )}

          <Link
            href={`/phc/workforce/anm/${id}`}
            className="block mt-4 text-gray-700"
          >
            ← Back to ANM Details
          </Link>
        </main>
      </div>
    </div>
  );
}
