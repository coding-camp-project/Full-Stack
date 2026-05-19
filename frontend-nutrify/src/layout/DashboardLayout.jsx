import { Outlet, useSearchParams } from "react-router-dom";
import DashboardSidebar from "@/features/Dashboard/Components/DashboardSidebar";
import DashboardNavbar from "@/features/Dashboard/Components/DashboardNavbar";
import ProfileModal from "@/features/Dashboard/Components/ProfileModal";

function DashboardLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isProfileOpen = searchParams.get("profile") === "true";

  const handleCloseProfile = () => {
    searchParams.delete("profile");
    setSearchParams(searchParams);
  };

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

      {/* PROFILE SETTINGS MODAL */}
      {isProfileOpen && (
        <ProfileModal onClose={handleCloseProfile} />
      )}
    </div>
  );
}

export default DashboardLayout;
