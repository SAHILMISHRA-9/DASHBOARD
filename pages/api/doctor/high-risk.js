// pages/api/doctor/high-risk.js
import db from '../../../utils/db';

export default async function handler(req, res) {
  try {
    const phcId = req.query.phc_id ? Number(req.query.phc_id) : 1;

    const [rows] = await db.query('SELECT * FROM high_risk_cases', [phcId]);
    const hrs = Array.isArray(rows) ? rows : [];

    const list = hrs.map(h => ({
      patient_name: (h.patient_id ? `Member ${h.patient_id}` : '') || '',
      age: null,
      case_type: h.case_type || '',
      risk_reason: h.case_reason || '',
      area: h.area_id ? `Area ${h.area_id}` : (h.area || null),
      asha_name: h.asha_id ? `ASHA ${h.asha_id}` : null,
      last_visit: h.last_visit ? (new Date(h.last_visit)).toISOString().substring(0,10) : null,
    }));

    res.status(200).json({ rows: list, meta: { total: list.length } });
  } catch (err) {
    console.error('doctor/high-risk error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
