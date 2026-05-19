import { motion } from "framer-motion";

import logo from "../../../assets/logo/Logo 2.png";

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22 }}
      className="flex w-full justify-start"
    >
      <div className="flex max-w-[85%] items-end gap-3 sm:max-w-[75%]">
        <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full bg-[#E8FFF4]">
          <img src={logo} alt="Nutrify AI" className="h-6.5 w-6.5 object-contain" />
        </div>

        <div className="rounded-[22px] border border-[#49AE84]/10 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{ y: [0, -5, 0], opacity: [0.45, 1, 0.45] }}
                transition={{
                  delay: dot * 0.12,
                  duration: 0.68,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-2.5 w-2.5 rounded-full bg-[#49AE84] animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TypingIndicator;
