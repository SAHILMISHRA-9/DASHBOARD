import {
  getPerformance,
  createPerformance,
  updatePerformance
} from "../../../../../data/performanceDb";


export default function handler(req, res) {
  const { id } = req.query;

  // GET – fetch performance
  if (req.method === "GET") {
    let data = getPerformance(id);

    // If no record exists, create a new one
    if (!data) {
      data = createPerformance(id);
    }

    return res.status(200).json(data);
  }

  // PUT – update performance
  if (req.method === "PUT") {
    const payload = req.body;
    const updated = updatePerformance(id, {
      ...payload,
      last_updated: new Date().toISOString(),
    });

    if (!updated) {
      return res.status(404).json({ error: "ASHA performance not found" });
    }

    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
