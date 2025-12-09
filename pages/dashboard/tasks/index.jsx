import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

export default function TasksDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/tasks/list");
        setTasks(res.data);
        setFiltered(res.data);
      } catch (e) {
        console.error("Error loading tasks", e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let data = [...tasks];

    if (filter !== "all") {
      data = data.filter((t) => t.status === filter);
    }

    setFiltered(data);
  }, [filter, tasks]);

  return (
    <div className="flex min-h-screen">
      <SidebarANM />
      <div className="flex-1 ml-64">
        <Navbar />

        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">Tasks & Assignments</h1>

          {/* Filter */}
          <div className="flex gap-4 mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/tasks/${task.id}`}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg border transition"
              >
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Assigned by: {task.assignedBy}
                </p>

                <p className="text-sm mt-2">
                  Due: <span className="font-medium">{task.dueDate}</span>
                </p>

                <span
                  className={`inline-block mt-3 px-2 py-1 text-xs rounded ${
                    task.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-700"
                      : task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "urgent"
                      ? "bg-red-100 text-red-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {task.status}
                </span>

                <div className="text-blue-600 text-sm mt-4 font-medium">
                  View Details →
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
