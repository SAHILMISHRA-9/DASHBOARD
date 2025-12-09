import { getASHA, updateASHA } from "../../../../../../data/ashaDb";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const asha = getASHA(Number(id));

  if (!asha) {
    return res.status(404).json({ error: "ASHA not found" });
  }

  const newStatus = !asha.is_active;

  const updated = updateASHA(Number(id), { is_active: newStatus });

  return res.status(200).json({
    message: "Status updated",
    is_active: newStatus,
  });
}
