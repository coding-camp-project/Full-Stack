import {
  Bookmark,
  Sparkles,
  UserRound,
} from "lucide-react";

import PromptCard from "./PromptCard";

import logo from "../../../assets/logo/Logo 2.png";

function WelcomeCard() {
  return (
    <div className="w-full max-w-155 rounded-[28px] bg-linear-to-b from-[#0AAE72] to-[#07895A] p-10 shadow-xl">
      
      {/* LOGO */}
      <div className="flex justify-center">
        <img
          src={logo}
          alt="logo"
          className="h-13 w-13 object-contain"
        />
      </div>

      {/* TITLE */}
      <h1 className="mt-5 text-center text-[48px] font-semibold leading-[1.2] text-white">
        How can i help you today?
      </h1>

      {/* DESC */}
      <p className="mx-auto mt-4 max-w-500 text-center text-[14px] leading-[1.7] text-white/80">
        This AI assistant can help analyze nutrition,
        recommend healthy foods, and answer your
        dietary questions in real-time.
      </p>

      {/* PROMPTS */}
      <div className="mt-10 flex items-center justify-center gap-5">
        
        <PromptCard
          icon={<Bookmark size={24} />}
          title="Nutrition Tips"
          description="Get healthy eating recommendations instantly."
        />

        <PromptCard
          icon={<Sparkles size={24} />}
          title="Meal Analysis"
          description="Analyze calories and nutrition from food."
        />

        <PromptCard
          icon={<UserRound size={24} />}
          title="Personal Advice"
          description="Receive AI guidance based on your profile."
        />
      </div>
    </div>
  );
}

export default WelcomeCard;
