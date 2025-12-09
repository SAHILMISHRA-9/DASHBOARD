import { getASHA, updateASHA } from "../../../../../data/ashaDb.js";


export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const asha = getASHA(id);
    if (!asha) return res.status(404).json({ error: "ASHA not found" });
    return res.status(200).json(asha);
  }

  if (req.method === "PUT") {
    const updated = updateASHA(id, req.body);
    if (!updated) return res.status(404).json({ error: "ASHA not found" });
    return res.status(200).json(updated);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
