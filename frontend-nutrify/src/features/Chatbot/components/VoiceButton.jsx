import { Mic } from "lucide-react";
import { motion } from "framer-motion";

function VoiceButton({ listening = false, error = "", disabled = false, onClick }) {
  const stateClass = error
    ? "border-red-200 bg-red-50 text-red-500 shadow-red-200/70 hover:bg-red-100"
    : disabled
      ? "border-[#49AE84]/10 bg-[#49AE84]/5 text-[#49AE84]/45"
    : listening
      ? "border-[#49AE84]/40 bg-[#49AE84] text-white shadow-[0_0_28px_rgba(73,174,132,0.55)] hover:bg-[#3c9d75]"
      : "border-[#49AE84]/15 bg-[#49AE84]/10 text-[#49AE84] hover:bg-[#49AE84]/15 hover:shadow-[0_10px_24px_rgba(73,174,132,0.18)]";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.06 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      animate={listening ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={listening ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
      aria-label={listening ? "Stop voice input" : "Start voice input"}
      aria-pressed={listening}
      title={error || (disabled ? "Nutrify AI is responding" : listening ? "Stop listening" : "Start voice input")}
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-out disabled:cursor-not-allowed ${stateClass}`}
    >
      {listening && (
        <>
          <span className="absolute inset-0 rounded-full bg-[#49AE84]/30 animate-ping" />
          <span className="absolute -inset-1 rounded-full border border-[#49AE84]/30 animate-pulse" />
        </>
      )}

      <Mic className="relative z-10" size={21} strokeWidth={2.4} />
    </motion.button>
  );
}

export default VoiceButton;
