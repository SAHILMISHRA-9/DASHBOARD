

// pages/phc/cases/anc/index.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

const BASE_URL = "https://asha-ehr-backend-9.onrender.com";

export default function ANCList() {
  const [list, setList] = useState([]);
  const [areas, setAreas] = useState([]);
  const [anms, setAnms] = useState([]);
  const [ashas, setAshas] = useState([]);
  const [filters, setFilters] = useState({
    anm_id: "",
    asha_id: "",
    area_id: "",
    risk_level: "",
    q: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLookups();
    load();
  }, []);

  function getAuthHeaders() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null;

    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // safe reader for hr.data_json (can be object or string)
  function getAncData(row) {
    const raw = row?.data_json;
    if (!raw) return {};
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    return raw;
  }

  // 🔹 Load areas / ANMs / ASHAs directly from backend
  async function loadLookups() {
    try {
      const headers = getAuthHeaders();

      const [aRes, anRes, ashRes] = await Promise.all([
        axios.get(`${BASE_URL}/phcs/areas/list`, { headers }),
        axios.get(`${BASE_URL}/phcAdmin/anms`, { headers }),
        axios.get(`${BASE_URL}/phcAdmin/ashas`, { headers }),
      ]);

      setAreas(aRes.data?.areas || aRes.data || []);
      setAnms(anRes.data || []);
      setAshas(ashRes.data || []);
    } catch (err) {
      console.error("Lookups load error:", err.response?.data || err.message);
    }
  }

  // 🔹 Load cases directly from backend, then keep only ANC on frontend
  async function load() {
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      const res = await axios.get(`${BASE_URL}/phcAdmin/cases`, {
        params: { ...filters },
        headers,
      });

      const all = res.data || [];

      // only keep visit_type that looks like ANC
      const onlyANC = all.filter((r) =>
        (r.visit_type || "").toLowerCase().includes("anc")
      );

      setList(onlyANC);
    } catch (err) {
      console.error("ANC cases load error:", err.response?.data || err.message);
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  // (filters + handlers kept in case you re-add UI later)
  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function clearFilters() {
    setFilters({
      anm_id: "",
      asha_id: "",
      area_id: "",
      risk_level: "",
      q: "",
    });
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />
      <div className="flex-1 ml-60">
        <Navbar />
        <main className="p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Pregnancy (ANC) Cases</h1>
          </div>

          {/* LIST */}
          <div>
            {loading ? (
              <div>Loading...</div>
            ) : list.length === 0 ? (
              <div className="text-gray-500">No cases found</div>
            ) : (
              <div className="space-y-3">
                {list.map((r) => {
                  // full ANC form payload from hr.data_json
                  const d = getAncData(r);

                  return (
                    <div
                      key={r.id}
                      className="bg-white p-4 rounded shadow flex justify-between items-center"
                    >
                      <div>
                        {/* NAME + AGE + GENDER */}
                        <div className="font-medium">
                          {r.patient_name}{" "}
                          <span className="text-sm text-gray-500">
                            ({r.age}
                            {r.gender ? ` · ${r.gender}` : ""})
                          </span>
                        </div>

                        {/* FAMILY + AREA */}
                        <div className="text-xs text-gray-500">
                          Family #{r.family_id} ·{" "}
                          {r.address_line || "No address"}
                          {r.area_name ? ` · ${r.area_name}` : ""}
                        </div>

                        {/* ASHA / ANM */}
                        <div className="text-xs text-gray-500">
                          ASHA: {r.asha_name || "—"} · ANM:{" "}
                          {r.anm_name || "—"}
                        </div>

                        {/* OBSTETRIC HISTORY */}
                        <div className="text-xs text-gray-500 mt-1">
                          Gravida: {d.gravida || "—"} · Para:{" "}
                          {d.para || "—"} · Living:{" "}
                          {d.living || "—"} · Abortions:{" "}
                          {d.abortions || "—"}
                        </div>

                        {/* LMP / EDD */}
                        <div className="text-xs text-gray-500">
                          LMP: {d.lmpDate || "—"} · EDD:{" "}
                          {d.eddDate || "—"}
                        </div>

                        {/* VITALS */}
                        <div className="text-xs text-gray-500">
                          BP: {d.bp || "—"} · Weight:{" "}
                          {d.weight || "—"} kg · Hb:{" "}
                          {d.hemoglobin || "—"} g/dL · Sugar:{" "}
                          {d.bloodSugar || "—"}
                        </div>

                        {/* MEDICATION / VACCINES */}
                        <div className="text-xs text-gray-500">
                          IFA: {d.ifaTablets || "—"} tabs · Calcium:{" "}
                          {d.calciumTablets || "—"} tabs · Vaccine:{" "}
                          {d.selectedVaccineDose || "—"} on{" "}
                          {d.vaccinationDate || "—"}
                        </div>

                        {/* SYMPTOMS */}
                        <div className="text-xs text-gray-500">
                          Symptoms:{" "}
                          {d.symptoms && d.symptoms.length
                            ? Array.isArray(d.symptoms)
                              ? d.symptoms.join(", ")
                              : d.symptoms
                            : "None"}
                          {d.otherSymptoms
                            ? ` · Other: ${d.otherSymptoms}`
                            : ""}
                        </div>

                        {/* PREVIOUS HISTORY */}
                        <div className="text-xs text-gray-500">
                          Prev C-section: {d.previousCesarean || "No"} · Prev
                          Stillbirth: {d.previousStillbirth || "No"} · Prev
                          Complications: {d.previousComplications || "No"}
                        </div>

                        {/* RISK + STATUS */}
                        <div className="text-sm text-gray-500 mt-1">
                          Risk: {r.risk_level || d.risk_level || "—"} · Status:{" "}
                          {r.status}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/phc/cases/anc/${r.id}`}
                          className="text-blue-600"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
