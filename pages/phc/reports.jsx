import React, { useState } from "react";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import SidebarPHC from "../../components/layout/SidebarPHC";
import Navbar from "../../components/layout/Navbar";

export default function ReportsPage() {
  const [type, setType] = useState("tasks");
  const [format, setFormat] = useState("csv");
  const phcId = 1;

  function download() {
    window.location = `/api/phc/reports/${type}?format=${format}&phc_id=${phcId}`;
  }

  return (
    <ProtectedRoute role="phc">
      <div className="flex min-h-screen bg-gray-100">

        {/* Sidebar */}
        <SidebarPHC />

        {/* FIXED → Add ml-60 */}
        <div className="flex-1 flex flex-col ml-60">
          <Navbar />

          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Reports & Exports</h1>

            <div className="bg-white shadow p-6 rounded-md max-w-lg">
              <label className="block mb-2">Report Type</label>
              <select
                className="w-full border rounded p-2 mb-4"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="tasks">Tasks</option>
                <option value="subtasks">Subtasks</option>
                <option value="task-completion">Task completion</option>
              </select>

              <label className="block mb-2">Format</label>
              <select
                className="w-full border rounded p-2 mb-4"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
                <option value="pdf">PDF</option>
              </select>

              <div className="mt-3">
                <button
                  onClick={download}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
