import { assignAshaToAnm } from "../../../../../../data/supervisionDb.js";
import { getASHA, updateASHA } from "../../../../../../data/ashaDb.js";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { anm_id } = req.body;

  assignAshaToAnm(anm_id, id);
  updateASHA(id, { supervisor_id: anm_id });

  res.status(200).json({ success: true });
}
