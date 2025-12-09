// pages/api/phc/tasks/survey/[id].js
import { getTasksForSurvey } from "../../../../../data/tasksDb.js";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const summary = getTasksForSurvey(id);
    return res.status(200).json(summary);
  } catch (err) {
    console.error("Tasks survey error:", err);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
}
