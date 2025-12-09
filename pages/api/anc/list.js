// pages/api/anc/list.js
// Fetches ANC records from backend /health/list filtered by visit_type
import { fetchFromBackend, createBackendHeaders, handleAuthError } from '../../../utils/backendHelper';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.cookies?.token || 
                  null;

    if (!token) {
      return handleAuthError(res);
    }

    // Fetch all health records from backend
    const result = await fetchFromBackend('health/list', {
      method: 'GET',
      headers: createBackendHeaders(req),
    });

    if (!result.ok) {
      return res.status(result.status).json({
        error: result.data?.error || 'Failed to fetch health records'
      });
    }

    // Filter for ANC records (visit_type can be 'anc', 'antenatal', 'pregnancy', etc.)
    const allRecords = result.data.records || [];
    const ancRecords = allRecords.filter(record => {
      const visitType = (record.visit_type || '').toLowerCase();
      return visitType === 'anc' || 
             visitType === 'antenatal' || 
             visitType === 'pregnancy' ||
             (record.data_json && (
               record.data_json.category === 'pregnancy' ||
               record.data_json.category === 'anc' ||
               record.data_json.category === 'antenatal'
             ));
    });

    // Transform to match frontend format
    const transformed = ancRecords.map(record => {
      const data = record.data_json || {};
      return {
        id: record.id,
        member_id: record.member_id,
        name: data.name || data.patient_name || 'Unknown',
        lmp: data.lmp || data.last_menstrual_period || null,
        trimester: data.trimester || data.trimester_number || null,
        phone: data.phone || data.phone_number || null,
        status: data.status || data.risk_level || 'normal',
        visit_date: record.created_at || record.device_created_at,
        data: data,
      };
    });

    return res.status(200).json(transformed);
  } catch (error) {
    console.error('ANC list error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
