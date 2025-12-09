"use client";

import { useEffect, useState } from "react";
import DoctorCard from "../../components/DoctorCard";
import LayoutDOCTOR from "../../components/layout/LayoutDOCTOR";

export default function DoctorDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/doctor/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <LayoutDOCTOR><div className="p-6">Loading...</div></LayoutDOCTOR>;

  return (
    <LayoutDOCTOR>
      <div className="p-6 space-y-6">
        <h1 className="text-xl font-bold">Doctor Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

          <DoctorCard title="ANC" lines={[
            { label: "Total ANC", value: data.anc_total ?? 0 },
            { label: "Last 30 days", value: data.anc_last_30_days ?? 0 },
            { label: "High-risk", value: data.anc_high_risk ?? 0 },
          ]} />

          <DoctorCard title="PNC" lines={[
            { label: "Total PNC", value: data.pnc_total ?? 0 },
            { label: "High-risk", value: data.pnc_high_risk ?? 0 },
          ]} />

          <DoctorCard title="Child Immunization" lines={[
            { label: "Vaccinated", value: data.child_vaccinated ?? 0 },
            { label: "Missed", value: data.child_missed ?? 0 },
          ]} />

          <DoctorCard title="General Cases" lines={[
            { label: "Fever", value: data.general_cases?.fever ?? 0 },
            { label: "Viral", value: data.general_cases?.viral ?? 0 },
            { label: "NCD", value: data.general_cases?.ncd ?? 0 },
          ]} />

          <DoctorCard title="High-risk Summary" lines={[
            { label: "Total", value: data.high_risk_summary?.total ?? 0 },
            { label: "Pregnancy", value: data.high_risk_summary?.pregnancy ?? 0 },
            { label: "Child malnutrition", value: data.high_risk_summary?.child_malnutrition ?? 0 },
            { label: "TB suspect", value: data.high_risk_summary?.tb ?? 0 },
            { label: "BP/Sugar", value: data.high_risk_summary?.bp_sugar ?? 0 },
          ]} />

        </div>
      </div>
    </LayoutDOCTOR>
  );
}
