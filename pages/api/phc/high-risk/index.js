import db from "../../../../utils/db";

export default async function handler(req, res) {
  const { phc_id } = req.query;

  try {
    const [records] = await db.query(`
      SELECT 
        hr.*, 
        fm.name AS member_name,
        anm.name AS anm_name,
        asha.name AS asha_name,
        area.area_name,
        hr.data_json->>'category' AS category,
        hr.data_json->>'risk_reason' AS risk_reason
      FROM health_records hr
      LEFT JOIN family_members fm ON fm.id = hr.member_id
      LEFT JOIN anm_workers anm ON anm.id = hr.anm_id
      LEFT JOIN asha_workers asha ON asha.id = hr.asha_id
      LEFT JOIN phc_areas area ON area.id = hr.area_id
      WHERE hr.phc_id = ?
      AND hr.data_json->>'risk_level' = 'high'
      ORDER BY hr.created_at DESC
    `, [phc_id]);

    res.json({ success: true, records });
  } catch (e) {
    console.error("HIGH-RISK ERROR:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
