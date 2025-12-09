import { getSurveyTypes, addSurveyType } from "../../../../../data/surveyDb";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(getSurveyTypes());
  }

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });

    const created = addSurveyType(name);
    return res.status(201).json(created);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
