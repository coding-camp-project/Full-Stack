import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Component/DashboardSidebar";
import DashboardNavbar from "@/features/Dashboard/Component/DashboardNavbar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <DashboardSidebar />

      
      {/* CONTENT */}
      <main className="flex-1 bg-gray-100">
        {/* NAVBAR */}
        <DashboardNavbar />

        {/* PAGE */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;