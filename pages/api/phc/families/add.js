// pages/api/phc/families/add.js
import { proxyToBackend, createAuthHeaders } from "../../../../utils/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
      error: result.data?.error || "Failed to add family"
    });
  } catch (err) {
    console.error("Add family error:", err);
    return res.status(500).json({ error: "Failed to add family" });
  }
}
