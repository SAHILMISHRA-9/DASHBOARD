// pages/api/phc/tasks/asha/[id].js
import { getTasksForAsha } from "../../../../../data/tasksDb.js";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = getTasksForAsha(id);
    // return tasks under key `tasks` for frontend compatibility
    return res.status(200).json({ ...data, tasks: data.list || [] });
  } catch (err) {
    console.error("Get ASHA tasks error:", err);
    return res.status(500).json({ error: "Failed to load tasks" });
  }
}
