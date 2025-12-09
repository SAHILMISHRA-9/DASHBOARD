import { deleteSurveyType } from "../../../../../data/surveyDb";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    deleteSurveyType(Number(id));
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
