// data/tasksDb.js
// In-memory tasks DB for surveys

import { updateSurvey, getSurvey } from "./surveyDb";

// Tasks structure:
// {
//   id, survey_id, household_index, area_id,
//   assigned_asha: null|id, assigned_anm: null|id,
//   status: "pending"|"completed",
//   high_risk: false,
//   created_at: ISOString
// }

let tasks = [];
let nextTaskId = 1;

// ----------------- CORE CRUD -----------------
export function addTask(data) {
  const t = {
    id: nextTaskId++,
    survey_id: data.survey_id || null,
    family_id: data.family_id || null,
    member_id: data.member_id || null,
    assigned_asha: data.assigned_asha || null,
    assigned_anm: data.assigned_anm || null,
    status: "pending",
    high_risk: false,
    created_at: new Date().toISOString()
  };

  tasks.push(t);
  return t;
}

export function createTasksForSurvey(surveyId, areaId, count) {
  const survey = getSurvey(surveyId);
  if (!survey) throw new Error("Survey not found");

  const created = [];
  const startIndex = (survey.total_households || 0) + 1;
  for (let i = 0; i < count; i++) {
    const t = {
      id: nextTaskId++,
      survey_id: Number(surveyId),
      household_index: startIndex + i,
      area_id: areaId || survey.area_id || null,
      assigned_asha: null,
      assigned_anm: null,
      status: "pending",
      high_risk: false,
      created_at: new Date().toISOString(),
    };
    tasks.push(t);
    created.push(t);
  }

  // update survey totals
  const total = (survey.total_households || 0) + created.length;
  const pending = (survey.pending || 0) + created.length;
  updateSurvey(surveyId, { total_households: total, pending });

  return created;
}

export function getTasksForSurvey(surveyId) {
  const list = tasks.filter(t => t.survey_id === Number(surveyId));
  const total = list.length;
  const completed = list.filter(t => t.status === "completed").length;
  const pending = total - completed;
  const highRisk = list.filter(t => t.high_risk).length;

  return {
    total,
    completed,
    pending,
    highRisk,
    list: list.sort((a,b) => a.id - b.id)
  };
}

export function getTask(id) {
  return tasks.find(t => t.id === Number(id)) || null;
}

export function listAllTasks() {
  return tasks.slice();
}

export function clearTasks() {
  tasks = [];
  nextTaskId = 1;
}

// ----------------- UPDATE (keeps survey in sync) -----------------

export function updateTask(id, updates) {
  const idx = tasks.findIndex(t => t.id === Number(id));
  if (idx === -1) return null;

  // Only allow known fields
  const allowed = ["status", "high_risk", "assigned_asha", "assigned_anm", "area_id"];
  const payload = {};
  for (const k of allowed) if (k in updates) payload[k] = updates[k];

  tasks[idx] = { ...tasks[idx], ...payload };

  // Recalc summary and update survey
  const surveyId = tasks[idx].survey_id;
  const summary = getTasksForSurvey(surveyId);
  updateSurvey(surveyId, {
    total_households: summary.total,
    completed: summary.completed,
    pending: summary.pending,
    high_risk_found: summary.highRisk
  });

  return tasks[idx];
}

// ----------------- ASHA / ANM helpers -----------------

export function getTasksForAsha(ashaId) {
  const list = tasks.filter(t => t.assigned_asha === Number(ashaId));
  const completed = list.filter(t => t.status === "completed").length;
  const pending = list.filter(t => t.status !== "completed").length;
  return { count: list.length, completed, pending, list: list.sort((a,b)=>a.id-b.id) };
}

export function assignANMToTasks(surveyId, anmId) {
  const updated = [];
  tasks.forEach(t => {
    if (t.survey_id === Number(surveyId)) {
      t.assigned_anm = Number(anmId);
      updated.push(t);
    }
  });
  return updated;
}

/**
 * Assign ASHA to tasks of a survey.
 * - mode: "auto" → evenly distribute among provided ashaIds
 * - mode: "manual" → mapping { taskId: ashaId }
 */
export function assignASHAtoSurveyTasks(surveyId, { mode = "auto", ashaIds = [], mapping = {} } = {}) {
  const list = tasks.filter(t => t.survey_id === Number(surveyId));
  const assignments = [];

  if (mode === "auto") {
    if (!Array.isArray(ashaIds) || ashaIds.length === 0) return { assignedCount: 0, assignments: [] };
    let idx = 0;
    for (const t of list) {
      if (!t.assigned_asha) {
        const a = Number(ashaIds[idx % ashaIds.length]);
        t.assigned_asha = a;
        assignments.push({ taskId: t.id, ashaId: a });
        idx++;
      }
    }
  } else if (mode === "manual") {
    for (const t of list) {
      const m = mapping[t.id];
      if (m) {
        t.assigned_asha = Number(m);
        assignments.push({ taskId: t.id, ashaId: Number(m) });
      }
    }
  }

  // Update survey summary after assignments (counts unchanged, but pending/all okay)
  if (list.length > 0) {
    const summary = getTasksForSurvey(surveyId);
    updateSurvey(surveyId, {
      total_households: summary.total,
      completed: summary.completed,
      pending: summary.pending,
      high_risk_found: summary.highRisk
    });
  }

  return { assignedCount: assignments.length, assignments };
}

/**
 * Bulk update tasks - updates is array of { id, payload }
 */
export function bulkUpdateTasks(updates = []) {
  const result = [];
  updates.forEach(u => {
    const t = updateTask(u.id, u.payload || {});
    if (t) result.push(t);
  });
  return result;
}
