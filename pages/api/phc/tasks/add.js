// pages/api/phc/tasks/add.js
import { proxyToBackend, createAuthHeaders } from "../../../../utils/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    
    // Map frontend fields to backend fields
    const backendBody = {
      asha_worker_id: body.asha_worker_id || body.asha_id,
      family_id: body.family_id,
      member_id: body.member_id,
      task_type: body.task_type || body.type || 'GENERAL',
      title: body.title,
      description: body.description,
      due_date: body.due_date || body.dueDate,
      data_json: body.data_json || body.data,
    };

    if (!backendBody.asha_worker_id || !backendBody.title) {
      return res.status(400).json({ error: "asha_worker_id and title are required" });
    }

    const result = await proxyToBackend('tasks/create', {
      method: 'POST',
      body: backendBody,
      headers: createAuthHeaders(req),
    });

    if (result.ok) {
      return res.status(201).json(result.data.task || result.data);
    }

    return res.status(result.status || 500).json({
      error: result.data?.error || "Failed to add task"
    });
  } catch (err) {
    console.error("Task add error:", err);
    return res.status(500).json({ error: "Failed to add task" });
  }
}
