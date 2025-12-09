// pages/api/pnc/list.js
// Fetches PNC records from backend /health/list filtered by visit_type
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

    // Filter for PNC records
    const allRecords = result.data.records || [];
    const pncRecords = allRecords.filter(record => {
      const visitType = (record.visit_type || '').toLowerCase();
      return visitType === 'pnc' || 
             visitType === 'postnatal' || 
             visitType === 'post-natal' ||
             (record.data_json && (
               record.data_json.category === 'pnc' ||
               record.data_json.category === 'postnatal' ||
               record.data_json.category === 'post-natal'
             ));
    });

    // Transform to match frontend format
    const transformed = pncRecords.map(record => {
      const data = record.data_json || {};
      return {
        id: record.id,
        member_id: record.member_id,
        name: data.name || data.patient_name || 'Unknown',
        deliveryDate: data.delivery_date || data.deliveryDate || null,
        babyAge: data.baby_age || data.babyAge || null,
        visitCount: data.visit_count || data.visitCount || 0,
        status: data.status || data.risk_level || 'normal',
        visit_date: record.created_at || record.device_created_at,
        data: data,
      };
    });

    return res.status(200).json(transformed);
  } catch (error) {
    console.error('PNC list error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
