import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import logo from "../../../assets/logo/Logo 2.png";

function ChatMessage({
  sender,
  message,
  streaming = false,
}) {
  const isBot = sender === "bot";
  const [user, setUser] = useState({ name: "User", profilePicture: "" });

  useEffect(() => {
    if (!isBot) {
      const storedUser = localStorage.getItem("userData") || sessionStorage.getItem("userData");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isBot]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const formatMessage = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return (
          <strong key={index} className="font-bold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`flex w-full ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`flex max-w-[min(85%,calc(100vw-4rem))] items-end gap-2 sm:max-w-[75%] sm:gap-3 ${
          isBot ? "flex-row" : "flex-row-reverse"
        }`}
      >
        
        {/* AVATAR */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex h-10.5 w-10.5 shrink-0 overflow-hidden items-center justify-center rounded-full ${
            isBot
              ? "bg-[#E8FFF4] shadow-[0_0_24px_rgba(73,174,132,0.18)]"
              : "bg-[#DCFCE7]"
          }`}
        >
          {isBot ? (
            <img
              src={logo}
              alt="bot"
              className="h-6.5 w-6.5 object-contain"
            />
          ) : user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="User"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[14px] font-semibold text-[#1E1E1E]">
              {getInitials(user.name)}
            </span>
          )}
        </motion.div>

        {/* MESSAGE */}
        <motion.div
          whileHover={{ y: -1 }}
          className={`min-w-0 rounded-[18px] px-4 py-3 shadow-sm transition-all duration-300 sm:rounded-[22px] sm:px-5 sm:py-4 ${
            isBot
              ? "border border-[#49AE84]/10 bg-white text-[#222]"
              : "bg-[#0AAE72] text-white shadow-[#0AAE72]/15"
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.8]">
            {formatMessage(message)}
            {streaming && (
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="ml-1 inline-block h-4 w-1 rounded-full bg-current align-[-2px]"
              />
            )}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ChatMessage;
