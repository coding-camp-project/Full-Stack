import { Square, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

import logo from "../../../assets/logo/Logo 2.png";

const waveformBars = ["h-3", "h-6", "h-9", "h-5", "h-8", "h-4", "h-7", "h-3"];

function SpeakingIndicator({ onStop }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ duration: 0.24 }}
      className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-full border border-[#49AE84]/20 bg-white/95 px-4 py-3 text-[#245747] shadow-[0_18px_44px_rgba(29,69,53,0.14)] backdrop-blur-md"
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8FFF4]">
        <motion.span
          animate={{ scale: [1, 1.28, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-[#49AE84]/20"
        />
        <img src={logo} alt="Nutrify AI" className="relative z-10 h-6 w-6 object-contain" />
      </div>

      <div className="flex items-center gap-2">
        <Volume2 size={18} className="text-[#49AE84]" />
        <div className="flex h-9 items-center gap-1">
          {waveformBars.map((height, index) => (
            <motion.span
              key={height + index}
              animate={{ scaleY: [0.35, 1.25, 0.55] }}
              transition={{
                delay: index * 0.06,
                duration: 0.58,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`${height} w-1.5 rounded-full bg-[#49AE84] animate-pulse`}
            />
          ))}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onStop}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#1E1E1E] text-white transition-all duration-200 hover:scale-105 hover:bg-black active:scale-95"
        aria-label="Stop AI speech"
        title="Stop speaking"
      >
        <Square size={14} fill="currentColor" />
      </motion.button>
    </motion.div>
  );
}

export default SpeakingIndicator;
