let nextAshaId = 2;

let ashas = {
  "1": {
    id: 1,
    name: "Sunita Kumari",
    email: "sunita@example.com",
    phone: "9871112222",
    supervisor_id: 1,
    area_id: 1,
    is_active: true,
  },
};

export function getASHAs() {
  return Object.values(ashas);
}

export function getASHA(id) {
  return ashas[id] || null;
}

export function addASHA(data) {
  const id = nextAshaId++;
  ashas[id] = { id, ...data };
  return ashas[id];
}

export function updateASHA(id, data) {
  if (!ashas[id]) return null;
  ashas[id] = { ...ashas[id], ...data };
  return ashas[id];
}
