import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Components/DashboardSidebar";
import DashboardNavbar from "@/features/Dashboard/Components/DashboardNavbar";
import { useUserSession } from "@/hooks/useUserSession";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const location = useLocation();
  const { isOnboardingRequired, userData } = useUserSession();
  const isLoggedIn = Boolean(userData && userData.email);

  useEffect(() => {
    setIsRouteLoading(true);
    const timer = setTimeout(() => {
      setIsRouteLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

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

        <main className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {/* Route-change overlay – hidden on /personalisasi because that page
              renders its own full-page fetching spinner (avoids double loader). */}
          {isRouteLoading && location.pathname !== "/personalisasi" && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-100/60 backdrop-blur-[2px] transition-all duration-300">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#04A16E]" />
                <span className="text-xs font-semibold text-gray-500 tracking-wider">Memuat...</span>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

