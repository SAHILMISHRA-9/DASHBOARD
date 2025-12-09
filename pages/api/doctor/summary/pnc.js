// pages/api/doctor/summary/pnc.js
import db from '../../../../utils/db';

export default async function handler(req, res) {
  try {
    const phcId = req.query.phc_id ? Number(req.query.phc_id) : 1;
    const [rows] = await db.query('SELECT * FROM pnc_visits', [phcId]);
    const pnc = Array.isArray(rows) ? rows : [];

    const total = pnc.length;
    const completed = pnc.filter(p => (p.status || '').toLowerCase() === 'completed').length;
    const high_risk = pnc.filter(p => (p.risk_level || '').toLowerCase() === 'high').length;

    res.status(200).json({ total, completed, high_risk });
  } catch (err) {
    console.error('doctor/summary/pnc error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
