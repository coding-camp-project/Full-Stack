import { Square, Volume2 } from "lucide-react";

import logo from "../../../assets/logo/Logo 2.png";

const waveformBars = ["h-3", "h-6", "h-9", "h-5", "h-8", "h-4", "h-7", "h-3"];

function SpeakingIndicator({ onStop }) {
  return (
    <div className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-full border border-[#49AE84]/20 bg-white/95 px-4 py-3 text-[#245747] shadow-[0_18px_44px_rgba(29,69,53,0.14)] backdrop-blur-md">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8FFF4]">
        <span className="absolute inset-0 rounded-full bg-[#49AE84]/20 animate-ping" />
        <img src={logo} alt="Nutrify AI" className="relative z-10 h-6 w-6 object-contain" />
      </div>

      <div className="flex items-center gap-2">
        <Volume2 size={18} className="text-[#49AE84]" />
        <div className="flex h-9 items-center gap-1">
          {waveformBars.map((height, index) => (
            <span
              key={height + index}
              className={`${height} w-1.5 rounded-full bg-[#49AE84] animate-pulse`}
              style={{
                animationDelay: `${index * 75}ms`,
                animationDuration: "680ms",
              }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onStop}
        className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#1E1E1E] text-white transition-all duration-200 hover:scale-105 hover:bg-black active:scale-95"
        aria-label="Stop AI speech"
        title="Stop speaking"
      >
        <Square size={14} fill="currentColor" />
      </button>
    </div>
  );
}

export default SpeakingIndicator;
