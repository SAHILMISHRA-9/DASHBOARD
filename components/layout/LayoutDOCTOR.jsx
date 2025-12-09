import SidebarDOCTOR from "./SidebarDOCTOR";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Navbar";

export default function LayoutDOCTOR({ children }) {
  return (
    <ProtectedRoute role="doctor">
      <div className="flex flex-col min-h-screen">

        {/* Top Navbar */}
        <Navbar />

        <div className="flex flex-1">
          <SidebarDOCTOR />
          <main className="flex-1 bg-gray-100 p-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
