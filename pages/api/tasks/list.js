// pages/api/tasks/list.js
import { proxyToBackend, createAuthHeaders } from "../../../utils/api";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await proxyToBackend('tasks/list', {
      method: 'GET',
      headers: createAuthHeaders(req),
    });

    if (result.ok) {
      // Backend returns { tasks: [...] }
      const tasks = result.data.tasks || [];
      return res.status(200).json(tasks);
    }

    return res.status(result.status || 500).json({
      error: result.data?.error || "Failed to fetch tasks"
    });
  } catch (error) {
    console.error("Tasks list error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
