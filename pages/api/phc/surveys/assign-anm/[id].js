// pages/api/phc/surveys/assign-anm/[id].js
import { assignANMToSurvey, unassignANMFromSurvey, getSurvey } from "../../../../../data/surveyDb";

export default function handler(req, res) {
  const { id } = req.query; // survey id

  if (req.method === "GET") {
    const survey = getSurvey(id);
    if (!survey) return res.status(404).json({ error: "Survey not found" });
    return res.status(200).json({ anm_assigned: survey.anm_assigned || [] });
  }

  // assign anm -> POST { anm_id: number }
  if (req.method === "POST") {
    const { anm_id } = req.body;
    if (!anm_id) return res.status(400).json({ error: "anm_id required" });

    const updated = assignANMToSurvey(id, Number(anm_id));
    if (!updated) return res.status(404).json({ error: "Survey not found" });

    return res.status(200).json({ success: true, survey: updated });
  }

  // unassign -> DELETE body { anm_id: number } or query ?anm_id=#
  if (req.method === "DELETE") {
    // support body or query param
    const anm_id = req.body?.anm_id ?? (req.query?.anm_id ? Number(req.query.anm_id) : null);
    if (!anm_id) return res.status(400).json({ error: "anm_id required" });

    const updated = unassignANMFromSurvey(id, Number(anm_id));
    if (!updated) return res.status(404).json({ error: "Survey not found" });

    return res.status(200).json({ success: true, survey: updated });
  }

  res.status(405).json({ error: "Method not allowed" });
}
