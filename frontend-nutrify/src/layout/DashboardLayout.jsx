import { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Components/DashboardSidebar";
import DashboardNavbar from "@/features/Dashboard/Components/DashboardNavbar";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // Jika belum personalisasi dan mencoba akses halaman lain di dashboard, redirect ke personalisasi
  if (userData.isPersonalized === false && location.pathname !== "/personalisasi") {
    return <Navigate to="/personalisasi" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 relative">
      {/* SIDEBAR OVERLAY for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:relative md:translate-x-0`}>
        <DashboardSidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* NAVBAR */}
        <DashboardNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* PAGE */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
