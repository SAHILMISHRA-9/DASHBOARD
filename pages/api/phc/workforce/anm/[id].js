import { getANM, updateANM } from "../../../../../data/anmDb.js";


export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const anm = getANM(id);
    if (!anm) return res.status(404).json({ error: "ANM not found" });
    return res.status(200).json(anm);
  }

  if (req.method === "PUT") {
    const updated = updateANM(id, req.body);
    if (!updated) return res.status(404).json({ error: "ANM not found" });
    return res.status(200).json(updated);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
