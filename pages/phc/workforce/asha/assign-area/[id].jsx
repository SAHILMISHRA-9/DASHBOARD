// // pages/phc/workforce/asha/assign-area/[id].jsx
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";
// import SidebarPHC from "../../../../../components/layout/SidebarPHC";
// import Navbar from "../../../../../components/layout/Navbar";
// import Link from "next/link";

// export default function AssignArea() {
//   const router = useRouter();
//   const { id } = router.query; // ASHA ID

//   const [asha, setAsha] = useState(null);
//   const [areas, setAreas] = useState([]);
//   const [selectedArea, setSelectedArea] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Load ASHA + Area list
//   useEffect(() => {
//     if (!id) return;

//     async function load() {
//       try {
//         const resAsha = await axios.get(`/api/phc/workforce/asha/${id}`);
//         setAsha(resAsha.data);
//         setSelectedArea(resAsha.data.area_id || "");

//         const resAreas = await axios.get("/api/phc/workforce/summary");
//         setAreas(resAreas.data?.areas || []);
//       } catch (err) {
//         console.error("Failed to load assign-area data:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [id]);

//   const save = async () => {
//     if (!selectedArea) {
//       alert("Please select an area");
//       return;
//     }

//     setSaving(true);

//     try {
//       await axios.post(`/api/phc/workforce/asha/assign-area/${id}`, {
//         area_id: Number(selectedArea),
//       });

//       alert("Area assigned successfully!");
//       router.push(`/phc/workforce/asha/${id}`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to assign area");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (!asha) return <div className="p-6">ASHA not found.</div>;

//   return (
//     <div className="flex min-h-screen">
//       <SidebarPHC />

//       <div className="flex-1 ml-60">
//         <Navbar />

//         <main className="p-6 mt-16 max-w-xl">
//           <h1 className="text-2xl font-bold mb-4">Assign Area to ASHA</h1>

//           {/* ASHA INFO */}
//           <div className="bg-white p-4 rounded shadow mb-6">
//             <p className="font-semibold">{asha.name}</p>
//             <p className="text-gray-600">Phone: {asha.phone}</p>
//           </div>

//           {/* SELECT AREA */}
//           <label className="block mb-2 font-medium">Select Area</label>
//           <select
//             className="w-full p-2 border rounded mb-6"
//             value={selectedArea}
//             onChange={(e) => setSelectedArea(e.target.value)}
//           >
//             <option value="">Choose Area</option>
//             {areas.map((area) => (
//               <option key={area.id} value={area.id}>
//                 {area.name}
//               </option>
//             ))}
//           </select>

//           {/* SAVE BUTTON */}
//           <button
//             disabled={saving}
//             onClick={save}
//             className="bg-purple-600 text-white px-4 py-2 rounded"
//           >
//             {saving ? "Saving…" : "Assign Area"}
//           </button>

//           <Link
//             href={`/phc/workforce/asha/${id}`}
//             className="ml-4 text-gray-700"
//           >
//             Cancel
//           </Link>
//         </main>
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AssignArea() {
  const router = useRouter();
  const { id } = router.query; // ASHA ID

  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    if (id) loadAreas(); 
  }, [id]);

  async function loadAreas() {
    try {
      const res = await axios.get("/api/phc/areas");
      setAreas(res.data || []);
    } catch (error) {
      console.error("Failed to load areas", error);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }

  async function assignArea() {
    try {
      await axios.post(`/api/phc/asha/assign-area/${id}`, {
        area_id: Number(areaId),
      });

      alert("Area assigned successfully!");
      router.back();
    } catch (err) {
      console.error(err);
      alert("Failed to assign area");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Assign Area to ASHA</h1>

      {loading ? (
        <p>Loading areas...</p>
      ) : (
        <div>
          <label className="block mb-2 font-semibold">Select Area</label>

          <select
            value={areaId}
            onChange={e => setAreaId(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          >
            <option value="">-- Select Area --</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.area_name || area.name}
              </option>
            ))}
          </select>

          <button
            onClick={assignArea}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
            disabled={!areaId}
          >
            Assign
          </button>
        </div>
      )}
    </div>
  );
}
