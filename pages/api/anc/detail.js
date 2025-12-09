export default function handler(req, res) {
  const { id } = req.query;

  const db = {
    "1": {
      id: 1,
      mother: {
        name: "Rekha Devi",
        age: 26,
        phone: "9876543210",
        address: "Village: Rampur, Subcenter SC-001",
        lmp: "2024-03-10",
        edd: "2024-12-15",
        trimester: "2nd",
        gravida: 2,
        parity: 1,
      },
      riskFlags: [
        { severity: "high", label: "Severe anemia (HB 6.5)", note: "Immediate attention required" },
        { severity: "medium", label: "High BP (140/100)", note: "Observed last ANC visit" }
      ],
      visits: [
        {
          id: 301,
          date: "2024-04-02",
          bp: "140/100",
          hb: "6.5",
          weight: "52 kg",
          fetalMovement: "Normal",
          symptoms: "Fatigue, dizziness",
          notes: "Iron dose given",
          asha: "Sunita"
        },
        {
          id: 302,
          date: "2024-05-10",
          bp: "130/90",
          hb: "7.8",
          weight: "54 kg",
          fetalMovement: "Normal",
          symptoms: "Improved energy",
          notes: "HB improving",
          asha: "Sunita"
        }
      ]
    },

    "2": {
      id: 2,
      mother: {
        name: "Suman Kumari",
        age: 22,
        phone: "9123456780",
        address: "Village: Nandpur, Subcenter SC-001",
        lmp: "2024-04-05",
        edd: "2025-01-10",
        trimester: "1st",
        gravida: 1,
        parity: 0,
      },
      riskFlags: [],
      visits: [
        {
          id: 401,
          date: "2024-04-28",
          bp: "118/72",
          hb: "10.2",
          weight: "49 kg",
          fetalMovement: "-",
          symptoms: "Nausea",
          notes: "Prescribed ORS",
          asha: "Meena"
        }
      ]
    }
  };

  const record = db[String(id)] || null;

  if (!record) {
    return res.status(404).json({ error: "ANC record not found" });
  }

  res.status(200).json(record);
}
