import { getANMs, addANM } from "../../../../data/anmDb.js";


export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(getANMs());
  }

  if (req.method === "POST") {
    const newAnm = addANM(req.body);
    return res.status(201).json(newAnm);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
