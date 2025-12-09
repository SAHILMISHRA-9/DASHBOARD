// utils/db.js
// Enhanced in-memory DB for Doctor Portal demo.
// Keeps simple .query(sql, params) behavior used by APIs.
// NOTE: Replace with real DB later.

const nowISO = () => new Date().toISOString();
const daysAgoISO = (d) => new Date(Date.now() - d*24*60*60*1000).toISOString();

// --- seed lookup tables
const areas = [
  { id: 301, name: "Rampur" },
  { id: 302, name: "Nandpur" },
  { id: 303, name: "Hatpipliya" },
];

const asha = [
  { id: 21, name: "Radha" },
  { id: 22, name: "Geeta" },
  { id: 23, name: "Suman" },
];

const families = [
  { id: 101, name: "Sharma", area_id: 301 },
  { id: 102, name: "Kumar", area_id: 302 },
  { id: 103, name: "Singh", area_id: 303 },
  { id: 104, name: "Devi", area_id: 301 },
];

// family members / children
const family_members = [
  { id: 1001, family_id: 101, name: "Sita Devi", age: 27, gender: "F" },
  { id: 1002, family_id: 102, name: "Raju Kumar", age: 2, gender: "M" },
  { id: 1003, family_id: 103, name: "Mohit", age: 35, gender: "M" },
  { id: 1004, family_id: 104, name: "Radha", age: 30, gender: "F" },
  { id: 1005, family_id: 101, name: "Baby A", age: 0, gender: "M" },
];

// --- health records (generic visits / cases)
const health_records = [
  // ANC entries
  { id: 1, phc_id:1, family_id:101, member_id:1001, member_name:"Sita Devi", case_type:"ANC", anm_id:11, asha_id:21, area_id:301, created_at: daysAgoISO(5),
    data_json: { risk_level:"high", category:"pregnancy", risk_reason:"Severe anemia (Hb 6.2)", trimester:2, status:"due" } },
  { id: 2, phc_id:1, family_id:101, member_id:1001, member_name:"Sita Devi", case_type:"ANC", anm_id:11, asha_id:21, area_id:301, created_at: daysAgoISO(40),
    data_json: { risk_level:"normal", category:"pregnancy", trimester:1, status:"completed" } },

  // PNC entries
  { id: 10, phc_id:1, family_id:104, member_id:1004, member_name:"Radha", case_type:"PNC", anm_id:11, asha_id:21, area_id:301, created_at: daysAgoISO(7),
    data_json: { risk_level:"normal", category:"pnc", status:"completed" } },

  // Child immunization / child cases
  { id: 20, phc_id:1, family_id:102, member_id:1002, member_name:"Raju Kumar", case_type:"Child", anm_id:12, asha_id:22, area_id:302, created_at: daysAgoISO(3),
    data_json: { risk_level:"high", category:"child", risk_reason:"MUAC 10.8 cm", vaccinated:true, vaccine_name:"BCG", vaccine_status:"done" } },
  { id: 21, phc_id:1, family_id:101, member_id:1005, member_name:"Baby A", case_type:"Child", anm_id:11, asha_id:21, area_id:301, created_at: daysAgoISO(20),
    data_json: { risk_level:"normal", category:"child", vaccinated:false, vaccine_name:"DPT", vaccine_status:"missed" } },

  // General cases (fever/viral/ncd)
  { id: 30, phc_id:1, family_id:103, member_id:1003, member_name:"Mohit", case_type:"General", anm_id:13, asha_id:23, area_id:303, created_at: daysAgoISO(2),
    data_json: { risk_level:"normal", category:"fever", risk_reason:"Fever 3 days" } },
  { id: 31, phc_id:1, family_id:103, member_id:1003, member_name:"Mohit", case_type:"General", anm_id:13, asha_id:23, area_id:303, created_at: daysAgoISO(15),
    data_json: { risk_level:"low", category:"viral", risk_reason:"Viral symptoms" } },
  { id: 32, phc_id:1, family_id:104, member_id:1004, member_name:"Radha", case_type:"NCD", anm_id:11, asha_id:21, area_id:301, created_at: daysAgoISO(1),
    data_json: { risk_level:"emergency", category:"ncd", risk_reason:"BP 200/120", bp:200, sugar:180 } },

  // TB suspect
  { id: 40, phc_id:1, family_id:103, member_id:1003, member_name:"Mohit", case_type:"TB", anm_id:13, asha_id:23, area_id:303, created_at: daysAgoISO(12),
    data_json: { risk_level:"high", category:"tb", risk_reason:"Cough > 3 weeks" } },
];

// ancillary tables for richer results
const pregnancy_anc = [
  { id: 1, member_id: 1001, phc_id:1, status:"due", risk_level:"high", trimester:2, last_visit: daysAgoISO(5) },
  { id: 2, member_id: 1001, phc_id:1, status:"completed", risk_level:"normal", trimester:1, last_visit: daysAgoISO(40) },
];

const pnc_visits = [
  { id: 1, member_id: 1004, phc_id:1, status:"completed", risk_level:"normal", last_visit: daysAgoISO(7) }
];

