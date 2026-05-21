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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto w-full max-w-full rounded-[20px] bg-linear-to-b from-[#0AAE72] to-[#07895A] p-5 shadow-xl sm:max-w-2xl sm:rounded-[28px] sm:p-8 lg:max-w-3xl lg:p-10"
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
      <h1 className="mt-5 text-center text-2xl font-semibold leading-[1.2] text-white sm:text-4xl lg:text-[48px]">
        Your AI nutrition coach
      </h1>

      {/* DESC */}
      <p className="mx-auto mt-4 max-w-full px-2 text-center text-sm leading-[1.7] text-white/80 sm:max-w-lg sm:px-0">
        Ask about calories, balanced meals, nutrition goals, and healthy
        choices in real-time.
      </p>

      {/* PROMPTS */}
      <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
