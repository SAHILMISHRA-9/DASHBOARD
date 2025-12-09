import { getANM, updateANM } from "../../../../../../data/anmDb.js";
import { areas } from "../../../../../../data/areaDb.js";

export default function handler(req, res) {
  const { id } = req.query;

  const anm = getANM(id);
  if (!anm) return res.status(404).json({ error: "ANM not found" });

  const assigned = areas.filter((a) => anm.areas.includes(a.id));

  return res.status(200).json(assigned);
}
