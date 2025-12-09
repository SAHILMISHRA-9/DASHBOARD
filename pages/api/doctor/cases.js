// pages/api/doctor/cases.js
import db from '../../../utils/db';

export default async function handler(req, res) {
  try {
    const { caseType, risk, area, phc_id } = req.query;
    const phcId = phc_id ? Number(phc_id) : 1;

    const [rows] = await db.query('SELECT * FROM visits', [phcId]);
    const visits = Array.isArray(rows) ? rows : [];

    const filtered = visits.filter(v => {
      if (caseType && caseType !== '' && !(v.case_type || '').toLowerCase().includes(caseType.toString().toLowerCase())) return false;
      if (risk && risk !== '') {
        const rl = (v.risk_level || '').toString().toLowerCase();
        if (rl !== risk.toString().toLowerCase()) return false;
      }
      if (area && area !== '') {
        if (String(v.area_id) !== String(area)) return false;
      }
      return true;
    });

    const list = filtered.map(r => ({
      family_name: `Family ${r.family_id}`,
      member_name: r.member_id ? (r.member_name || `Member ${r.member_id}`) : (r.member_name || ''),
      case_type: r.case_type || '',
      last_visit: r.visit_date ? (new Date(r.visit_date)).toISOString().substring(0,10) : null,
      risk_level: r.risk_level || 'normal',
      asha_name: r.asha_id ? `ASHA ${r.asha_id}` : null,
      area: r.area_id ? `Area ${r.area_id}` : null,
    }));

    res.status(200).json({ rows: list, meta: { total: list.length } });
  } catch (err) {
    console.error('doctor/cases error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
