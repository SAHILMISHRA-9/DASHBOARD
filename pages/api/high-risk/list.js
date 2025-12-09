// pages/api/high-risk/list.js
// Aggregates high-risk cases from all health records
import { fetchFromBackend, createBackendHeaders, handleAuthError } from "../../../utils/backendHelper";
import backendHelper from "../../../utils/backendHelper";

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

    const allRecords = result.data.records || [];
    const highRiskCases = [];

    // Filter and categorize high-risk cases
    allRecords.forEach(record => {
      const data = record.data_json || {};
      const status = (data.status || data.risk_level || '').toLowerCase();
      const visitType = (record.visit_type || '').toLowerCase();
      const category = (data.category || '').toLowerCase();

      // Check if it's a high-risk case
      const isHighRisk = status === 'high-risk' || 
                        status === 'danger' || 
                        status === 'emergency' ||
                        status === 'urgent' ||
                        data.risk_level === 'high' ||
                        data.risk_level === 'emergency';

      if (isHighRisk) {
        let caseCategory = 'General';
        let link = `/dashboard/general/${record.id}`;

        // Determine category
        if (visitType === 'anc' || visitType === 'antenatal' || visitType === 'pregnancy' || category === 'pregnancy' || category === 'anc') {
          caseCategory = 'ANC';
          link = `/dashboard/anc/${record.id}`;
        } else if (visitType === 'pnc' || visitType === 'postnatal' || category === 'pnc' || category === 'postnatal') {
          caseCategory = 'PNC';
          link = `/dashboard/pnc/${record.id}`;
        } else if (visitType === 'immunization' || visitType === 'immun' || visitType === 'vaccination' || category === 'immunization') {
          caseCategory = 'Immunization';
          link = `/dashboard/immunization/${record.id}`;
        } else if (visitType === 'tb' || visitType === 'tuberculosis' || category === 'tb') {
          caseCategory = 'TB';
          link = `/dashboard/tb/${record.id}`;
        } else if (visitType === 'ncd' || visitType === 'non-communicable' || category === 'ncd') {
          caseCategory = 'NCD';
          link = `/dashboard/ncd/${record.id}`;
        }

        highRiskCases.push({
          id: record.id,
          member_id: record.member_id,
          name: data.name || data.patient_name || 'Unknown',
          category: caseCategory,
          status: status,
          reason: data.risk_reason || data.reason || data.complaint || 'High risk case',
          link: link,
          visit_date: record.created_at || record.device_created_at,
          data: data,
        });
      }
    });

    return res.status(200).json(highRiskCases);
  } catch (error) {
    console.error('High-risk list error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
