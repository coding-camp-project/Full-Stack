import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Component/DashboardSidebar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <DashboardSidebar />

      
      {/* CONTENT */}
      <main className="flex-1 bg-gray-100">
        {/* NAVBAR */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h2 className="font-semibold text-lg">Overview</h2>

          <div>
            <p className="text-sm">Hi, John Doe</p>
          </div>
        </div>

        {/* PAGE */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;