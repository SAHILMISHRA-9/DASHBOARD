// pages/api/doctor/summary/child.js
import db from '../../../../utils/db';

export default async function handler(req, res) {
  try {
    const phcId = req.query.phc_id ? Number(req.query.phc_id) : 1;
    const [rows] = await db.query('SELECT * FROM children', [phcId]);
    const children = Array.isArray(rows) ? rows : [];

    const [imms] = await db.query('SELECT * FROM child_immunization', [phcId]);
    const im = Array.isArray(imms) ? imms : [];

    const total_children = children.length;
    const vaccinated = im.filter(i => (i.status || '').toLowerCase() === 'done').length;
    const missed = im.filter(i => (i.status || '').toLowerCase() === 'missed').length;

    const [hrs] = await db.query('SELECT * FROM high_risk_cases', [phcId]);
    const high_risk = Array.isArray(hrs) ? hrs.filter(h => (h.case_domain || '').toLowerCase() === 'child' || (h.case_reason || '').toLowerCase().includes('muac')).length : 0;

    res.status(200).json({ total_children, vaccinated, missed, high_risk });
  } catch (err) {
    console.error('doctor/summary/child error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
