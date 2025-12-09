// components/DoctorTable.jsx
import React from 'react';

export default function DoctorTable({ columns = [], rows = [] }) {
  return (
    <div className="overflow-auto bg-white shadow rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-left">{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="p-4 text-center text-gray-500">No records</td></tr>
          )}
          {rows.map((r, idx) => (
            <tr key={idx} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 align-top">{r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
