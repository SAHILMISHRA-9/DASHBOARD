import db from "../../../utils/db"; // adjust path if needed

export default async function handler(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT id, family_id, member_id, asha_id, anm_id, case_type,
              risk_level, data_json, created_at
       FROM health_records
       WHERE risk_level IN ('high', 'emergency')
       ORDER BY created_at DESC`
    );

    // Grouping logic based on case_type
    const grouped = {
      pregnancy: [],
      child: [],
      tb: [],
      ncd: [],
      fever: [],
      emergency: [],
    };

    rows.forEach((rec) => {
      const type = rec.case_type ? rec.case_type.toLowerCase() : "";

      if (type.includes("anc") || type.includes("preg")) grouped.pregnancy.push(rec);
      else if (type.includes("child")) grouped.child.push(rec);
      else if (type.includes("tb")) grouped.tb.push(rec);
      else if (type.includes("ncd")) grouped.ncd.push(rec);
      else if (type.includes("fever")) grouped.fever.push(rec);

      if (rec.risk_level === "emergency") grouped.emergency.push(rec);
    });

    return res.status(200).json({
      success: true,
      data: grouped,
    });

  } catch (err) {
    console.error("High-risk error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch high-risk records",
    });
  }
}
