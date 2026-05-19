import {
  Bookmark,
  Sparkles,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";

import PromptCard from "./PromptCard";

import logo from "../../../assets/logo/Logo 2.png";

const promptSuggestions = [
  {
    icon: <Bookmark size={24} />,
    title: "Kalori Makanan",
    description: "Cek estimasi kalori makanan populer.",
    prompt: "Berapa kalori nasi goreng?",
  },
  {
    icon: <Sparkles size={24} />,
    title: "Diet Sehat",
    description: "Dapatkan rekomendasi pola makan sehat.",
    prompt: "Rekomendasi diet sehat",
  },
  {
    icon: <UserRound size={24} />,
    title: "Protein Tinggi",
    description: "Temukan menu tinggi protein harian.",
    prompt: "Menu protein tinggi",
  },
];

function WelcomeCard({ onPromptSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-155 rounded-[28px] bg-linear-to-b from-[#0AAE72] to-[#07895A] p-6 shadow-xl sm:p-10"
    >
      
      {/* LOGO */}
      <div className="flex justify-center">
        <img
          src={logo}
          alt="logo"
          className="h-13 w-13 object-contain"
        />
      </div>

      {/* TITLE */}
      <h1 className="mt-5 text-center text-[34px] font-semibold leading-[1.2] text-white sm:text-[48px]">
        Your AI nutrition coach
      </h1>

      {/* DESC */}
      <p className="mx-auto mt-4 max-w-500 text-center text-[14px] leading-[1.7] text-white/80">
        Ask about calories, balanced meals, nutrition goals, and healthy
        choices in real-time.
      </p>

      {/* PROMPTS */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
        {promptSuggestions.map((suggestion) => (
          <PromptCard
            key={suggestion.title}
            icon={suggestion.icon}
            title={suggestion.title}
            description={suggestion.description}
            prompt={suggestion.prompt}
            onSelect={onPromptSelect}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default WelcomeCard;
