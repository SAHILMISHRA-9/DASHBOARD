// pages/api/phc/tasks/assign-tasks/[id].js
import { assignASHAtoSurveyTasks } from "../../../../../data/tasksDb.js";
import { getSurvey } from "../../../../../data/surveyDb";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body || {};
    const survey = getSurvey(id);
    if (!survey) return res.status(404).json({ error: "Survey not found" });

    // body: { mode, ashaIds, mapping }
    const result = assignASHAtoSurveyTasks(id, body);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("Assign tasks error:", err);
    return res.status(500).json({ error: "Failed to assign tasks" });
  }
}
