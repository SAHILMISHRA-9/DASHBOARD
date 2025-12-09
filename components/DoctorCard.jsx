// components/DoctorCard.jsx
import React from 'react';

export default function DoctorCard({ title, lines = [] }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="font-semibold text-sm mb-2">{title}</h3>
      <div className="text-xs space-y-1">
        {lines.map((l, i) => (
          <div key={i} className="flex justify-between">
            <span>{l.label}</span>
            <span className="font-medium">{l.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
