let supervision = [
  { anm_id: 1, asha_id: 1 },
];

export function assignAshaToAnm(anm_id, asha_id) {
  supervision.push({ anm_id, asha_id });
  return true;
}

export function getASHAsUnderANM(anm_id) {
  return supervision
    .filter((s) => s.anm_id == anm_id)
    .map((s) => s.asha_id);
}
