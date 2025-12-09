"use client";

import React, { useEffect, useState } from 'react';
import DoctorTable from '../../components/DoctorTable';
import LayoutDOCTOR from "../../components/layout/LayoutDOCTOR";

export default function HighRiskPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch('/api/doctor/high-risk')
      .then(r => r.json())
      .then(json => setRows(json.rows || []))
      .catch(console.error);
  }, []);

  const columns = [
    { key: 'patient_name', title: 'Patient' },
    { key: 'age', title: 'Age' },
    { key: 'case_type', title: 'Case Type' },
    { key: 'risk_reason', title: 'Risk Reason' },
    { key: 'area', title: 'Area' },
    { key: 'asha_name', title: 'ASHA' },
    { key: 'last_visit', title: 'Last Visit' },
  ];

  return (
    <LayoutDOCTOR>
      <div className="p-6">
        <h1 className="text-lg font-bold mb-4">High-Risk Cases</h1>
        <DoctorTable columns={columns} rows={rows} />
      </div>
    </LayoutDOCTOR>
  );
}
