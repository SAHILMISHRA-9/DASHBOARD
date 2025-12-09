// data/taskManagerDb.js
// In-memory Task Manager DB for PHC Admin -> ANM -> ASHA workflows

let tasks = [];
let subtasks = [];
let nextTaskId = 1;
let nextSubtaskId = 1;

export function clearTaskManager() {
  tasks = [];
  subtasks = [];
  nextTaskId = 1;
  nextSubtaskId = 1;
}

export function listTasks({ phc_id } = {}) {
  const list = phc_id ? tasks.filter(t => t.phc_id === Number(phc_id)) : tasks.slice();
  return list.sort((a,b)=>b.created_at.localeCompare(a.created_at));
}

export function getTaskById(id) {
  return tasks.find(t => t.id === Number(id)) || null;
}

export function createTask(payload) {
  const now = new Date().toISOString();
  const t = {
    id: nextTaskId++,
    phc_id: Number(payload.phc_id) || null,
    created_by: payload.created_by || null,
    title: payload.title || 'Untitled Task',
    description: payload.description || '',
    priority: payload.priority || 'medium',
    due_date: payload.due_date || null,
    assigned_anm: payload.assigned_anm || null,
    status: 'open',
    created_at: now,
    updated_at: now
  };
  tasks.push(t);
  return t;
}

export function updateTask(id, updates = {}) {
  const idx = tasks.findIndex(t => t.id === Number(id));
  if (idx === -1) return null;
  const allowed = ['title','description','priority','due_date','assigned_anm','status','phc_id'];
  for (const k of allowed) if (k in updates) tasks[idx][k] = updates[k];
  tasks[idx].updated_at = new Date().toISOString();
  return tasks[idx];
}

export function deleteTask(id) {
  const idx = tasks.findIndex(t => t.id === Number(id));
  if (idx === -1) return false;
  subtasks = subtasks.filter(s => s.task_id !== Number(id));
  tasks.splice(idx,1);
  return true;
}

/* subtasks */
export function listSubtasks(taskId) {
  return subtasks.filter(s => s.task_id === Number(taskId)).sort((a,b)=>a.id-b.id);
}

export function createSubtask(taskId, payload) {
  const task = getTaskById(taskId);
  if (!task) throw new Error('Task not found');
  const now = new Date().toISOString();
  const s = {
    id: nextSubtaskId++,
    task_id: Number(taskId),
    title: payload.title || 'Subtask',
    assigned_asha: payload.assigned_asha || null,
    status: payload.status || 'open',
    notes: payload.notes || '',
    created_at: now,
    updated_at: now
  };
  subtasks.push(s);
  return s;
}

export function updateSubtask(id, updates = {}) {
  const idx = subtasks.findIndex(s => s.id === Number(id));
  if (idx === -1) return null;
  const allowed = ['title','assigned_asha','status','notes'];
  for (const k of allowed) if (k in updates) subtasks[idx][k] = updates[k];
  subtasks[idx].updated_at = new Date().toISOString();
  return subtasks[idx];
}

export function deleteSubtask(id) {
  const idx = subtasks.findIndex(s => s.id === Number(id));
  if (idx === -1) return false;
  subtasks.splice(idx,1);
  return true;
}

/* aggregates */
export function getTaskSummary(phc_id) {
  const list = phc_id ? tasks.filter(t => t.phc_id === Number(phc_id)) : tasks;
  const total = list.length;
  const completed = list.filter(t => t.status === 'completed').length;
  const open = total - completed;
  const byAnm = {};
  list.forEach(t => {
    const a = t.assigned_anm || 'unassigned';
    byAnm[a] = (byAnm[a] || 0) + 1;
  });
  return { total, completed, open, byAnm };
}

export function getSubtasksProgress(taskId) {
  const list = listSubtasks(taskId);
  const total = list.length;
  const completed = list.filter(s => s.status === 'completed').length;
  return { total, completed, pending: total - completed, list };
}
