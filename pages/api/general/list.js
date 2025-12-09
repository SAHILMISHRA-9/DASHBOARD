// pages/api/general/list.js
// Fetches general health records from backend /health/list (non-specific visit types)
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
    
    // Filter for general health visits (not ANC, PNC, TB, NCD, or immunization)
    const specificTypes = ['anc', 'antenatal', 'pregnancy', 'pnc', 'postnatal', 'post-natal', 
                          'tb', 'tuberculosis', 'ncd', 'non-communicable', 
                          'immunization', 'immun', 'vaccination'];
    
    const generalRecords = allRecords.filter(record => {
      const visitType = (record.visit_type || '').toLowerCase();
      const category = (record.data_json?.category || '').toLowerCase();
      
      // Exclude specific types
      if (specificTypes.includes(visitType) || specificTypes.includes(category)) {
        return false;
      }
      
      // Include records that don't have a specific type or are general
      return !visitType || visitType === 'general' || category === 'general' || 
             category === 'fever' || category === 'viral' || category === 'pain' || category === 'skin';
    });

    const transformed = generalRecords.map(record => {
      const data = record.data_json || {};
      return {
        id: record.id,
        member_id: record.member_id,
        name: data.name || data.patient_name || 'Unknown',
        age: data.age || null,
        complaint: data.complaint || data.symptoms || data.reason || null,
        category: data.category || record.visit_type || 'general',
        date: record.created_at || record.device_created_at || data.date,
        visit_date: record.created_at || record.device_created_at,
        data: data,
      };
    });

    return res.status(200).json(transformed);
  } catch (error) {
    console.error('General list error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
