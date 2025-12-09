"use client";

import React, { useEffect, useState } from 'react';
import LayoutDOCTOR from "../../../components/layout/LayoutDOCTOR";


export default function AncSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/doctor/summary/anc')
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
        <h1 className="text-lg font-bold mb-4">ANC Summary</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">Total ANC: <b>{data.total}</b></div>
          <div className="bg-white p-4 rounded shadow">Due: <b>{data.due}</b></div>
          <div className="bg-white p-4 rounded shadow">Completed: <b>{data.completed}</b></div>
          <div className="bg-white p-4 rounded shadow">High-risk: <b>{data.high_risk}</b></div>
        </div>

        <div className="mt-4">
          Trimester:  
          T1: <b>{data.trimester?.t1}</b> | 
          T2: <b>{data.trimester?.t2}</b> | 
          T3: <b>{data.trimester?.t3}</b>
        </div>
      </div>
    </LayoutDOCTOR>
  );
}
