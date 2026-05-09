import { Bell, ChevronDown } from "lucide-react";

import profileImage from "../../../assets/logo/Logo 2.png";

function DashboardNavbar() {
  return (
    <header className="flex h-18 items-center justify-between border-b border-[#E7E7E7] bg-white px-8">
      
      {/* LEFT */}
      <div>
        <h1 className="text-[20px] font-semibold text-[#1E1E1E]">
          Overview
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-8">
        
        {/* NOTIFICATION */}
        <button className="text-[#4BAA7A] transition-all duration-200 hover:scale-105">
          <Bell size={26} strokeWidth={2.1} />
        </button>

        {/* PROFILE */}
        <button className="flex items-center gap-2 transition-all duration-200">
          
          {/* AVATAR */}
          <div className="h-10.5 w-10.5 overflow-hidden rounded-full border-4 border-[#4BAA7A]">
            <img
              src={profileImage}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>

          {/* NAME */}
          <span className="text-[22px] font-semibold text-[#1E1E1E]">
            Hi, John Doe
          </span>

          {/* DROPDOWN */}
          <ChevronDown
            size={32}
            strokeWidth={2.3}
            className="text-[#4BAA7A]"
          />
        </button>
      </div>
    </header>
  );
}

export default DashboardNavbar;