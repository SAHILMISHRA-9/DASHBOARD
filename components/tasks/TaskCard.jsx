import React from "react";

export default function TaskCard({ task, onOpen }) {
  return (
    <div className="border rounded p-3 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          <div className="text-xs mt-2 text-gray-700">
            <span className="mr-2">ANM: {task.assigned_anm || "—"}</span>
            <span className="mr-2">Priority: {task.priority}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm">{task.status}</div>
          <button className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs" onClick={() => onOpen(task)}>Open</button>
        </div>
      </div>
    </div>
  );
}
