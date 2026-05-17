import {
  Mic,
  SendHorizontal,
} from "lucide-react";

import logo from "../../../assets/logo/Logo 2.png";

function ChatInput() {
  return (
    <div className="mx-auto mt-10 flex w-full max-w-325 items-center rounded-full border border-[#222]/30 bg-white px-5 py-3 shadow-sm">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        <img
          src={logo}
          alt="logo"
          className="h-8.5 w-8.5 object-contain"
        />

        <input
          type="text"
          placeholder="ask anything!"
          className="w-full min-w-225 border-none bg-transparent text-[15px] text-[#333] outline-none placeholder:text-[#999]"
        />
      </div>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-4">
        
        <button className="text-[#49AE84]">
          <Mic size={22} />
        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-all duration-200 hover:scale-105">
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
