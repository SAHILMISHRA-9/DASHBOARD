import SidebarANM from "../../../../components/layout/SidebarANM.jsx";
import Navbar from "../../../../components/layout/Navbar";


export default function HighRisk() {
return (
<div className="flex min-h-screen">
<SidebarANM />
<div className="flex-1">
<Navbar />
<main className="p-6 container">
<h1 className="text-2xl font-bold mb-4">High Risk Dashboard</h1>
<div className="bg-white rounded p-4 shadow">This will aggregate high-risk cases.</div>
</main>
</div>
</div>
)
}