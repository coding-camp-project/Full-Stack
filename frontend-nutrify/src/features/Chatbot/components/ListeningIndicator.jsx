import { motion } from "framer-motion";

const waveformBars = ["h-3", "h-5", "h-8", "h-4", "h-7", "h-5", "h-3"];

function ListeningIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.96 }}
      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
      exit={{ opacity: 0, y: 8, x: "-50%", scale: 0.96 }}
      transition={{ duration: 0.22 }}
      className="pointer-events-none absolute -top-12 left-1/2 z-20 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-[#49AE84]/20 bg-white/90 px-3 py-2 text-[#245747] shadow-[0_18px_44px_rgba(29,69,53,0.14)] backdrop-blur-md sm:-top-15 sm:gap-3 sm:px-4 sm:py-2.5"
    >
      <div className="flex h-8 items-center gap-1">
        {waveformBars.map((height, index) => (
          <motion.span
            key={height + index}
            animate={{ scaleY: [0.45, 1.2, 0.55] }}
            transition={{
              delay: index * 0.07,
              duration: 0.62,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`${height} w-1.5 rounded-full bg-[#49AE84] animate-pulse`}
          />
        ))}
      </div>

      <span className="truncate text-xs font-medium sm:text-sm">Listening...</span>
    </motion.div>
  );
}

export default ListeningIndicator;
