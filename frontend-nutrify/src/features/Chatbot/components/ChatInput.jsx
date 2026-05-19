import { useState } from "react";
import { Mic, SendHorizontal } from "lucide-react";
import logo from "../../../assets/logo/Logo 2.png";

function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !loading) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="mx-auto mt-6 flex w-full max-w-[950px] items-center rounded-full border border-[#222]/20 bg-white px-5 py-2.5 shadow-sm transition-all focus-within:border-[#0AAE72] focus-within:ring-1 focus-within:ring-[#0AAE72]/30"
    >
      
      {/* LEFT */}
      <div className="flex flex-1 items-center gap-3">
        <img
          src={logo}
          alt="logo"
          className="h-8 w-8 object-contain select-none"
        />

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder={loading ? "Nutrify AI sedang berpikir..." : "Tanya apa saja seputar kesehatan & gizi..."}
          className="w-full border-none bg-transparent text-[15px] text-[#333] outline-none placeholder:text-[#999] disabled:cursor-not-allowed"
        />
      </div>

      {/* RIGHT */}
      <div className="ml-4 flex items-center gap-3">
        <button 
          type="button"
          disabled={loading}
          className="text-[#49AE84] hover:text-[#3e9570] transition-colors p-1.5 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mic size={20} />
        </button>

        <button 
          type="submit"
          disabled={!text.trim() || loading}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;
