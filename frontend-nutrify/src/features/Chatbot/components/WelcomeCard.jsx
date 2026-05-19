import {
  Bookmark,
  Sparkles,
  UserRound,
} from "lucide-react";

import PromptCard from "./PromptCard";

import logo from "../../../assets/logo/Logo 2.png";

function WelcomeCard({ onPromptClick }) {
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
        Ada yang bisa saya bantu?
      </h1>

      {/* DESC */}
      <p className="mx-auto mt-4 max-w-500 text-center text-[14px] leading-[1.7] text-white/80">
        Asisten AI Nutrify siap membantu Anda menganalisis gizi,
        merekomendasikan makanan sehat, dan menjawab pertanyaan seputar diet secara instan.
      </p>

      {/* PROMPTS */}
      <div className="mt-10 flex items-center justify-center gap-5">
        
        <PromptCard
          icon={<Bookmark size={24} />}
          title="Tips Nutrisi"
          description="Rekomendasi pola makan sehat instan."
          onClick={() => onPromptClick("Berikan saya beberapa tips gizi untuk makan sehat hari ini.")}
        />

        <PromptCard
          icon={<Sparkles size={24} />}
          title="Analisis Makanan"
          description="Analisis kalori dan zat gizi dari hidangan."
          onClick={() => onPromptClick("Bagaimana cara menganalisis kandungan kalori dan nutrisi dari makanan saya?")}
        />

        <PromptCard
          icon={<UserRound size={24} />}
          title="Saran Personal"
          description="Panduan AI berbasis profil kesehatan Anda."
          onClick={() => onPromptClick("Berikan rekomendasi diet pribadi yang sesuai dengan kondisi profil kesehatan saya.")}
        />
      </div>
    </div>
  );
}

export default WelcomeCard;
