// pages/api/phc/cases/index.js
import axios from "axios";

const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL; 
// e.g. "https://asha-ehr-backend-9.onrender.com"

export default async function handler(req, res) {
  const token = req.cookies?.token; // adjust if you store token differently

  if (!backendBase) {
    return res.status(500).json({ error: "Backend URL not configured" });
  }

  if (req.method === "GET") {
    try {
      const {
        category,
        anm_id,
        asha_id,
        area_id,
        risk_level,
        date_from,
        date_to,
        q,
      } = req.query;

      const response = await axios.get(`${backendBase}/phcAdmin/cases`, {
        params: {
          category,
          anm_id,
          asha_id,
          area_id,
          risk_level,
          date_from,
          date_to,
          q,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.status(200).json(response.data);
    } catch (err) {
      console.error("API /phc/cases GET error:", err.response?.data || err.message);
      return res
        .status(err.response?.status || 500)
        .json(err.response?.data || { error: "Failed to fetch cases" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
