import { getSurvey, updateSurvey } from "../../../../data/surveyDb";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const survey = getSurvey(id);
    if (!survey) return res.status(404).json({ error: "Survey not found" });
    return res.status(200).json(survey);
  }

  if (req.method === "PUT") {
    try {
      const updated = updateSurvey(id, req.body);
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json({ error: "Failed to update survey" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
