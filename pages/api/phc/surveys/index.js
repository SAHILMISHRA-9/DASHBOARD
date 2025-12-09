// pages/api/phc/surveys/index.js
import { getSurveys, createSurvey } from "../../../../data/surveyDb.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    const list = getSurveys();
    return res.status(200).json(list);
  }
  if (req.method === "POST") {
    const payload = req.body || {};
    if (!payload.title) return res.status(400).json({ error: "title required" });
    const created = createSurvey(payload);
    return res.status(201).json(created);
  }
  return res.status(405).json({ error: "Method not allowed" });
}
