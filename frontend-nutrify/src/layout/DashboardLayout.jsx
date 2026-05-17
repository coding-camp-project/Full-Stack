import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Component/DashboardSidebar";
import DashboardNavbar from "@/features/Dashboard/Component/DashboardNavbar";

function DashboardLayout() {
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