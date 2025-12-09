// pages/api/family/list.js
import { proxyToBackend, createAuthHeaders } from "../../../utils/api";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await proxyToBackend('families/list', {
      method: 'GET',
      headers: createAuthHeaders(req),
    });

    if (result.ok) {
      // Backend returns { families: [...] }
      const families = result.data.families || [];
      return res.status(200).json(families);
    }

    return res.status(result.status || 500).json({
      error: result.data?.error || "Failed to fetch families"
    });
  } catch (error) {
    console.error("Family list error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
