import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";

export default function TaskDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await axios.get("/api/tasks/list");
        const t = res.data.find((x) => x.id == id);

        if (t) {
          setTask(t);
          setProgress(t.progress);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const updateProgress = () => {
    if (progress >= 100) return;
    setProgress((p) => Math.min(100, p + 20));
  };

  const markCompleted = () => {
    if (!confirm("Mark this task as completed?")) return;
    setTask((prev) => ({ ...prev, status: "completed" }));
    setProgress(100);
  };

  /* ---------------- LOADING ---------------- */
  if (loading)
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex-1 flex flex-col overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20">Loading…</main>
        </div>
      </div>
    );

  /* ---------------- NO TASK FOUND ---------------- */
  if (!task)
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarANM />
        <div className="flex-1 flex flex-col overflow-hidden pl-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 pt-20 text-red-600">
            Task not found.
          </main>
        </div>
      </div>
    );

  /* ---------------- MAIN PAGE ---------------- */
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarANM />

      {/* RIGHT SIDE AREA */}
      <div className="flex-1 flex flex-col overflow-hidden pl-64">
        <Navbar />

        {/* CONTENT SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-6 pt-20 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{task.title}</h1>

              <p className="text-gray-600 text-sm">
                Assigned by: {task.assignedBy}
              </p>
              <p className="text-gray-600 text-sm">
                Assigned to ASHA: {task.asha}
              </p>
              <p className="text-gray-600 text-sm">
                Due Date: {task.dueDate}
              </p>
            </div>

            <button
              onClick={markCompleted}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Mark Completed
            </button>
          </div>

          {/* TASK DESCRIPTION */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Task Description</h2>
            <p className="text-sm">{task.description}</p>
          </section>

          {/* PROGRESS SECTION */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Progress</h2>

            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                style={{ width: `${progress}%` }}
                className="bg-blue-600 h-3 rounded transition-all"
              />
            </div>

            <p className="mt-2 text-sm">{progress}% complete</p>

            <button
              onClick={updateProgress}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update Progress +
            </button>
          </section>

        </main>
      </div>
    </div>
  );
}
