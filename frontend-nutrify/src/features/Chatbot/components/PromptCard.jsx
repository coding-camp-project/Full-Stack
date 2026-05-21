import { motion } from "framer-motion";

function PromptCard({
  icon,
  title,
  description,
  prompt,
  onSelect,
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect?.(prompt)}
      className="flex min-h-[9.5rem] w-full flex-col items-center justify-center rounded-2xl bg-white px-4 py-5 text-center shadow-sm transition-colors duration-200 hover:bg-[#F7FFFB] hover:shadow-lg sm:min-h-[9.375rem]"
    >
      
      <div className="mb-3 text-[#49AE84]">
        {icon}
      </div>

      <h3 className="text-[16px] font-semibold text-[#1E1E1E]">
        {title}
      </h3>

      <p className="mt-2 text-[12px] leading-normal text-[#777]">
        {description}
      </p>
    </motion.button>
  );
}

export default PromptCard;
