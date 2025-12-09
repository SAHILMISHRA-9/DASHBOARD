// pages/api/phc/tasks/[id].js
import { proxyToBackend, createAuthHeaders } from "../../../../utils/api";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const updates = req.body || {};
      
      // Map frontend fields to backend fields
      const backendBody = {
        status: updates.status,
        description: updates.description,
        due_date: updates.due_date || updates.dueDate,
        data_json: updates.data_json || updates.data,
      };

      // Remove undefined fields
      Object.keys(backendBody).forEach(key => 
        backendBody[key] === undefined && delete backendBody[key]
      );

      const result = await proxyToBackend(`tasks/${id}`, {
        method: 'PUT',
        body: backendBody,
        headers: createAuthHeaders(req),
      });

      if (result.ok) {
        return res.status(200).json(result.data.task || result.data);
      }

      return res.status(result.status || 404).json({
        error: result.data?.error || "Task not found"
      });
    } catch (err) {
      console.error("Update task error:", err);
      return res.status(500).json({ error: "Failed to update task" });
    }
  }

  if (req.method === "GET") {
    try {
      // Backend doesn't have a single task endpoint, so we'll get from list
      // For now, return error or fetch from list
      const result = await proxyToBackend('tasks/list', {
        method: 'GET',
        headers: createAuthHeaders(req),
      });

      if (result.ok) {
        const tasks = result.data.tasks || [];
        const task = tasks.find(t => t.id === id);
        if (task) {
          return res.status(200).json(task);
        }
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(result.status || 500).json({
        error: result.data?.error || "Failed to fetch task"
      });
    } catch (err) {
      console.error("Get task error:", err);
      return res.status(500).json({ error: "Failed to fetch task" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
