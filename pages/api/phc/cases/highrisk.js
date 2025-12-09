// pages/api/phc/cases/highrisk.js
import { getHighRiskCases } from "../../../../data/healthRecordsDb";
import { getSurveys, getSurvey } from "../../../../data/surveyDb";
import { getTasksForSurvey } from "../../../../data/tasksDb";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const hrCases = getHighRiskCases();
    // gather survey high-risk counts (from tasks DB)
    const surveys = getSurveys();
    const surveyHighs = surveys.map(s => {
      // if tasksDb available, get counts
      let count = 0;
      try {
        const summary = getTasksForSurvey(s.id);
        count = summary.highRisk || 0;
      } catch (e) {
        count = 0;
      }
      return { survey_id: s.id, title: s.title, highRiskCount: count };
    });

    return res.status(200).json({ cases: hrCases, surveys: surveyHighs });
  } catch (err) {
    console.error("High-risk API error:", err);
    return res.status(500).json({ error: "Failed" });
  }
}
