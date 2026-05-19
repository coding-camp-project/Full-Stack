import {
  Bookmark,
  Sparkles,
  UserRound,
} from "lucide-react";

import PromptCard from "./PromptCard";

import logo from "../../../assets/logo/Logo 2.png";

function WelcomeCard({ onPromptClick }) {
  return (
    <div className="w-full max-w-[550px] rounded-[24px] bg-linear-to-b from-[#0AAE72] to-[#07895A] p-6 md:p-8 shadow-lg select-none">
      
      {/* LOGO */}
      <div className="flex justify-center">
        <img
          src={logo}
          alt="logo"
          className="h-10 w-10 object-contain"
        />
      </div>

      {/* TITLE */}
      <h1 className="mt-3.5 text-center text-[28px] md:text-[32px] font-bold leading-[1.25] text-white tracking-tight">
        Ada yang bisa saya bantu?
      </h1>

      {/* DESC */}
      <p className="mx-auto mt-3 max-w-[420px] text-center text-[13px] leading-relaxed text-white/90">
        Asisten AI Nutrify siap membantu Anda menganalisis gizi,
        merekomendasikan makanan sehat, dan menjawab pertanyaan seputar diet secara instan.
      </p>

      {/* PROMPTS */}
      <div className="mt-6 flex items-center justify-center gap-4">
        
        <PromptCard
          icon={<Bookmark size={20} />}
          title="Tips Nutrisi"
          description="Rekomendasi pola makan sehat instan."
          onClick={() => onPromptClick("Berikan saya beberapa tips gizi untuk makan sehat hari ini.")}
        />

        <PromptCard
          icon={<Sparkles size={20} />}
          title="Analisis Makanan"
          description="Analisis kalori dan zat gizi dari hidangan."
          onClick={() => onPromptClick("Bagaimana cara menganalisis kandungan kalori dan nutrisi dari makanan saya?")}
        />

        <PromptCard
          icon={<UserRound size={20} />}
          title="Saran Personal"
          description="Panduan AI berbasis profil kesehatan Anda."
          onClick={() => onPromptClick("Berikan rekomendasi diet pribadi yang sesuai dengan kondisi profil kesehatan saya.")}
        />
      </div>
    </div>
  );
}

export default WelcomeCard;
