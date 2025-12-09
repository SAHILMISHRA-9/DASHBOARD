// pages/api/phc/surveys/update-progress/[id].js
import { updateSurveyProgress } from "../../../../../data/surveyDb";

export default function handler(req, res) {
  const { id } = req.query;
  if (req.method !== "POST" && req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

  const payload = req.body || {};
  const updated = updateSurveyProgress(id, payload);
  if (!updated) return res.status(404).json({ error: "Survey not found" });
  return res.status(200).json(updated);
}
