// pages/api/pnc/detail.js
// Query param: ?id=1
export default function handler(req, res) {
  const { id } = req.query;

  // simple mock DB keyed by id
  const db = {
    "1": {
      id: 1,
      mother: {
        name: "Sunita Devi",
        age: 24,
        phone: "9876543210",
        address: "Village: Rampur, Subcenter: SC-001",
        deliveryDate: "2024-01-22",
        gravida: 2,
        parity: 1,
      },
      baby: {
        name: "Baby boy",
        dob: "2024-01-22",
        weightKg: 2.4,
        breastfeeding: "Exclusive",
        muac: 12.5,
        immunization: [
          { vaccine: "BCG", date: "2024-01-23" },
          { vaccine: "OPV0", date: "2024-01-23" }
        ]
      },
      riskFlags: [
        { code: "bleeding", label: "Postpartum bleeding", severity: "high", note: "Observed during first visit" },
        { code: "fever", label: "High fever", severity: "medium", note: "Temp 102°F" }
      ],
      visits: [
        {
          id: 101,
          date: "2024-01-23",
          type: "PNC Day 1",
          asha: "Sunita",
          vitals: { temp: "102°F", bp: "110/70" },
          notes: "Postpartum bleeding controlled, given IV fluids. Baby feeding ok.",
        },
        {
          id: 102,
          date: "2024-01-29",
          type: "PNC Day 7",
          asha: "Sunita",
          vitals: { temp: "99°F", bp: "108/68" },
          notes: "Healing well, baby weight 2.6 kg. MUAC low — nutrition advice given.",
        }
      ]
    },

    "2": {
      id: 2,
      mother: {
        name: "Kavita Kumari",
        age: 20,
        phone: "9123456780",
        address: "Village: Nandpur, Subcenter: SC-001",
        deliveryDate: "2024-02-10",
        gravida: 1,
        parity: 1,
      },
      baby: {
        name: "Baby girl",
        dob: "2024-02-10",
        weightKg: 3.0,
        breastfeeding: "Exclusive",
        muac: 14,
        immunization: [{ vaccine: "BCG", date: "2024-02-11" }]
      },
      riskFlags: [],
      visits: [
        {
          id: 201,
          date: "2024-02-11",
          type: "PNC Day 1",
          asha: "Meena",
          vitals: { temp: "98.2°F", bp: "110/70" },
          notes: "All normal. Counseled for exclusive breastfeeding.",
        }
      ]
    }
  };

  const result = db[String(id)] || null;

  if (!result) {
    return res.status(404).json({ error: "PNC record not found" });
  }

  // return object
  return res.status(200).json(result);
}
