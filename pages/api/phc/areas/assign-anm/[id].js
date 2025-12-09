// pages/api/phc/areas/assign-anm/[id].js
import { assignANM, unassignANM, getArea } from "../../../../../data/areaDb";

export default function handler(req, res) {
  const { id } = req.query;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { anm_id, action } = req.body || {};
  if (!anm_id) return res.status(400).json({ error: "anm_id required" });

  if (action === "remove") {
    const area = unassignANM(id, anm_id);
    if (!area) return res.status(404).json({ error: "Area not found" });
    return res.status(200).json(area);
  } else {
    const area = assignANM(id, anm_id);
    if (!area) return res.status(404).json({ error: "Area not found" });
    return res.status(200).json(area);
  }
}
