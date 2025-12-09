// pages/api/phc/families/index.js
import { proxyToBackend, createAuthHeaders } from "../../../../utils/api";

export default async function handler(req, res) {
  if (req.method === "GET") {
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
    } catch (err) {
      console.error("Families list error:", err);
      return res.status(500).json({ error: "Failed to fetch families" });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      
      // Map frontend fields to backend fields
      const backendBody = {
        area_id: body.area_id,
        address_line: body.address || body.address_line,
        landmark: body.landmark,
      };

      if (!backendBody.area_id) {
        return res.status(400).json({ error: "area_id is required" });
      }

      const result = await proxyToBackend('families/create', {
        method: 'POST',
        body: backendBody,
        headers: createAuthHeaders(req),
      });

      if (result.ok) {
        return res.status(201).json(result.data.family || result.data);
      }

      return res.status(result.status || 500).json({
        error: result.data?.error || "Failed to create family"
      });
    } catch (err) {
      console.error("Create family error:", err);
      return res.status(500).json({ error: "Failed to create family" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
