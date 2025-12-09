// pages/api/phc/areas/index.js
import { proxyToBackend, createAuthHeaders } from "../../../../utils/api";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await proxyToBackend('phcs/areas/list', {
        method: 'GET',
        headers: createAuthHeaders(req),
      });

      if (result.ok) {
        // Backend returns { areas: [...] }
        const areas = result.data.areas || [];
        return res.status(200).json(areas);
      }

      return res.status(result.status || 500).json({
        error: result.data?.error || "Failed to fetch areas"
      });
    } catch (err) {
      console.error("Areas list error:", err);
      return res.status(500).json({ error: "Failed to fetch areas" });
    }
  }

  if (req.method === "POST") {
    try {
      const payload = req.body || {};
      
      if (!payload.name && !payload.area_name) {
        return res.status(400).json({ error: "name or area_name required" });
      }

      const backendBody = {
        area_name: payload.area_name || payload.name,
      };

      const result = await proxyToBackend('phcs/areas/create', {
        method: 'POST',
        body: backendBody,
        headers: createAuthHeaders(req),
      });

      if (result.ok) {
        const created = result.data.area || result.data;
        if (created?.id) {
          // Log area id for visibility in server logs / terminal
          console.log("Created area id:", created.id);
        }
        return res.status(201).json(result.data.area || result.data);
      }

      return res.status(result.status || 500).json({
        error: result.data?.error || "Failed to create area"
      });
    } catch (err) {
      console.error("Create area error:", err);
      return res.status(500).json({ error: "Failed to create area" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
