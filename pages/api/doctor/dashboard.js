// pages/api/doctor/dashboard.js
import db from '../../../utils/db';

export default async function handler(req, res) {
  try {
    const phcId = req.query.phc_id ? Number(req.query.phc_id) : 1;

    const [visRows] = await db.query('SELECT * FROM visits', [phcId]);
    const visits = Array.isArray(visRows) ? visRows : [];

    const [ancRows] = await db.query('SELECT * FROM pregnancy_anc', [phcId]);
    const anc = Array.isArray(ancRows) ? ancRows : [];

    const [pncRows] = await db.query('SELECT * FROM pnc_visits', [phcId]);
    const pnc = Array.isArray(pncRows) ? pncRows : [];

    const [ciRows] = await db.query('SELECT * FROM child_immunization', [phcId]);
    const child_imms = Array.isArray(ciRows) ? ciRows : [];

    const [hrRows] = await db.query('SELECT * FROM high_risk_cases', [phcId]);
    const hrs = Array.isArray(hrRows) ? hrRows : [];

    // dashboard metrics
    const anc_total = anc.length;
    const anc_last_30_days = visits.filter(v => v.case_type.toLowerCase().includes('anc') && (new Date() - new Date(v.visit_date) <= 30*24*60*60*1000)).length;
    const anc_high_risk = anc.filter(a => (a.risk_level || '').toLowerCase() === 'high').length;

    const pnc_total = pnc.length;
    const pnc_high_risk = pnc.filter(p => (p.risk_level || '').toLowerCase() === 'high').length;

    const child_vaccinated = child_imms.filter(c => c.status === 'done' || c.status === 'Done').length;
    const child_missed = child_imms.filter(c => c.status === 'missed' || c.status === 'Missed').length;

    // general cases from visits (fever/viral/ncd)
    const general_fever = visits.filter(v => (v.case_type || '').toLowerCase().includes('general') && (v.case_type || '').toLowerCase().includes('fever') ).length;
    // fallback: search health_records categories
    const [hrAll] = await db.query('SELECT * FROM health_records', [phcId]);
    const healthRecs = Array.isArray(hrAll) ? hrAll : [];
    const general_viral = healthRecs.filter(r => (r.data_json?.category || '').toLowerCase().includes('viral')).length;
    const general_ncd = healthRecs.filter(r => ((r.data_json?.category || '').toLowerCase().includes('ncd')) || (r.data_json?.risk_reason || '').toLowerCase().includes('bp') || (r.data_json?.risk_reason || '').toLowerCase().includes('sugar')).length;

    // high risk summary breakdown (from high_risk_cases table)
    const total_hr = hrs.length;
    const pregnancy_hr = hrs.filter(h => (h.case_domain || '').toLowerCase() === 'pregnancy' || (h.case_type || '').toLowerCase().includes('anc')).length;
    const child_mal = hrs.filter(h => (h.case_domain || '').toLowerCase() === 'child' || (h.case_reason || '').toLowerCase().includes('muac') || (h.case_reason || '').toLowerCase().includes('malnutrition')).length;
    const tb_suspects = hrs.filter(h => (h.case_domain || '').toLowerCase() === 'tb' || (h.case_type || '').toLowerCase().includes('tb')).length;
    const bp_sugar_cases = hrs.filter(h => (h.case_reason || '').toLowerCase().includes('bp') || (h.case_reason || '').toLowerCase().includes('sugar')).length;

    return res.status(200).json({
      anc_total,
      anc_last_30_days,
      anc_high_risk,
      pnc_total,
      pnc_high_risk,
      child_vaccinated,
      child_missed,
      general_cases: { fever: general_fever, viral: general_viral, ncd: general_ncd },
      high_risk_summary: { total: total_hr, pregnancy: pregnancy_hr, child_malnutrition: child_mal, tb: tb_suspects, bp_sugar: bp_sugar_cases }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
