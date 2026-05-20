import { Outlet, Navigate, useLocation } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Components/DashboardSidebar";
import DashboardNavbar from "@/features/Dashboard/Components/DashboardNavbar";

function DashboardLayout() {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // Jika belum personalisasi dan mencoba akses halaman lain di dashboard, redirect ke personalisasi
  if (userData.isPersonalized === false && location.pathname !== "/personalisasi") {
    return <Navigate to="/personalisasi" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* SIDEBAR */}
      <DashboardSidebar />

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* NAVBAR */}
        <DashboardNavbar />

        {/* PAGE */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
