// ================= SURVEY TYPES =================

let surveyTypes = [
  { id: 1, name: "Dengue Survey" },
  { id: 2, name: "TB Screening Drive" },
  { id: 3, name: "Child Vaccine Week" },
  { id: 4, name: "NCD Hypertension Screening" },
  { id: 5, name: "Immunization Pulse Campaign" }
];


// ================= SURVEY DATA =================
// FULL ORIGINAL SURVEY RESTORED (with charts + progress)

let surveys = [
  {
    id: 1,
    title: "Dengue Survey – Ward 5",
    type_id: 1,
    area_id: 1,
    description: "House-to-house dengue risk assessment.",
    start_date: "2025-01-10",
    end_date: "2025-01-20",

    // assignments
    anm_assigned: [1, 2],
    asha_assigned: [1, 2, 3],

    // summary
    total_households: 210,
    completed: 168,
    pending: 42,
    unable_to_visit: 8,
    high_risk_found: 12,

    // ⭐ REQUIRED FOR LINE CHART
    progress: [
      { date: "2025-01-10", completed: 15 },
      { date: "2025-01-11", completed: 28 },
      { date: "2025-01-12", completed: 41 },
      { date: "2025-01-13", completed: 60 },
      { date: "2025-01-14", completed: 85 },
      { date: "2025-01-15", completed: 102 },
      { date: "2025-01-16", completed: 125 },
      { date: "2025-01-17", completed: 142 },
      { date: "2025-01-18", completed: 155 },
      { date: "2025-01-19", completed: 165 },
      { date: "2025-01-20", completed: 168 }
    ],

    // ⭐ REQUIRED FOR HIGH-RISK BAR CHART
    high_risk_breakdown: [
      { anm_id: 1, count: 5 },
      { anm_id: 2, count: 7 }
    ]
  }
];


// ================= TYPE FUNCTIONS =================
export function getSurveyTypes() {
  return surveyTypes;
}

export function addSurveyType(name) {
  const newType = { id: surveyTypes.length + 1, name };
  surveyTypes.push(newType);
  return newType;
}

export function deleteSurveyType(id) {
  surveyTypes = surveyTypes.filter(t => t.id !== Number(id));
  return true;
}


// ================= SURVEY FUNCTIONS =================

export function getSurveys() {
  return surveys;
}

export function getSurvey(id) {
  return surveys.find(s => s.id === Number(id)) || null;
}

export function createSurvey(data) {
  const newSurvey = {
    id: surveys.length + 1,
    title: data.title,
    type_id: Number(data.type_id),
    area_id: data.area_id ? Number(data.area_id) : null,
    description: data.description || "",
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    anm_assigned: [],
    asha_assigned: [],

    // defaults
    total_households: 0,
    completed: 0,
    pending: 0,
    unable_to_visit: 0,
    high_risk_found: 0,

    // charts empty until updated
    progress: [],
    high_risk_breakdown: []
  };

  surveys.push(newSurvey);
  return newSurvey;
}

export function updateSurvey(id, updates) {
  const index = surveys.findIndex(s => s.id === Number(id));
  if (index === -1) return null;

  surveys[index] = { ...surveys[index], ...updates };
  return surveys[index];
}

export function deleteSurvey(id) {
  surveys = surveys.filter(s => s.id !== Number(id));
  return true;
}
