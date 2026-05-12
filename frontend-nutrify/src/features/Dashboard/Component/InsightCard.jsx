import { Lightbulb, BookOpen } from "lucide-react";

function InsightCard() {
  return (
    <div className="flex items-center justify-between rounded-[22px] border border-[#B7E4CF] bg-[#F3FBF7] px-8 py-7">
      
      {/* LEFT */}
      <div className="flex items-center gap-5">
        
        {/* ICON */}
        <div className="flex h-15.5 w-15.5 items-center justify-center rounded-full bg-[#DDF5E8]">
          <Lightbulb
            size={30}
            strokeWidth={2.2}
            className="text-[#43B581]"
          />
        </div>

        {/* TEXT */}
        <div>
          <h3 className="text-[24px] font-semibold text-[#1E1E1E]">
            Insight & Rekomendasi
          </h3>

          <p className="mt-2 max-w-155 text-[16px] leading-[1.8] text-[#444]">
            Asupan protein anda masih dibawah target.
            Coba tambahkan sumber protein seperti
            telur, ayam, atau kacang-kacangan
            di menu berikutnya.
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <button className="flex items-center gap-3 rounded-2xl border border-[#62C49D] bg-white px-7 py-4 text-[16px] font-semibold text-[#49AE84] transition-all duration-200 hover:bg-[#ECFFF5]">
        
        <BookOpen size={20} />

        Lihat Rekomendasi Takaran
      </button>
    </div>
  );
}

export default InsightCard;