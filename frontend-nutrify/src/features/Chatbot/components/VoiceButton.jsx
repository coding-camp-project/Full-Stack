import { Mic } from "lucide-react";

function VoiceButton({ listening = false, error = "", onClick }) {
  const stateClass = error
    ? "border-red-200 bg-red-50 text-red-500 shadow-red-200/70 hover:bg-red-100"
    : listening
      ? "border-[#49AE84]/40 bg-[#49AE84] text-white shadow-[0_0_28px_rgba(73,174,132,0.55)] hover:bg-[#3c9d75]"
      : "border-[#49AE84]/15 bg-[#49AE84]/10 text-[#49AE84] hover:bg-[#49AE84]/15 hover:shadow-[0_10px_24px_rgba(73,174,132,0.18)]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={listening ? "Stop voice input" : "Start voice input"}
      aria-pressed={listening}
      title={error || (listening ? "Stop listening" : "Start voice input")}
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${stateClass}`}
    >
      {listening && (
        <>
          <span className="absolute inset-0 rounded-full bg-[#49AE84]/30 animate-ping" />
          <span className="absolute -inset-1 rounded-full border border-[#49AE84]/30 animate-pulse" />
        </>
      )}

      <Mic className="relative z-10" size={21} strokeWidth={2.4} />
    </button>
  );
}

export default VoiceButton;
