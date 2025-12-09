// pages/api/phc/tasks/index.js
import { proxyToBackend, createAuthHeaders } from '../../../../utils/api';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await proxyToBackend('tasks/list', {
        method: 'GET',
        headers: createAuthHeaders(req),
      });

      if (result.ok) {
        // Backend returns { tasks: [...] }
        const tasks = result.data.tasks || [];
        return res.status(200).json({ data: tasks });
      }

      return res.status(result.status || 500).json({
        error: result.data?.error || "Failed to fetch tasks"
      });
    } catch (err) {
      console.error("Tasks list error:", err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }

  if (req.method === 'POST') {
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
        return res.status(201).json({ data: result.data.task || result.data });
      }

      return res.status(result.status || 500).json({
        error: result.data?.error || "Failed to create task"
      });
    } catch (err) {
      console.error("Create task error:", err);
      return res.status(500).json({ error: err.message || "Failed to create task" });
    }
  }

  res.setHeader('Allow','GET,POST');
  res.status(405).end('Method Not Allowed');
}
