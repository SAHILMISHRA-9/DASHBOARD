"use client";

import React, { useEffect, useState } from 'react';
import LayoutDOCTOR from "../../../components/layout/LayoutDOCTOR";

export default function PncSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/doctor/summary/pnc')
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
        <h1 className="text-lg font-bold mb-4">PNC Summary</h1>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            Total: <b>{data.total}</b>
          </div>

          <div className="bg-white p-4 rounded shadow">
            Completed: <b>{data.completed}</b>
          </div>

          <div className="bg-white p-4 rounded shadow">
            High-risk: <b>{data.high_risk}</b>
          </div>
        </div>
      </div>
    </LayoutDOCTOR>
  );
}
