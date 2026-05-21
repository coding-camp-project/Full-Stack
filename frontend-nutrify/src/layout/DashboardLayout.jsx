import { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Components/DashboardSidebar";
import DashboardNavbar from "@/features/Dashboard/Components/DashboardNavbar";
import { useUserSession } from "@/hooks/useUserSession";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { isOnboardingRequired } = useUserSession();

  if (isOnboardingRequired && location.pathname !== "/personalisasi") {
    return <Navigate to="/personalisasi" replace />;
  }

  return (
    <div className="relative flex h-dvh min-h-0 w-full max-w-[100vw] overflow-hidden bg-gray-100">
      {/* SIDEBAR OVERLAY – mobile & tablet */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR – drawer until lg, fixed on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(100vw,17rem)] shrink-0 transform transition-transform duration-300 lg:relative lg:w-auto lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* CONTENT */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
