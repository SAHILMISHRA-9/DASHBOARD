import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

export default function TaskPanel({ phcId }) {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", assigned_anm: "", priority: "medium", due_date: "" });
  const base = "/api/phc/tasks-manager";

  async function fetchTasks() {
    const q = phcId ? `?phc_id=${phcId}` : "";
    const res = await fetch(`${base}${q}`);
    const j = await res.json();
    setTasks(j.data || []);
  }

  useEffect(() => { fetchTasks(); }, [phcId]);

  async function createTask(e) {
    e.preventDefault();
    const payload = { ...form, phc_id: phcId, created_by: 1 };
    const res = await fetch(base, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { setForm({ title: "", description: "", assigned_anm: "", priority: "medium", due_date: "" }); fetchTasks(); }
    else { const err = await res.json(); alert(err.error || "Error"); }
  }

  async function openTask(task) {
    const res = await fetch(`${base}/${task.id}`);
    const j = await res.json();
    setSelected(j.data);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createTask} className="p-4 bg-white rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="w-full p-2 border rounded" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <select className="p-2 border rounded" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
            <option value="low">low</option><option value="medium">medium</option><option value="high">high</option>
          </select>
          <input className="w-full p-2 border rounded" placeholder="Assign ANM (id)" value={form.assigned_anm} onChange={e=>setForm({...form,assigned_anm:e.target.value})} />
          <input type="date" className="p-2 border rounded" value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})} />
          <textarea className="col-span-1 md:col-span-2 p-2 border rounded" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        </div>
        <div className="mt-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
        </div>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {tasks.map(t => <TaskCard key={t.id} task={t} onOpen={openTask} />)}
      </div>

      {selected && (
        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-bold">{selected.title}</h4>
          <p>{selected.description}</p>
          <div className="mt-3">
            <h5 className="font-semibold">Subtasks</h5>
            <ul className="list-disc pl-5">
              {(selected.subtasks || []).map(s => <li key={s.id}>{s.title} — {s.status} — assigned: {s.assigned_asha || "-"}</li>)}
            </ul>
          </div>
          <div className="mt-3"><button className="px-3 py-1 bg-gray-200" onClick={()=>setSelected(null)}>Close</button></div>
        </div>
      )}
    </div>
  );
}
