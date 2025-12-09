// pages/api/phc/tasks-manager/[id].js
import { getTaskById, updateTask, deleteTask, listSubtasks, getSubtasksProgress } from '../../../../data/taskManagerDb';

export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const task = getTaskById(id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    const subtasks = listSubtasks(id);
    const progress = getSubtasksProgress(id);
    return res.status(200).json({ data: { ...task, subtasks, progress } });
  }
  if (req.method === 'PUT') {
    const updated = updateTask(id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ data: updated });
  }
  if (req.method === 'DELETE') {
    const ok = deleteTask(id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }
  res.setHeader('Allow','GET,PUT,DELETE');
  res.status(405).end('Method Not Allowed');
}
