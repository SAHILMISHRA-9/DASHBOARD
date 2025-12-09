"use client";

import React, { useEffect, useState } from 'react';
import LayoutDOCTOR from "../../../components/layout/LayoutDOCTOR";

export default function ChildSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/doctor/summary/child')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <LayoutDOCTOR>
        <div className="p-6">Loading...</div>
      </LayoutDOCTOR>
    );
  }

  return (
    <LayoutDOCTOR>
      <div className="p-6">
        <h1 className="text-lg font-bold mb-4">Child Immunization Summary</h1>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            Total children: <b>{data.total_children}</b>
          </div>

          <div className="bg-white p-4 rounded shadow">
            Vaccinated: <b>{data.vaccinated}</b>
          </div>

          <div className="bg-white p-4 rounded shadow">
            Missed: <b>{data.missed}</b>
          </div>

          <div className="bg-white p-4 rounded shadow">
            High-risk: <b>{data.high_risk}</b>
          </div>
        </div>
      </div>
    </LayoutDOCTOR>
  );
}
