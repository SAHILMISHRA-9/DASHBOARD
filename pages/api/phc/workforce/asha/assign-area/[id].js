import { getASHA, updateASHA } from "../../../../../../data/ashaDb.js";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { area_id } = req.body;

  updateASHA(id, { area_id });

  res.status(200).json({ success: true });
}
