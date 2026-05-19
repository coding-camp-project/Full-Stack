import logo from "../../../assets/logo/Logo 2.png";

function TypingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex max-w-[85%] items-end gap-3 sm:max-w-[75%]">
        <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full bg-[#E8FFF4]">
          <img src={logo} alt="Nutrify AI" className="h-6.5 w-6.5 object-contain" />
        </div>

        <div className="rounded-[22px] border border-[#49AE84]/10 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-2.5 w-2.5 rounded-full bg-[#49AE84] animate-pulse"
                style={{
                  animationDelay: `${dot * 140}ms`,
                  animationDuration: "720ms",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
