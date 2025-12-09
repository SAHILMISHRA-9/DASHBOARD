import React from "react";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import SidebarPHC from "../../components/layout/SidebarPHC";
import Navbar from "../../components/layout/Navbar";

export default function SettingsPage() {
  return (
    <ProtectedRoute role="phc">
      <div className="flex min-h-screen bg-gray-100">

        {/* Sidebar */}
        <SidebarPHC />

        {/* MAIN CONTENT — add ml-60 */}
        <div className="flex-1 flex flex-col ml-60">
          <Navbar />

          {/* Page content */}
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Settings</h1>

            {/* Settings UI */}
            <div className="bg-white shadow p-6 rounded-md max-w-xl">
              <div className="mb-4">
                <label className="block mb-1">PHC Name</label>
                <input className="w-full border rounded p-2" placeholder="PHC Name" />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Address</label>
                <textarea className="w-full border rounded p-2" placeholder="Address"></textarea>
              </div>

              <div className="mb-4">
                <label className="block mb-1">Notification Preference</label>
                <select className="w-full border rounded p-2">
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Push Notification</option>
                </select>
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Save Settings
              </button>
            </div>
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
