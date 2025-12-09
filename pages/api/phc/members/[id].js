// pages/api/phc/members/[id].js
// Note: Backend doesn't have a direct member detail endpoint
// Members are accessed via families/:id/full or families/byFamily/:family_id
import { proxyToBackend, createAuthHeaders } from "../../../../utils/api";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      // Since backend doesn't have direct member endpoint,
      // we'll need to search through families
      // For now, return a helpful error or implement a workaround
      return res.status(501).json({ 
        error: "Direct member lookup not available. Use families/:id/full endpoint instead." 
      });
    } catch (err) {
      console.error("Member detail error:", err);
      return res.status(500).json({ error: "Failed to fetch member" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
