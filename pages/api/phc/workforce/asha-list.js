import { proxyToBackend, createAuthHeaders } from "../../../../utils/api";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const payload = req.body || {};

      if (!payload.name || !payload.phone || !payload.password || !payload.areas || payload.areas.length === 0) {
        return res.status(400).json({ error: "name, phone, password, and areas[] are required" });
      }

      const backendBody = {
        name: payload.name,
        phone: payload.phone,
        role: "asha",
        password: payload.password,
        areas: payload.areas,
      };

      const result = await proxyToBackend("phc/users/create", {
        method: "POST",
        body: backendBody,
        headers: createAuthHeaders(req),
      });

      if (result.ok) {
        return res.status(201).json(result.data);
      }

      return res.status(result.status || 500).json({
        error: result.data?.error || "Failed to create ASHA",
      });
    } catch (err) {
      console.error("Create ASHA error:", err);
      return res.status(500).json({ error: "Failed to create ASHA" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
