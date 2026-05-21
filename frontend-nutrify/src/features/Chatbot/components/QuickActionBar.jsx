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
      className="mx-auto mt-3 flex w-full max-w-full flex-wrap items-center justify-center gap-2 px-1 sm:mt-4 sm:max-w-3xl sm:gap-3 lg:max-w-4xl"
    >
      {quickActions.map(({ icon: Icon, label, prompt }) => (
        <motion.button
          key={label}
          type="button"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={disabled}
          onClick={() => onSelectPrompt(prompt)}
          className="flex items-center gap-2 rounded-full border border-[#49AE84]/15 bg-white/90 px-4 py-2.5 text-sm font-medium text-[#245747] shadow-sm backdrop-blur transition-colors duration-200 hover:bg-[#E8FFF4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon size={17} className="text-[#49AE84]" />
          {label}
        </motion.button>
      ))}
    </motion.div>
  );
}

export default QuickActionBar;
