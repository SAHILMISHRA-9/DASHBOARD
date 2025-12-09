// pages/api/phc/tasks-manager/index.js
import { listTasks, createTask } from '../../../../data/taskManagerDb';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { phc_id } = req.query;
    const data = listTasks({ phc_id });
    return res.status(200).json({ data });
  }
  if (req.method === 'POST') {
    try {
      const t = createTask(req.body || {});
      return res.status(201).json({ data: t });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.setHeader('Allow','GET,POST');
  res.status(405).end('Method Not Allowed');
}
