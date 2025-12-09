// pages/api/phc/families/[id].js
import { proxyToBackend, createAuthHeaders } from "../../../../utils/api";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const result = await proxyToBackend(`families/${id}/full`, {
        method: 'GET',
        headers: createAuthHeaders(req),
      });

      if (result.ok) {
        // Backend returns { family, members, health_records }
        return res.status(200).json(result.data);
      }

      return res.status(result.status || 404).json({
        error: result.data?.error || "Family not found"
      });
    } catch (err) {
      console.error("Family detail error:", err);
      return res.status(500).json({ error: "Failed to fetch family" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
