// pages/api/phc/tasks/generate/[id].js

import { createTasksForSurvey } from "../../../../../data/tasksDb.js";
import { getSurvey, updateSurvey } from "../../../../../data/surveyDb";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { count } = req.body;
    const num = Number(count || 0);

    if (!num || num <= 0) {
      return res.status(400).json({ error: "Provide a valid task count" });
    }

    // Ensure survey exists
    const survey = getSurvey(id);
    if (!survey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    // Create tasks
    const created = createTasksForSurvey(id, survey.area_id, num);

    return res.status(200).json({
      success: true,
      createdCount: created.length,
      tasks: created
    });

  } catch (err) {
    console.error("Generate tasks error:", err);
    return res.status(500).json({ error: "Failed to generate tasks" });
  }
}
