import { useState, useRef, useEffect } from "react";

import {
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import profileImage from "../../../assets/logo/Logo 2.png";

function DashboardNavbar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [user, setUser] = useState({ name: "John Doe", email: "johndoe@gmail.com" });

  const dropdownRef = useRef(null);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Gagal parse userData", e);
      }
    }
  }, []);

  // close dropdown when click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

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

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          
          {/* BUTTON */}
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-4 transition-all duration-200"
          >
            {/* AVATAR */}
            <div className="h-13 w-13 overflow-hidden rounded-full border-[3px] border-[#4BAA7A]">
              <img
                src={profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>

            {/* NAME */}
            <span className="text-[18px] font-semibold text-[#1E1E1E]">
              Hi, {user.name}
            </span>

            {/* ICON */}
            <ChevronDown
              size={26}
              strokeWidth={2.2}
              className={`text-[#4BAA7A] transition-transform duration-300 ${
                openDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN MENU */}
          {openDropdown && (
            <div className="absolute right-0 top-18 z-50 w-55 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              
              {/* TOP */}
              <div className="border-b border-[#F1F1F1] px-5 py-4">
                <p className="text-[16px] font-semibold text-[#1E1E1E]">
                  {user.name}
                </p>

                <p className="text-[13px] text-[#9CA3AF]">
                  {user.email}
                </p>
              </div>

              {/* MENU */}
              <div className="flex flex-col py-2">
                
                <button className="flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1E1E1E] transition-all hover:bg-[#F8F8F8]">
                  <User size={18} />
                  Profile
                </button>

                <button className="flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1E1E1E] transition-all hover:bg-[#F8F8F8]">
                  <Settings size={18} />
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;