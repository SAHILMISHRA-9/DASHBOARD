// data/highRiskDb.js
let highRiskCases = [];
let nextHighRiskId = 1;

export function createHighRiskCase({ survey_id, task_id, household_index = null, asha_id = null, anm_id = null, risk_type = "survey-reported", comments = "" }) {
  const entry = {
    id: nextHighRiskId++,
    survey_id: Number(survey_id),
    task_id: Number(task_id),
    household_index,
    asha_id: asha_id ? Number(asha_id) : null,
    anm_id: anm_id ? Number(anm_id) : null,
    risk_type,
    comments,
    created_at: new Date().toISOString()
  };
  highRiskCases.push(entry);
  return entry;
}

export function listHighRiskCases() {
  return highRiskCases.slice().sort((a,b) => b.id - a.id);
}

export function getHighRiskCase(id) {
  return highRiskCases.find(h => h.id === Number(id)) || null;
}
