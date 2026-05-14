import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Components/DashboardSidebar";
import DashboardNavbar from "@/features/Dashboard/Components/DashboardNavbar";

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <DashboardSidebar />

      
      {/* CONTENT */}
      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-gray-100">
        {/* NAVBAR */}
        <DashboardNavbar />

        {/* PAGE */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
