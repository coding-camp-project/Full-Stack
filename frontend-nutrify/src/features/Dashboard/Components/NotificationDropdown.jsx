import { useState, useEffect, useRef } from "react";
import { 
  X, 
  Check, 
  Bell, 
  Activity, 
  AlertTriangle, 
  Flame, 
  Trophy, 
  Droplet,
  CheckCheck
} from "lucide-react";
import { getUserData } from "@/utils/userSession";
import { getDashboardSummary } from "@/features/History/services/historyService";
import { mapHistoryRecordToCardItem } from "@/features/History/utils/historyMappers";
import { generateNotifications } from "../utils/notificationGenerator";
import { calculateDailyNeeds } from "../utils/targetCalculator";

function NotificationDropdown({ onClose, onUnreadCountChange }) {
  const [loading, setLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState([]);
  const [totals, setTotals] = useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    sugar: 0,
    sodium: 0,
    fiber: 0,
  });
  const [readIds, setReadIds] = useState([]);
  const [activeTab, setActiveTab] = useState("Semua");
  const dropdownRef = useRef(null);

  const userData = getUserData();
  const userId = userData?.id || "guest";

  // Load totals and history on mount
  useEffect(() => {
    // 1. Load read IDs from localStorage
    const savedReadIds = localStorage.getItem(`readNotifications_${userId}`);
    if (savedReadIds) {
      try {
        setReadIds(JSON.parse(savedReadIds));
      } catch (err) {
        console.error("Gagal membaca status notifikasi dibaca", err);
      }
    }

    // 2. Fetch fresh summary from API (with local fallback)
    getDashboardSummary()
      .then((data) => {
        if (data) {
          setTotals(data.aggregatedNutrition || {
            calories: 0,
            carbs: 0,
            fat: 0,
            protein: 0,
            sugar: 0,
            sodium: 0,
            fiber: 0,
          });
          if (data.history) {
            setHistoryItems(data.history.map(mapHistoryRecordToCardItem));
          }
        }
      })
      .catch(() => {
        // Local fallback
        const localHistoryKey = `scanHistory_${userId}`;
        const historyStr = localStorage.getItem(localHistoryKey);
        let localHistory = [];
        if (historyStr) {
          try {
            const allItems = JSON.parse(historyStr);
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            localHistory = allItems.filter(item => {
              const itemTime = new Date(item.date || item.createdAt).getTime();
              return itemTime >= startOfToday.getTime();
            });
          } catch (parseErr) {
            console.error("Gagal membaca riwayat lokal", parseErr);
          }
        }
        const mappedItems = localHistory.map(mapHistoryRecordToCardItem);
        setHistoryItems(mappedItems);

        setTotals({
          calories: Math.round(mappedItems.reduce((sum, item) => sum + (item.calories || 0), 0)),
          carbs: Math.round(mappedItems.reduce((sum, item) => sum + (item.carbs || 0), 0)),
          fat: Math.round(mappedItems.reduce((sum, item) => sum + (item.fat || 0), 0)),
          protein: Math.round(mappedItems.reduce((sum, item) => sum + (item.protein || 0), 0)),
          sugar: Math.round(mappedItems.reduce((sum, item) => sum + (item.sugar || item.raw?.sugar || 0), 0)),
          sodium: Math.round(mappedItems.reduce((sum, item) => sum + (item.sodium || item.raw?.sodium || 0), 0)),
          fiber: Math.round(mappedItems.reduce((sum, item) => sum + (item.fiber || item.raw?.fiber || 0), 0)),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  // Generate dynamic notifications
  const rawNotifications = generateNotifications(userData, totals, historyItems);
  
  // Attach read status
  const allNotifications = rawNotifications.map(notif => ({
    ...notif,
    isRead: readIds.includes(notif.id),
  }));

  // Update unread count back to the navbar parent
  const unreadCount = allNotifications.filter(n => !n.isRead).length;
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Handlers
  const handleMarkAsRead = (id) => {
    if (readIds.includes(id)) return;
    const nextReadIds = [...readIds, id];
    setReadIds(nextReadIds);
    localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(nextReadIds));
  };

  const handleMarkAllAsRead = () => {
    const allIds = allNotifications.map(n => n.id);
    setReadIds(allIds);
    localStorage.setItem(`readNotifications_${userId}`, JSON.stringify(allIds));
  };

  // Filter based on active tab
  const filteredNotifications = allNotifications.filter(notif => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Hari Ini") return notif.category === "Hari Ini";
    if (activeTab === "Nutrisi") return notif.category === "Progress Nutrisi";
    if (activeTab === "Kesehatan") return notif.category === "Reminder Kesehatan";
    if (activeTab === "Achievement") return notif.category === "Achievement";
    return true;
  });

  const getIcon = (type, color) => {
    const size = 18;
    const stroke = 2.2;
    switch (type) {
      case "achievement":
        return <Trophy size={size} strokeWidth={stroke} className="text-[#33C267]" />;
      case "alert":
        return <AlertTriangle size={size} strokeWidth={stroke} className={color === "red" ? "text-red-500" : "text-amber-500"} />;
      case "progress":
        return <Flame size={size} strokeWidth={stroke} className="text-amber-500" />;
      case "reminder":
      default:
        return <Activity size={size} strokeWidth={stroke} className="text-[#4BAA7A]" />;
    }
  };

  const tabs = ["Semua", "Hari Ini", "Nutrisi", "Kesehatan", "Achievement"];

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-[calc(100%+0.5rem)] z-50 flex w-[calc(100vw-1.5rem)] sm:w-[28rem] flex-col overflow-hidden rounded-[22px] border border-[#E5E7EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 animate-in fade-in slide-in-from-top-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F1F1F1] px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-[#1E1E1E]">Pusat Kesehatan & Notifikasi</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 text-[12px] font-bold text-[#4BAA7A] hover:text-[#38855F] transition-colors cursor-pointer"
          >
            <CheckCheck size={14} />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#F1F1F1] px-3 overflow-x-auto scrollbar-none gap-1 bg-[#FAFDFB]">
        {tabs.map(tab => {
          const count = allNotifications.filter(n => {
            const matchesTab = 
              tab === "Semua" || 
              (tab === "Hari Ini" && n.category === "Hari Ini") ||
              (tab === "Nutrisi" && n.category === "Progress Nutrisi") ||
              (tab === "Kesehatan" && n.category === "Reminder Kesehatan") ||
              (tab === "Achievement" && n.category === "Achievement");
            return matchesTab && !n.isRead;
          }).length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-3 py-3 text-[13px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeTab === tab 
                  ? "text-[#4BAA7A]" 
                  : "text-gray-450 hover:text-[#1E1E1E]"
              }`}
            >
              {tab}
              {count > 0 && (
                <span className="ml-1 rounded-full bg-red-100 px-1 py-0.5 text-[10px] font-bold text-red-600">
                  {count}
                </span>
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-3 right-3 h-0.75 rounded-t-full bg-[#4BAA7A]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="max-h-[22rem] overflow-y-auto min-h-[12rem] flex flex-col">
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-150 border-t-[#4BAA7A]" />
            <span className="mt-2 text-xs font-semibold text-gray-400">Menganalisis nutrisi...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3FBF7] text-[#4BAA7A]">
              <Bell size={26} strokeWidth={1.8} />
            </div>
            <p className="mt-4 text-[14px] font-bold text-[#1E1E1E]">Semua Terpantau Aman</p>
            <p className="mt-1.5 max-w-xs text-[12px] leading-relaxed text-[#777]">
              Tidak ada peringatan atau status khusus saat ini. Selalu scan makanan dan minum air teratur!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F1F1F1] flex flex-col">
            {filteredNotifications.map(notif => {
              const bgOpacity = notif.color === "red" ? "bg-red-50" : notif.color === "yellow" ? "bg-amber-50" : "bg-[#F3FBF7]";
              const iconBg = notif.color === "red" ? "bg-red-100" : notif.color === "yellow" ? "bg-amber-100" : "bg-[#DDF5E8]";
              
              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`flex items-start gap-3.5 p-4 transition-all duration-150 cursor-pointer ${
                    notif.isRead ? "hover:bg-[#F9FAFB]" : `${bgOpacity} hover:opacity-95`
                  }`}
                >
                  {/* Icon */}
                  <div className={`mt-0.5 flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                    {getIcon(notif.type, notif.color)}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-[14px] font-bold truncate ${notif.isRead ? "text-[#333]" : "text-[#1E1E1E]"}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <div className="h-2 w-2 shrink-0 rounded-full bg-[#4BAA7A] shadow-[0_0_8px_#4BAA7A]" />
                      )}
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#555]">
                      {notif.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center border-t border-[#F1F1F1] bg-[#FAFDFB] px-5 py-3.5">
        <span className="text-[11px] font-bold text-[#777] leading-none">
          Dipantau Real-Time oleh Nutrify Health AI
        </span>
      </div>
    </div>
  );
}

export default NotificationDropdown;
