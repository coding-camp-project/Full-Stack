import logo from "../../../assets/logo/Logo 2.png";

function ChatMessage({
  sender,
  message,
}) {
  const isBot = sender === "bot";

  const storedUser = localStorage.getItem("userData");
  let initials = "U";
  let userPhoto = null;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      userPhoto = parsed.profileImage || null;
      if (parsed.name) {
        initials = parsed.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div
      className={`flex w-full ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`flex max-w-[75%] items-end gap-3 ${
          isBot ? "flex-row" : "flex-row-reverse"
        }`}
      >
        
        {/* AVATAR */}
        <div
          className={`flex h-10.5 w-10.5 items-center justify-center rounded-full overflow-hidden ${
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
          ) : userPhoto ? (
            <img
              src={userPhoto}
              alt="User"
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <span className="text-[14px] font-semibold text-[#1E1E1E] select-none">
              {initials}
            </span>
          )}
        </div>

        {/* MESSAGE */}
        <div
          className={`rounded-[22px] px-5 py-4 shadow-xs whitespace-pre-line ${
            isBot
              ? "bg-white text-[#222]"
              : "bg-[#0AAE72] text-white"
          }`}
        >
          <p className="text-[15px] leading-[1.8]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
