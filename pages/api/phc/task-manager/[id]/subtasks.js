// pages/api/phc/tasks-manager/[id]/subtasks.js
import { listSubtasks, createSubtask, updateSubtask, deleteSubtask } from '../../../../../data/taskManagerDb';

export default function handler(req, res) {
  const { id } = req.query; // task id
  if (req.method === 'GET') {
    const rows = listSubtasks(id);
    return res.status(200).json({ data: rows });
  }
  if (req.method === 'POST') {
    try {
      const s = createSubtask(id, req.body || {});
      return res.status(201).json({ data: s });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  if (req.method === 'PUT') {
    const subtaskId = req.body.subtask_id || req.body.id;
    if (!subtaskId) return res.status(400).json({ error: 'missing subtask id' });
    const updated = updateSubtask(subtaskId, req.body || {});
    if (!updated) return res.status(404).json({ error: 'not found' });
    return res.status(200).json({ data: updated });
  }
  if (req.method === 'DELETE') {
    const subtaskId = req.body.subtask_id || req.body.id;
    if (!subtaskId) return res.status(400).json({ error: 'missing subtask id' });
    const ok = deleteSubtask(subtaskId);
    if (!ok) return res.status(404).json({ error: 'not found' });
    return res.status(200).json({ success: true });
  }
  res.setHeader('Allow','GET,POST,PUT,DELETE');
  res.status(405).end('Method Not Allowed');
}
