import { assignAshaToTasks } from "../../../../../data/tasksDb.js";
import { getSurvey } from "../../../../../data/surveyDb";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { asha_id } = req.body;
    if (!asha_id) {
      return res.status(400).json({ error: "asha_id required" });
    }

    const survey = getSurvey(id);
    if (!survey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    const updated = assignAshaToTasks(id, Number(asha_id));

    return res.status(200).json({
      success: true,
      assigned: updated
    });

  } catch (err) {
    console.error("ASHA assignment error:", err);
    return res.status(500).json({ error: "Failed to assign ASHA" });
  }
}
