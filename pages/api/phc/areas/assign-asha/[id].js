// pages/api/phc/areas/assign-asha/[id].js
import { assignASHA, unassignASHA } from "../../../../../data/areaDb";

export default function handler(req, res) {
  const { id } = req.query;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { asha_id, action } = req.body || {};
  if (!asha_id) return res.status(400).json({ error: "asha_id required" });

  if (action === "remove") {
    const area = unassignASHA(id, asha_id);
    if (!area) return res.status(404).json({ error: "Area not found" });
    return res.status(200).json(area);
  } else {
    const area = assignASHA(id, asha_id);
    if (!area) return res.status(404).json({ error: "Area not found" });
    return res.status(200).json(area);
  }
}
