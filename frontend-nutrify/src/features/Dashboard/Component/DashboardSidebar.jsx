
import {
  LayoutDashboard,
  Bot,
  ScanSearch,
  History,
  Plus,
} from "lucide-react";

import logoNutrify from "../../../assets/logo/Logo 2.png";

function DashboardSidebar() {
  return (
    <aside className="relative flex h-screen w-65 flex-col overflow-hidden bg-linear-to-b from-[#04A16E] to-[#036245] px-5 py-7">
      
      {/* BIG CIRCLE */}
      <div className="absolute -left-37.5 bottom-80 h-75 w-75 rounded-full border border-white/20" />

      {/* SMALL CIRCLE */}
      <div className="absolute -left-23.75 bottom-95 h-45 w-45 rounded-full border border-white/10" />

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
        
        {/* ACTIVE MENU */}
        <button className="flex h-11.5 items-center gap-3 rounded-[12px] bg-[#F4F4F4] px-5 text-[#69AF96] shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-all duration-200">
          <LayoutDashboard size={18} strokeWidth={2.2} />

          <span className="text-[15px] font-semibold">
            Dashboard
          </span>
        </button>

        {/* CHATBOT */}
        <button className="flex items-center gap-3 px-5 text-white transition-all duration-200 hover:translate-x-1">
          <Bot size={18} strokeWidth={2.2} />

          <span className="text-[15px] font-medium">
            Chatbot
          </span>
        </button>

        {/* SCAN */}
        <button className="flex items-center gap-3 px-5 text-white transition-all duration-200 hover:translate-x-1">
          <ScanSearch size={18} strokeWidth={2.2} />

          <span className="text-[15px] font-medium">
            Scan Nutrify
          </span>
        </button>

        {/* HISTORY */}
        <button className="flex items-center gap-3 px-5 text-white transition-all duration-200 hover:translate-x-1">
          <History size={18} strokeWidth={2.2} />

          <span className="text-[15px] font-medium">
            History
          </span>
        </button>
      </nav>

      {/* BOTTOM MENU */}
      <div className="relative z-10 mt-auto border-t border-white/20 pt-6">
        <div className="flex flex-col gap-5">
          
          {/* ACCOUNT */}
          <button className="flex items-center gap-3 px-5 text-white transition-all duration-200 hover:translate-x-1">
            <Plus size={18} strokeWidth={2.2} />

            <span className="text-[15px] font-medium">
              Account
            </span>
          </button>

          {/* LOGOUT */}
          <button className="flex items-center gap-3 px-5 text-white transition-all duration-200 hover:translate-x-1">
            <Plus size={18} strokeWidth={2.2} />

            <span className="text-[15px] font-medium">
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;