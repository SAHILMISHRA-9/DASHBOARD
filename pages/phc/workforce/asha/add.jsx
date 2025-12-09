// // pages/phc/workforce/asha/add.jsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import SidebarPHC from "../../../../components/layout/SidebarPHC";
// import Navbar from "../../../../components/layout/Navbar";
// import Link from "next/link";

// export default function AddASHA() {
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     password: "",
//     area_id: "",
//   });

//   const [areas, setAreas] = useState([]);
//   const [saving, setSaving] = useState(false);

//   // Load Area list
//   useEffect(() => {
//     async function load() {
//       try {
//         // If you have a Next.js API route that proxies to backend:
//         const resAreas = await axios.get("/api/phc/areas");

//         // Handle both shapes:
//         // 1) [ { ... } ]
//         // 2) { areas: [ { ... } ] }
//         const list = Array.isArray(resAreas.data)
//           ? resAreas.data
//           : resAreas.data.areas || [];

//         setAreas(list);
//       } catch (err) {
//         console.error("Failed to load areas:", err.response?.data || err.message);
//         setAreas([]);
//       }
//     }
//     load();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const submit = async () => {
//     // Basic validation
//     if (!form.name || !form.phone || !form.password || !form.area_id) {
//       alert("Name, Phone, Password, and Area are required");
//       return;
//     }

//     setSaving(true);

//     try {
//       const token = localStorage.getItem("auth_token");

//       await axios.post(
//         "/api/phc/workforce/asha-list",
//         {
//           name: form.name,
//           phone: form.phone,
//           password: form.password,
//           // depends on backend – right now you send an array of area ids
//           areas: [form.area_id],
//         },
//         {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         }
//       );

//       alert("ASHA added successfully!");
//       window.location.href = "/phc/workforce/asha";
//     } catch (err) {
//       console.error("Error adding ASHA worker:", err.response?.data || err.message);
//       alert("Error adding ASHA worker");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       <SidebarPHC />

//       <div className="flex-1 ml-60">
//         <Navbar />

//         <main className="p-6 mt-16 max-w-2xl">
//           <h1 className="text-2xl font-bold mb-4">Add ASHA Worker</h1>

//           {/* NAME */}
//           <label className="block mb-2 font-medium">Name</label>
//           <input
//             name="name"
//             className="w-full p-2 border rounded mb-4"
//             placeholder="Enter ASHA Name"
//             onChange={handleChange}
//           />

//           {/* PHONE */}
//           <label className="block mb-2 font-medium">Phone</label>
//           <input
//             name="phone"
//             className="w-full p-2 border rounded mb-4"
//             placeholder="Phone Number"
//             onChange={handleChange}
//           />

//           {/* PASSWORD */}
//           <label className="block mb-2 font-medium">Password</label>
//           <input
//             name="password"
//             type="password"
//             className="w-full p-2 border rounded mb-4"
//             placeholder="Password"
//             onChange={handleChange}
//           />

//           {/* AREA SELECT */}
//           <label className="block mb-2 font-medium">Assign Area</label>
//           <select
//             name="area_id"
//             value={form.area_id}
//             className="w-full p-2 border rounded mb-6 bg-white text-black"
//             onChange={handleChange}
//           >
//             <option value="">Select Area</option>
//             {areas.map((area) => (
//               <option key={area.id} value={area.id}>
//                 {area.area_name || area.name || "Unnamed Area"}
//               </option>
//             ))}
//           </select>

//           {/* SAVE BUTTON */}
//           <button
//             disabled={saving}
//             onClick={submit}
//             className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
//           >
//             {saving ? "Saving…" : "Save ASHA"}
//           </button>

//           <Link href="/phc/workforce/asha" className="ml-4 text-gray-700">
//             Cancel
//           </Link>
//         </main>
//       </div>
//     </div>
//   );
// }








// pages/phc/workforce/asha/add.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import SidebarPHC from "../../../../components/layout/SidebarPHC";
import Navbar from "../../../../components/layout/Navbar";
import Link from "next/link";

export default function AddASHA() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    area_id: "",
  });

  const [areas, setAreas] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load Area list
  useEffect(() => {
    async function load() {
      try {
        const resAreas = await axios.get("/api/phc/areas");

        // Our /api/phc/areas will return just an array
        setAreas(resAreas.data || []);
      } catch (err) {
        console.error(
          "Failed to load areas:",
          err.response?.data || err.message
        );
        setAreas([]);
      }
    }

    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.name || !form.phone || !form.password || !form.area_id) {
      alert("Name, Phone, Password, and Area are required");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("auth_token");

      await axios.post(
        "/api/phc/workforce/asha-list",
        {
          name: form.name,
          phone: form.phone,
          password: form.password,
          areas: [form.area_id], // send as array of area IDs
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      alert("ASHA added successfully!");
      window.location.href = "/phc/workforce/asha";
    } catch (err) {
      console.error(
        "Error adding ASHA worker:",
        err.response?.data || err.message
      );
      alert(
        "Error adding ASHA worker: " +
          (err.response?.data?.message || "Check console for details")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarPHC />

      <div className="flex-1 ml-60">
        <Navbar />

        <main className="p-6 mt-16 max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Add ASHA Worker</h1>

          {/* NAME */}
          <label className="block mb-2 font-medium">Name</label>
          <input
            name="name"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter ASHA Name"
            onChange={handleChange}
          />

          {/* PHONE */}
          <label className="block mb-2 font-medium">Phone</label>
          <input
            name="phone"
            className="w-full p-2 border rounded mb-4"
            placeholder="Phone Number"
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <label className="block mb-2 font-medium">Password</label>
          <input
            name="password"
            type="password"
            className="w-full p-2 border rounded mb-4"
            placeholder="Password"
            onChange={handleChange}
          />

          {/* AREA SELECT */}
          <label className="block mb-2 font-medium">Assign Area</label>
          <select
            name="area_id"
            value={form.area_id}
            className="w-full p-2 border rounded mb-6 bg-white text-black"
            onChange={handleChange}
          >
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.area_name || area.name || "Unnamed Area"}
              </option>
            ))}
          </select>

          {/* SAVE BUTTON */}
          <button
            disabled={saving}
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save ASHA"}
          </button>

          <Link href="/phc/workforce/asha" className="ml-4 text-gray-700">
            Cancel
          </Link>
        </main>
      </div>
    </div>
  );
}
