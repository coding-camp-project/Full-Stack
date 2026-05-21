import { Lightbulb, BookOpen } from "lucide-react";

function InsightCard() {
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch justify-between gap-5 rounded-[22px] border border-[#B7E4CF] bg-[#F3FBF7] px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 lg:flex-row lg:items-center lg:gap-6">
      
      {/* LEFT */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        
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
          <h3 className="text-lg font-bold text-[#1E1E1E] sm:text-xl">
            Insight & Rekomendasi
          </h3>

          <p className="mt-2 max-w-full text-sm leading-[1.8] text-[#444] lg:max-w-xl">
            Asupan protein anda masih dibawah target.
            Coba tambahkan sumber protein seperti
            telur, ayam, atau kacang-kacangan
            di menu berikutnya.
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <button
        type="button"
        className="flex w-full shrink-0 items-center justify-center gap-3 rounded-2xl border border-[#62C49D] bg-white px-5 py-3 text-sm font-semibold text-[#49AE84] transition-all duration-200 hover:bg-[#ECFFF5] sm:w-auto sm:px-7 sm:py-4 sm:text-[16px]"
      >
        
        <BookOpen size={20} />

        Lihat Rekomendasi Takaran
      </button>
    </div>
  );
}

export default InsightCard;