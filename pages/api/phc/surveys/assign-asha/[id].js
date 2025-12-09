import { assignASHAtoSurvey, unassignASHAfromSurvey, getSurvey } from "../../../../../data/surveyDb";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { asha_id } = req.body;
    const updated = assignASHAtoSurvey(Number(id), Number(asha_id));
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const { asha_id } = req.body;
    const updated = unassignASHAfromSurvey(Number(id), Number(asha_id));
    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
