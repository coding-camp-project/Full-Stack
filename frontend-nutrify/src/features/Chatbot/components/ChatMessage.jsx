import logo from "../../../assets/logo/Logo 2.png";

function ChatMessage({
  sender,
  message,
}) {
  const isBot = sender === "bot";

  return (
    <div
      className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`flex max-w-[85%] items-end gap-3 sm:max-w-[75%] ${
          isBot ? "flex-row" : "flex-row-reverse"
        }`}
      >
        
        {/* AVATAR */}
        <div
          className={`flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full ${
            isBot
              ? "bg-[#E8FFF4]"
              : "bg-[#DCFCE7]"
          }`}
        >
          {isBot ? (
            <img
              src={logo}
              alt="bot"
              className="h-6.5 w-6.5 object-contain"
            />
          ) : (
            <span className="text-[14px] font-semibold text-[#1E1E1E]">
              JD
            </span>
          )}
        </div>

        {/* MESSAGE */}
        <div
          className={`rounded-[22px] px-5 py-4 shadow-sm transition-all duration-300 ${
            isBot
              ? "border border-[#49AE84]/10 bg-white text-[#222]"
              : "bg-[#0AAE72] text-white shadow-[#0AAE72]/15"
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.8]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
