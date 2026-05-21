import {
  LayoutDashboard,
  Bot,
  ScanSearch,
  History,
  Plus,
  LogOut,
  Sliders,
  Lock,
  Home,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useUserSession } from "@/hooks/useUserSession";
import { clearUserSession } from "@/utils/userSession";

import logoNutrify from "../../../assets/logo/Logo 2.png";

const menuLinkClass = ({ isActive }) =>
  `relative z-20 flex h-11.5 w-full cursor-pointer items-center gap-3 rounded-xl px-5 text-[15px] transition-all duration-200 ${
    isActive
      ? "bg-[#F4F4F4] font-semibold text-[#69AF96] shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
      : "font-medium text-white hover:translate-x-1"
  }`;

const menuButtonClass =
  "relative z-20 flex h-11.5 w-full cursor-pointer items-center gap-3 rounded-xl px-5 text-[15px] font-medium text-white transition-all duration-200 hover:translate-x-1";

function DashboardSidebar({ setIsSidebarOpen }) {
  const navigate = useNavigate();
  const { isPersonalized, isOnboardingRequired } = useUserSession();

  const handleLogout = async () => {
    try {
      // Clear manual login session details (both localStorage and sessionStorage)
      clearUserSession();
      
      // Clear Firebase session if active
      await signOut(auth);
      
      navigate("/");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <aside className="relative flex h-full min-h-dvh w-full shrink-0 flex-col overflow-hidden bg-linear-to-b from-[#04A16E] to-[#036245] px-4 py-6 sm:px-5 sm:py-7 lg:w-65">
      
      {/* BIG CIRCLE */}
      <div className="absolute -left-37.5 bottom-45 h-65 w-65 rounded-full border border-white/20" />

      {/* SMALL CIRCLE */}
      <div className="absolute -left-23.75 bottom-55 h-45 w-45 rounded-full border border-white/10" />

      {/* LOGO */}
      <div className="relative z-10 mb-14 flex items-center gap-3">
        <img
          src={logoNutrify}
          alt="Nutrify Logo"
          className="h-10.5 w-10.5 object-contain"
        />

        <h1 className="truncate text-2xl font-extrabold tracking-[0.12em] text-white sm:text-[28px] sm:tracking-[0.18em]">
          nutrify
        </h1>
      </div>

      {/* MENU */}
      <nav className="relative z-10 flex flex-col gap-6">
        
        {/* DASHBOARD */}
        <NavLink onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} to={isPersonalized ? "/dashboard" : "/personalisasi"} end className={menuLinkClass}>
          <LayoutDashboard size={18} strokeWidth={2.2} />

          <span>Dashboard</span>
          {!isPersonalized && <Lock size={16} className="ml-auto opacity-70" />}
        </NavLink>

        {/* CHATBOT */}
        <NavLink onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} to={isPersonalized ? "/chatbot" : "/personalisasi"} className={menuLinkClass}>
          <Bot size={18} strokeWidth={2.2} />

          <span>Chatbot</span>
          {!isPersonalized && <Lock size={16} className="ml-auto opacity-70" />}
        </NavLink>

        {/* SCAN */}
        <NavLink onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} to={isPersonalized ? "/scan" : "/personalisasi"} className={menuLinkClass}>
          <ScanSearch size={18} strokeWidth={2.2} />

          <span>Scan Nutrify</span>
          {!isPersonalized && <Lock size={16} className="ml-auto opacity-70" />}
        </NavLink>

        {/* HISTORY */}
        <NavLink onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} to={isPersonalized ? "/history" : "/personalisasi"} className={menuLinkClass}>
          <History size={18} strokeWidth={2.2} />

          <span>History</span>
          {!isPersonalized && <Lock size={16} className="ml-auto opacity-70" />}
        </NavLink>

        {/* PERSONALISASI – only during onboarding */}
        {isOnboardingRequired && (
          <NavLink onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} to="/personalisasi" className={menuLinkClass}>
            <Sliders size={18} strokeWidth={2.2} />

            <span>Personalisasi</span>
          </NavLink>
        )}
      </nav>

      {/* BOTTOM MENU */}
      <div className="relative z-10 mt-auto border-t border-white/20 pt-6">
        <div className="flex flex-col gap-5">
          {/* LANDING PAGE */}
          <Link to="/" className={menuButtonClass}>
            <Home size={18} strokeWidth={2.2} />
            <span>Kembali ke Home</span>
          </Link>

          {/* LOGOUT */}
          <button onClick={handleLogout} className={menuButtonClass}>
            <LogOut size={18} strokeWidth={2.2} />

            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
