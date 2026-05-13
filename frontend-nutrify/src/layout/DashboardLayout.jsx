import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Components/DashboardSidebar";
import DashboardNavbar from "@/features/Dashboard/Components/DashboardNavbar";

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