const child_immunization = [
  { id:1, child_id:1002, phc_id:1, vaccine:"BCG", status:"done", given_on: daysAgoISO(3) },
  { id:2, child_id:1005, phc_id:1, vaccine:"DPT", status:"missed", given_on: null },
];

const high_risk_cases = [
  { id:1, patient_id:1001, phc_id:1, case_type:"ANC", case_reason:"Severe anemia", case_domain:"pregnancy", asha_id:21, last_visit: daysAgoISO(5) },
  { id:2, patient_id:1002, phc_id:1, case_type:"Child", case_reason:"MUAC 10.8 cm", case_domain:"child", asha_id:22, last_visit: daysAgoISO(3) },
  { id:3, patient_id:1003, phc_id:1, case_type:"TB", case_reason:"Cough >3 weeks", case_domain:"tb", asha_id:23, last_visit: daysAgoISO(12) },
  { id:4, patient_id:1004, phc_id:1, case_type:"NCD", case_reason:"BP 200/120", case_domain:"ncd", asha_id:21, last_visit: daysAgoISO(1) },
];

const children = [
  { id:1002, family_member_id:1002, full_name:"Raju Kumar", age:2, phc_id:1 },
  { id:1005, family_member_id:1005, full_name:"Baby A", age:0, phc_id:1 },
];

const visits = [
  // combine many visits for last 60 days
  { id:100, member_id:1001, family_id:101, case_type:"ANC", visit_date: daysAgoISO(5), risk_level:"high", asha_id:21, area_id:301 },
  { id:101, member_id:1001, family_id:101, case_type:"ANC", visit_date: daysAgoISO(40), risk_level:"normal", asha_id:21, area_id:301 },
  { id:110, member_id:1004, family_id:104, case_type:"PNC", visit_date: daysAgoISO(7), risk_level:"normal", asha_id:21, area_id:301 },
  { id:120, member_id:1002, family_id:102, case_type:"Child", visit_date: daysAgoISO(3), risk_level:"high", asha_id:22, area_id:302 },
  { id:121, member_id:1005, family_id:101, case_type:"Child", visit_date: daysAgoISO(20), risk_level:"normal", asha_id:21, area_id:301 },
  { id:130, member_id:1003, family_id:103, case_type:"General", visit_date: daysAgoISO(2), risk_level:"normal", asha_id:23, area_id:303 },
  { id:131, member_id:1003, family_id:103, case_type:"TB", visit_date: daysAgoISO(12), risk_level:"high", asha_id:23, area_id:303 },
];

// helper: deep clone
const clone = (v) => JSON.parse(JSON.stringify(v));

// simple query parser: detect table name
function detectTable(sql) {
  if (!sql) return null;
  const s = sql.toString().toLowerCase();
  const m = s.match(/from\s+([a-z0-9_]+)/);
  if (m) return m[1];
  // allow direct name
  if (s.includes("health_records")) return "health_records";
  return null;
}

export default {
  query: async (sql = "", params = []) => {
    // return [rows] to mimic mysql2
    const table = detectTable(sql) || (typeof sql === "string" ? sql.toString().toLowerCase() : null);
    const phc_id = params && params.length ? Number(params[0]) : null;

    // handle count(*) requests
    const s = String(sql || "").toLowerCase();
    if (s.includes("count(") || s.includes("count *") || s.includes("count(*)")) {
      // if table mention present -> return count
      const t = detectTable(sql);
      if (t === "visits") return [[{ cnt: visits.length }]];
      if (t === "pregnancy_anc") return [[{ cnt: pregnancy_anc.length }]];
      if (t === "pnc_visits") return [[{ cnt: pnc_visits.length }]];
      if (t === "child_immunization") return [[{ cnt: child_immunization.length }]];
      if (t === "high_risk_cases") return [[{ cnt: high_risk_cases.length }]];
      // default
      return [[{ cnt: 0 }]];
    }

    switch (table) {
      case "areas": return [clone(areas)];
      case "asha": return [clone(asha)];
      case "families": return [clone(families)];
      case "family_members": return [clone(family_members)];
      case "health_records": return [clone(health_records.filter(r => phc_id ? r.phc_id === phc_id : true))];
      case "pregnancy_anc": return [clone(pregnancy_anc.filter(r => phc_id ? r.phc_id === phc_id : true))];
      case "pnc_visits": return [clone(pnc_visits.filter(r => phc_id ? r.phc_id === phc_id : true))];
      case "child_immunization": return [clone(child_immunization.filter(r => phc_id ? r.phc_id === phc_id : true))];
      case "children": return [clone(children)];
      case "high_risk_cases": return [clone(high_risk_cases.filter(r => phc_id ? r.phc_id === phc_id : true))];
      case "visits": return [clone(visits.filter(r => phc_id ? r.phc_id === phc_id : true))];
      default:
        // if caller supplied 'visits' shorthand
        if (sql === "visits") return [clone(visits)];
        if (sql === "health_records") return [clone(health_records)];
        // fallback empty
        return [[]];
    }
  }
};
