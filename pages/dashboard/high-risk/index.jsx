import { useEffect, useState } from "react";
import SidebarANM from "../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../components/layout/Navbar";
import axios from "axios";
import Link from "next/link";

export default function HighRiskDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/high-risk/list");
        setCases(res.data);
      } catch (e) {
        console.error("High-risk load error", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen">
      <SidebarANM />
      <div className="flex-1 ml-64">
        <Navbar />

        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">High-Risk Cases</h1>

          {loading && <p>Loading...</p>}

          {!loading && cases.length === 0 && (
            <p className="text-gray-600">No high-risk cases found.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((item, i) => (
              <Link
                key={i}
                href={item.link}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all border"
              >
                <h2 className="text-xl font-semibold">{item.name || item.mother}</h2>

                <p className="text-sm text-gray-600 mt-1">
                  Category:{" "}
                  <span className="font-medium text-red-600">{item.category}</span>
                </p>

                <div className="mt-3 text-sm space-y-1">
                  {item.category === "ANC" && (
                    <>
                      <div>LMP: {item.lmp}</div>
                      <div>Trimester: {item.trimester}</div>
                    </>
                  )}

                  {item.category === "PNC" && (
                    <>
                      <div>Delivery Date: {item.deliveryDate}</div>
                      <div>Visit Count: {item.visitCount}</div>
                    </>
                  )}

                  {item.category === "NCD" && (
                    <>
                      <div>BP: {item.bp}</div>
                      <div>Sugar: {item.sugar}</div>
                    </>
                  )}

                  {item.category === "TB" && (
                    <>
                      <div>Symptoms: {item.symptoms.join(", ")}</div>
                    </>
                  )}

                  {item.category === "Immunization" && (
                    <>
                      <div>Due Dose: {item.dueDose}</div>
                    </>
                  )}
                </div>

                <div className="mt-4 text-blue-600 font-medium text-sm">
                  View Details →
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
