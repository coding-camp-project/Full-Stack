import {
  LayoutDashboard,
  Bot,
  ScanSearch,
  History,
  Plus,
  LogOut,
  Sliders,
} from "lucide-react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

import logoNutrify from "../../../assets/logo/Logo 2.png";

const menuLinkClass = ({ isActive }) =>
  `relative z-20 flex h-11.5 w-full cursor-pointer items-center gap-3 rounded-xl px-5 text-[15px] transition-all duration-200 ${
    isActive
      ? "bg-[#F4F4F4] font-semibold text-[#69AF96] shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
      : "font-medium text-white hover:translate-x-1"
  }`;

const menuButtonClass =
  "relative z-20 flex h-11.5 w-full cursor-pointer items-center gap-3 rounded-xl px-5 text-[15px] font-medium text-white transition-all duration-200 hover:translate-x-1";

function DashboardSidebar() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLogout = async () => {
    try {
      // Clear manual login session details
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      
      // Clear Firebase session if active
      await signOut(auth);
      
      navigate("/");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <aside className="relative flex h-screen w-65 shrink-0 flex-col overflow-hidden bg-linear-to-b from-[#04A16E] to-[#036245] px-5 py-7">
      
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

        <h1 className="text-[28px] font-extrabold tracking-[0.18em] text-white">
          nutrify
        </h1>
      </div>

      {/* MENU */}
      <nav className="relative z-10 flex flex-col gap-6">
        
        {/* DASHBOARD */}
        <NavLink to="/dashboard" end className={menuLinkClass}>
          <LayoutDashboard size={18} strokeWidth={2.2} />

          <span>Dashboard</span>
        </NavLink>

        {/* CHATBOT */}
        <NavLink to="/chatbot" className={menuLinkClass}>
          <Bot size={18} strokeWidth={2.2} />

          <span>Chatbot</span>
        </NavLink>

        {/* SCAN */}
        <NavLink to="/scan" className={menuLinkClass}>
          <ScanSearch size={18} strokeWidth={2.2} />

          <span>Scan Nutrify</span>
        </NavLink>

        {/* HISTORY */}
        <NavLink to="/history" className={menuLinkClass}>
          <History size={18} strokeWidth={2.2} />

          <span>History</span>
        </NavLink>

        {/* PERSONALISASI */}
        <NavLink to="/personalisasi" className={menuLinkClass}>
          <Sliders size={18} strokeWidth={2.2} />

          <span>Personalisasi</span>
        </NavLink>
      </nav>

      {/* BOTTOM MENU */}
      <div className="relative z-10 mt-auto border-t border-white/20 pt-6">
        <div className="flex flex-col gap-5">
          
          {/* ACCOUNT */}
          <button 
            onClick={() => setSearchParams({ profile: "true" })}
            className={menuButtonClass}
          >
            <Plus size={18} strokeWidth={2.2} />

            <span>Account</span>
          </button>

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
