let nextAnmId = 2;

let anms = {
  "1": {
    id: 1,
    name: "Savitri Devi",
    email: "savitri@example.com",
    phone: "9876543210",

    areas: [1, 2],
  },
};

export function getANMs() {
  return Object.values(anms);
}

export function getANM(id) {
  return anms[id] || null;
}

export function addANM(data) {
  const id = nextAnmId++;
  anms[id] = { id, ...data };
  return anms[id];
}

export function updateANM(id, data) {
  if (!anms[id]) return null;
  anms[id] = { ...anms[id], ...data };
  return anms[id];
}
