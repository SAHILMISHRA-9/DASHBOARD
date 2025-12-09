"use client";

import React, { useEffect, useState } from 'react';
import DoctorTable from '../../components/DoctorTable';
import LayoutDOCTOR from "../../components/layout/LayoutDOCTOR";

export default function CasesPage() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ caseType: '', risk: '', area: '' });

  useEffect(() => {
    const qs = new URLSearchParams(
      Object.entries(filters).filter(([k, v]) => v)
    ).toString();

    fetch('/api/doctor/cases?' + qs)
      .then(r => r.json())
      .then(json => setRows(json.rows || []))
      .catch(console.error);
  }, [filters]);

  const columns = [
    { key: 'family_name', title: 'Family' },
    { key: 'member_name', title: 'Member' },
    { key: 'case_type', title: 'Case Type' },
    { key: 'last_visit', title: 'Last Visit' },
    { key: 'risk_level', title: 'Risk' },
    { key: 'asha_name', title: 'ASHA' },
    { key: 'area', title: 'Area' },
  ];

  return (
    <LayoutDOCTOR>
      <div className="p-6 space-y-4">
        <h1 className="text-lg font-bold">Family Health Case Viewer</h1>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filters.caseType}
            onChange={(e) => setFilters(s => ({ ...s, caseType: e.target.value }))}
            className="border p-2"
          >
            <option value="">All Case Types</option>
            <option value="ANC">ANC</option>
            <option value="PNC">PNC</option>
            <option value="Child">Child</option>
            <option value="General">General</option>
          </select>

          <select
            value={filters.risk}
            onChange={(e) => setFilters(s => ({ ...s, risk: e.target.value }))}
            className="border p-2"
          >
            <option value="">All Risk</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
            <option value="high">High</option>
          </select>

          <select
            value={filters.area}
            onChange={(e) => setFilters(s => ({ ...s, area: e.target.value }))}
            className="border p-2"
          >
            <option value="">All Areas</option>
            <option value="301">Area 301</option>
            <option value="302">Area 302</option>
            <option value="303">Area 303</option>
          </select>

          <button
            onClick={() => setFilters({ caseType: '', risk: '', area: '' })}
            className="bg-gray-200 px-3 rounded"
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <DoctorTable columns={columns} rows={rows} />
      </div>
    </LayoutDOCTOR>
  );
}
