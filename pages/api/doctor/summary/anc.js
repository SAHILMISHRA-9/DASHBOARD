// pages/api/doctor/summary/anc.js
import db from '../../../../utils/db';

export default async function handler(req, res) {
  try {
    const phcId = req.query.phc_id ? Number(req.query.phc_id) : 1;
    const [rows] = await db.query('SELECT * FROM pregnancy_anc', [phcId]);
    const anc = Array.isArray(rows) ? rows : [];

    const total = anc.length;
    const completed = anc.filter(a => (a.status || '').toLowerCase() === 'completed').length;
    const due = anc.filter(a => (a.status || '').toLowerCase() === 'due').length;
    const high_risk = anc.filter(a => (a.risk_level || '').toLowerCase() === 'high').length;

    const trimester = { t1: anc.filter(a => a.trimester === 1).length, t2: anc.filter(a => a.trimester === 2).length, t3: anc.filter(a => a.trimester === 3).length };

    res.status(200).json({ total, due, completed, high_risk, trimester });
  } catch (err) {
    console.error('doctor/summary/anc error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
