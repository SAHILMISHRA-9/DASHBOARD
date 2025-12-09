// pages/api/ncd/list.js
// Fetches NCD records from backend /health/list filtered by visit_type
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

    const result = await fetchFromBackend('health/list', {
      method: 'GET',
      headers: createBackendHeaders(req),
    });

    if (!result.ok) {
      return res.status(result.status).json({
        error: result.data?.error || 'Failed to fetch health records'
      });
    }

    const allRecords = result.data.records || [];
    const ncdRecords = allRecords.filter(record => {
      const visitType = (record.visit_type || '').toLowerCase();
      return visitType === 'ncd' || 
             visitType === 'non-communicable' ||
             (record.data_json && (
               record.data_json.category === 'ncd' ||
               record.data_json.category === 'non-communicable'
             ));
    });

    const transformed = ncdRecords.map(record => {
      const data = record.data_json || {};
      return {
        id: record.id,
        member_id: record.member_id,
        name: data.name || data.patient_name || 'Unknown',
        age: data.age || null,
        bp: data.bp || data.blood_pressure || null,
        sugar: data.sugar || data.blood_sugar || data.glucose || null,
        status: data.status || data.risk_level || 'normal',
        visit_date: record.created_at || record.device_created_at,
        data: data,
      };
    });

    return res.status(200).json(transformed);
  } catch (error) {
    console.error('NCD list error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
