import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";

export default function EditSurvey() {
  const router = useRouter();
  const { id } = router.query;

  const [survey, setSurvey] = useState(null);
  const [types, setTypes] = useState([]);
  const [areas, setAreas] = useState([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const s = await axios.get(`/api/phc/surveys/${id}`);
        const t = await axios.get(`/api/phc/surveys/types`);
        const a = await axios.get(`/api/phc/areas`);

        setSurvey(s.data);
        setTypes(t.data);
        setAreas(a.data);
      } catch (e) {
        console.error(e);
      }
    }

    load();
  }, [id]);


  function updateField(e) {
    setSurvey({ ...survey, [e.target.name]: e.target.value });
  }

  async function save() {
    setSaving(true);
    try {
      await axios.put(`/api/phc/surveys/${id}`, {
        ...survey,
        type_id: Number(survey.type_id),
        area_id: survey.area_id ? Number(survey.area_id) : null,
      });
      router.push("/phc/surveys");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  }


  if (!survey) return <div className="p-6">Loading…</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16 max-w-2xl">

          <h1 className="text-2xl font-bold mb-4">Edit Survey</h1>

          <label className="block mb-2">Title</label>
          <input
            name="title"
            value={survey.title}
            onChange={updateField}
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block mb-2">Type</label>
          <select
            name="type_id"
            value={survey.type_id}
            onChange={updateField}
            className="w-full p-2 border rounded mb-4"
          >
            {types.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <label className="block mb-2">Area</label>
          <select
            name="area_id"
            value={survey.area_id || ""}
            onChange={updateField}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Whole PHC</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={survey.description}
            onChange={updateField}
            className="w-full p-2 border rounded mb-4"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={survey.start_date}
                onChange={updateField}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">End Date</label>
              <input
                type="date"
                name="end_date"
                value={survey.end_date}
                onChange={updateField}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving…" : "Save"}
          </button>

        </main>
      </div>
    </div>
  );
}
