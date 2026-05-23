import { Apple, Salad, SearchCheck } from "lucide-react";
import { motion } from "framer-motion";

const quickActions = [
  {
    icon: SearchCheck,
    label: "Analyze",
    prompt: "Analisis nutrisi makanan saya hari ini",
  },
  {
    icon: Salad,
    label: "Recommend",
    prompt: "Rekomendasi menu sehat untuk saya",
  },
  {
    icon: Apple,
    label: "Tips",
    prompt: "Berikan tips makan sehat yang mudah dilakukan",
  },
];

function QuickActionBar({ onSelectPrompt, disabled = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="mx-auto mt-2 flex w-full max-w-full overflow-x-auto no-scrollbar flex-nowrap items-center justify-center gap-2 px-4 pb-1.5 sm:mt-4 sm:max-w-3xl sm:flex-wrap sm:gap-3 sm:px-1 sm:pb-0 lg:max-w-4xl"
    >
      {quickActions.map(({ icon: Icon, label, prompt }) => (
        <motion.button
          key={label}
          type="button"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={disabled}
          onClick={() => onSelectPrompt(prompt)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#49AE84]/15 bg-white/90 px-3.5 py-2 text-xs font-medium text-[#245747] shadow-sm backdrop-blur transition-colors duration-200 hover:bg-[#E8FFF4] disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <Icon className="h-3.5 w-3.5 shrink-0 text-[#49AE84] sm:h-[17px] sm:w-[17px]" />
          {label}
        </motion.button>
      ))}
    </motion.div>
  );
}

export default QuickActionBar;
