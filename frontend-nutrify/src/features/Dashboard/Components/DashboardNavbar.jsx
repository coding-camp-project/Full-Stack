import { useState, useRef, useEffect } from "react";

import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserSession } from "@/hooks/useUserSession";
import NotificationDropdown from "./NotificationDropdown";

import profileImage from "../../../assets/logo/Logo 2.png";

function DashboardNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { userData } = useUserSession();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = {
    name: userData.name || "Pengguna",
    email: userData.email || "pengguna@email.com",
    profilePicture: userData.profilePicture,
  };

  const dropdownRef = useRef(null);

  const handleOpenProfile = () => {
    setOpenDropdown(false);
    navigate("/personalisasi", { state: { mode: "edit" } });
  };

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
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#E7E7E7] bg-white px-3 sm:h-18 sm:px-4 md:px-6 lg:px-8">
      
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="shrink-0 text-[#4BAA7A] transition-all hover:scale-105 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Buka menu"
        >
          <Menu size={24} strokeWidth={2.1} className="sm:h-[26px] sm:w-[26px]" />
        </button>
        <h1 className="truncate text-base font-semibold text-[#1E1E1E] sm:text-[20px] md:block">
          Overview
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4 md:gap-6">
        
        {/* NOTIFICATION */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setOpenNotifications(!openNotifications);
              setOpenDropdown(false);
            }}
            className="relative shrink-0 text-[#4BAA7A] transition-all duration-200 hover:scale-105 cursor-pointer p-1 rounded-full hover:bg-gray-50"
            aria-label="Notifikasi"
          >
            <Bell size={22} strokeWidth={2.1} className="sm:h-[26px] sm:w-[26px]" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotifications && (
            <NotificationDropdown
              onClose={() => setOpenNotifications(false)}
              onUnreadCountChange={setUnreadCount}
            />
          )}
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="relative min-w-0" ref={dropdownRef}>
          
          {/* BUTTON */}
          <button
            type="button"
            onClick={() => {
              setOpenDropdown(!openDropdown);
              setOpenNotifications(false);
            }}
            className="flex max-w-full min-w-0 items-center gap-2 transition-all duration-200 sm:gap-3 md:gap-4"
          >
            {/* AVATAR */}
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-[3px] border-[#4BAA7A] sm:h-13 sm:w-13">
              <img
                src={user.profilePicture || profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>

            {/* NAME */}
            <span className="hidden max-w-[8rem] truncate text-sm font-semibold text-[#1E1E1E] sm:inline sm:max-w-[10rem] sm:text-base md:max-w-[14rem] md:text-[18px]">
              Hi, {user.name}
            </span>

            {/* ICON */}
            <ChevronDown
              size={22}
              strokeWidth={2.2}
              className={`shrink-0 text-[#4BAA7A] transition-transform duration-300 sm:h-[26px] sm:w-[26px] ${
                openDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN MENU */}
          {openDropdown && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(14rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:w-55">
              
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
                
                <button
                  type="button"
                  onClick={handleOpenProfile}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1E1E1E] transition-all hover:bg-[#F8F8F8]"
                >
                  <User size={18} />
                  Profile
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