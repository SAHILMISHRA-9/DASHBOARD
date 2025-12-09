// data/familyDb.js
// Temporary in-memory DB for families and members

let families = [
  { id: 1, area_id: 1, address: "House 12, Ward 5", asha_id: 1, anm_id: 1 },
  { id: 2, area_id: 1, address: "House 44, Ward 5", asha_id: 2, anm_id: 1 }
];

let familyMembers = [
  { id: 1, family_id: 1, name: "Rita Devi", age: 28, gender: "Female" },
  { id: 2, family_id: 1, name: "Sohan Kumar", age: 32, gender: "Male" },
  { id: 3, family_id: 1, name: "Baby Pooja", age: 1, gender: "Female" },
  { id: 4, family_id: 2, name: "Meera Kumari", age: 22, gender: "Female" },
  { id: 5, family_id: 2, name: "Raghav", age: 2, gender: "Male" }
];

let visits = [
  { id: 1, family_id: 1, member_id: 1, date: "2025-01-10", purpose: "ANC checkup" },
  { id: 2, family_id: 1, member_id: 3, date: "2025-02-02", purpose: "Child immunization" }
];

let cases = [
  { id: 1, family_id: 1, member_id: 1, category: "ANC", risk_level: "high", created_at: "2025-01-10", updated_at: "2025-01-10", notes: "" },
  { id: 2, family_id: 2, member_id: 4, category: "NCD", risk_level: "normal", created_at: "2025-02-15", updated_at: "2025-02-15", notes: "" }
];

// Helpers to compute stats
export function getAllFamilies() {
  return families.map(f => {
    const members = familyMembers.filter(m => m.family_id === f.id);
    const familyCases = cases.filter(c => c.family_id === f.id);
    const familyVisits = visits.filter(v => v.family_id === f.id);

    return {
      ...f,
      member_count: members.length,
      case_count: familyCases.length,
      visit_count: familyVisits.length
    };
  });
}

export function getFamily(id) {
  const fam = families.find(f => f.id === Number(id));
  if (!fam) return null;

  const members = familyMembers.filter(m => m.family_id === fam.id);
  const familyCases = cases.filter(c => c.family_id === fam.id);
  const familyVisits = visits.filter(v => v.family_id === fam.id);

  return {
    ...fam,
    members,
    cases: familyCases,
    visits: familyVisits
  };
}

export function getMember(id) {
  const mem = familyMembers.find(m => m.id === Number(id));
  if (!mem) return null;

  const fam = families.find(f => f.id === mem.family_id) || null;
  const memberCases = cases.filter(c => c.member_id === mem.id);
  const memberVisits = visits.filter(v => v.member_id === mem.id);

  return {
    ...mem,
    family: fam,
    cases: memberCases,
    visits: memberVisits
  };
}

// Small create/update utilities (useful later)
export function addFamily(data) {
  const newF = {
    id: families.length + 1,
    area_id: data.area_id || null,
    address: data.address || "",
    asha_id: data.asha_id || null,
    anm_id: data.anm_id || null
  };
  families.push(newF);
  return newF;
}

export function addMember(data) {
  const newM = {
    id: familyMembers.length + 1,
    family_id: Number(data.family_id),
    name: data.name,
    age: data.age || null,
    gender: data.gender || null
  };
  familyMembers.push(newM);
  return newM;
}

// -------------------- CASES (health records) --------------------
// Add / read / update / delete case records (used by /api/phc/cases/*)

export function getCase(caseId) {
  return cases.find(c => c.id === Number(caseId)) || null;
}

export function addCase(data) {
  const newCase = {
    id: cases.length + 1,
    family_id: Number(data.family_id),
    member_id: data.member_id ? Number(data.member_id) : null,
    category: data.category || "General",
    risk_level: data.risk_level || "normal",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: data.notes || ""
  };
  cases.push(newCase);
  return newCase;
}

export function updateCase(caseId, updates) {
  const idx = cases.findIndex(c => c.id === Number(caseId));
  if (idx === -1) return null;
  cases[idx] = { ...cases[idx], ...updates, updated_at: new Date().toISOString() };
  return cases[idx];
}

export function deleteCase(caseId) {
  const idx = cases.findIndex(c => c.id === Number(caseId));
  if (idx === -1) return false;
  cases.splice(idx, 1);
  return true;
}

// Expose internal arrays for dev/debug if needed
export function _debug_lists() {
  return { families, familyMembers, visits, cases };
}
