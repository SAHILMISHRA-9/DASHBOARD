// pages/api/phc/tasks/create.js
import { createTasksForSurvey } from "../../../../data/tasksDb";
import { getSurvey, updateSurvey } from "../../../../data/surveyDb";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    // Expect survey_id and count (count default 1)
    const surveyId = Number(body.survey_id || 0);
    const count = Number(body.count || 1);

    if (!surveyId) {
      return res.status(400).json({ error: "Provide survey_id" });
    }
    if (!count || count <= 0) {
      return res.status(400).json({ error: "Provide positive count" });
    }

    const survey = getSurvey(surveyId);
    if (!survey) return res.status(404).json({ error: "Survey not found" });

    // createTasksForSurvey returns array of created tasks
    const created = createTasksForSurvey(surveyId, survey.area_id, count);

    // update survey totals if tasksDb did not already update (tasksDb.createTasksForSurvey should have updated)
    // But keep consistent: ensure survey has updated numbers
    updateSurvey(surveyId, {
      total_households: survey.total_households + created.length,
      pending: (survey.pending || 0) + created.length
    });

    return res.status(200).json({ success: true, createdCount: created.length, tasks: created });
  } catch (err) {
    console.error("Create tasks error:", err);
    return res.status(500).json({ error: "Failed to create tasks" });
  }
}
