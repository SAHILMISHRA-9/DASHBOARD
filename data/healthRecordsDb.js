// data/healthRecordsDb.js
// Simple in-memory DB for health records / case monitoring

let nextId = 1;

let records = [
  // sample
  {
    id: nextId++,
    category: "ANC", // ANC | PNC | CHILD | TB | NCD
    patient_name: "Sita Devi",
    age: 26,
    anm_id: 1,
    asha_id: 1,
    area_id: 1,
    status: "open", // open | closed | referred
    risk_level: "medium", // low | medium | high
    notes: [
      { id: 1, text: "Initial visit - BP normal", by: "ANM 1", date: new Date().toISOString() }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helpers
export function getCases({ category, anm_id, asha_id, area_id, risk_level, date_from, date_to, q }) {
  let list = records.slice();

  if (category) list = list.filter(r => r.category === category);
  if (anm_id) list = list.filter(r => Number(r.anm_id) === Number(anm_id));
  if (asha_id) list = list.filter(r => Number(r.asha_id) === Number(asha_id));
  if (area_id) list = list.filter(r => Number(r.area_id) === Number(area_id));
  if (risk_level) list = list.filter(r => r.risk_level === risk_level);
  if (q) {
    const qq = q.toLowerCase();
    list = list.filter(r => (r.patient_name || "").toLowerCase().includes(qq));
  }
  if (date_from) {
    const from = new Date(date_from);
    list = list.filter(r => new Date(r.created_at) >= from);
  }
  if (date_to) {
    const to = new Date(date_to);
    list = list.filter(r => new Date(r.created_at) <= to);
  }
  // newest first
  list.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  return list;
}

export function getCase(id) {
  return records.find(r => r.id === Number(id)) || null;
}

export function createCase(data) {
  const rec = {
    id: nextId++,
    category: data.category || "ANC",
    patient_name: data.patient_name || "Unknown",
    age: data.age ? Number(data.age) : null,
    anm_id: data.anm_id ? Number(data.anm_id) : null,
    asha_id: data.asha_id ? Number(data.asha_id) : null,
    area_id: data.area_id ? Number(data.area_id) : null,
    status: data.status || "open",
    risk_level: data.risk_level || "low",
    notes: data.notes || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  records.push(rec);
  return rec;
}

export function updateCase(id, updates) {
  const idx = records.findIndex(r => r.id === Number(id));
  if (idx === -1) return null;
  const curr = records[idx];
  // merge allowed fields
  const allowed = ["patient_name","age","anm_id","asha_id","area_id","status","risk_level"];
  for (const k of allowed) {
    if (k in updates) curr[k] = updates[k];
  }
  // notes: if provided as { add: {text,by} } or { set: [...] }
  if (updates.notes) {
    if (Array.isArray(updates.notes)) {
      curr.notes = updates.notes;
    } else if (updates.notes.add) {
      const note = { id: (curr.notes.length? curr.notes[curr.notes.length-1].id+1:1), text: updates.notes.add.text, by: updates.notes.add.by || "system", date: new Date().toISOString() };
      curr.notes.push(note);
    }
  }
  curr.updated_at = new Date().toISOString();
  records[idx] = curr;
  return curr;
}

export function deleteCase(id) {
  const before = records.length;
  records = records.filter(r => r.id !== Number(id));
  return records.length !== before;
}

export function getHighRiskCases() {
  return records.filter(r => r.risk_level === "high").slice().sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
}
