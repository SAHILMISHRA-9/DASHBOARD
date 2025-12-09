// pages/api/immunization/list.js
// Fetches immunization records from backend /health/list filtered by visit_type
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
    const immunRecords = allRecords.filter(record => {
      const visitType = (record.visit_type || '').toLowerCase();
      return visitType === 'immunization' || 
             visitType === 'immun' || 
             visitType === 'vaccination' ||
             (record.data_json && (
               record.data_json.category === 'immunization' ||
               record.data_json.category === 'vaccination' ||
               record.data_json.vaccine_name ||
               record.data_json.vaccine
             ));
    });

    const transformed = immunRecords.map(record => {
      const data = record.data_json || {};
      return {
        id: record.id,
        member_id: record.member_id,
        name: data.name || data.child_name || data.patient_name || 'Unknown',
        age: data.age || data.child_age || null,
        mother: data.mother || data.mother_name || null,
        dueDose: data.due_dose || data.dueDose || data.vaccine_name || data.vaccine || '-',
        status: data.status || data.vaccine_status || 'due',
        visit_date: record.created_at || record.device_created_at,
        data: data,
      };
    });

    return res.status(200).json(transformed);
  } catch (error) {
    console.error('Immunization list error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
