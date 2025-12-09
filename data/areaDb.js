let areas = [
  { id: 1, name: "Rampur", description: "Rampur village", coverage: 52, anm_ids: [1], asha_ids: [1] },
  { id: 2, name: "Nandpur", description: "Nandpur hamlet", coverage: 30, anm_ids: [], asha_ids: [] }
];

let nextId = areas.length + 1;

export function getAreas() {
  return [...areas];
}

export function getArea(id) {
  return areas.find(a => a.id === Number(id)) || null;
}

export function createArea(payload) {
  const area = {
    id: nextId++,
    name: payload.name || "New area",
    description: payload.description || "",
    coverage: payload.coverage ?? 0,
    anm_ids: payload.anm_ids ? [...payload.anm_ids] : [],
    asha_ids: payload.asha_ids ? [...payload.asha_ids] : []
  };
  areas.push(area);
  return area;
}

export function updateArea(id, updates) {
  const idx = areas.findIndex(a => a.id === Number(id));
  if (idx === -1) return null;
  areas[idx] = { ...areas[idx], ...updates };
  return areas[idx];
}

export function deleteArea(id) {
  const idx = areas.findIndex(a => a.id === Number(id));
  if (idx === -1) return false;
  areas.splice(idx, 1);
  return true;
}

export function assignANM(areaId, anmId) {
  const area = getArea(areaId);
  if (!area) return null;
  if (!area.anm_ids.includes(Number(anmId))) area.anm_ids.push(Number(anmId));
  return area;
}

export function unassignANM(areaId, anmId) {
  const area = getArea(areaId);
  if (!area) return null;
  area.anm_ids = area.anm_ids.filter(x => x !== Number(anmId));
  return area;
}

export function assignASHA(areaId, ashaId) {
  const area = getArea(areaId);
  if (!area) return null;
  if (!area.asha_ids.includes(Number(ashaId))) area.asha_ids.push(Number(ashaId));
  return area;
}

export function unassignASHA(areaId, ashaId) {
  const area = getArea(areaId);
  if (!area) return null;
  area.asha_ids = area.asha_ids.filter(x => x !== Number(ashaId));
  return area;
}

// ➕ ADD THIS EXPORT
export { areas };
