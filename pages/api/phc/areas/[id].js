// pages/api/phc/areas/[id].js
import { getArea, updateArea, deleteArea } from "../../../../data/areaDb";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const area = getArea(id);
    if (!area) return res.status(404).json({ error: "Area not found" });
    return res.status(200).json(area);
  }

  if (req.method === "PUT") {
    const payload = req.body || {};
    const updated = updateArea(id, payload);
    if (!updated) return res.status(404).json({ error: "Area not found" });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const ok = deleteArea(id);
    if (!ok) return res.status(404).json({ error: "Area not found" });
    return res.status(200).json({ message: "Deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
