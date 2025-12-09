import React from "react";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import SidebarPHC from "../../components/layout/SidebarPHC";
import Navbar from "../../components/layout/Navbar";
import TaskPanel from "../../components/tasks/TaskPanel";

export default function TaskManagementPage() {
  const phcId = 1; // Later replace with session PHC ID

  return (
    <ProtectedRoute role="phc">
      <div className="flex min-h-screen bg-gray-100">

        {/* Sidebar */}
        <SidebarPHC />

        {/* Main wrapper with left margin */}
        <div className="flex-1 flex flex-col ml-60">
          <Navbar />

          {/* Page content */}
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Task Management</h1>

            {/* Render the actual Task UI */}
            <TaskPanel phcId={phcId} />
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
