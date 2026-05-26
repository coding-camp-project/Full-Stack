import { useState } from "react";
import { Lightbulb, BookOpen } from "lucide-react";
import PortionGuideModal from "../../Scan/components/PortionGuideModal";
import { getUserData } from "@/utils/userSession";
import { calculateDailyNeeds } from "../utils/targetCalculator";

function InsightCard({
  totalCalories = 0,
  totalCarbs = 0,
  totalFat = 0,
  totalProtein = 0,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate target needs based on user personalization
  const user = getUserData();
  const targets = calculateDailyNeeds(user);
  const targetCalories = targets.targetCalories;
  const targetProtein = targets.targetProtein;
  const targetCarbs = targets.targetCarbs;
  const targetFat = targets.targetFat;

  // Generate dynamic nutritional insight message
  let insightText = "";
  if (totalProtein > 0 && totalProtein < targetProtein * 0.6) {
    insightText = `Asupan protein Anda masih di bawah target hari ini (${totalProtein}g / ${targetProtein}g). Coba tambahkan 1-2 potong dada ayam (50g per potong) atau 2 butir telur rebus pada menu makan berikutnya untuk memenuhi kebutuhan protein harian Anda.`;
  } else if (totalFat > targetFat) {
    insightText = `Asupan lemak Anda hari ini cukup tinggi (${totalFat}g / ${targetFat}g). Untuk sisa hari ini, sebaiknya batasi konsumsi gorengan, makanan bersantan, atau mentega, dan pilih alternatif olahan makanan yang dikukus atau direbus.`;
  } else if (totalCalories > targetCalories) {
    insightText = `Asupan kalori Anda hari ini sudah melebihi target harian (${totalCalories} kkal / ${Math.round(targetCalories)} kkal). Untuk sisa hari ini, pilihlah camilan berkalori rendah seperti 1 buah apel segar (100g) atau 1 mangkuk sayur sup bening tanpa minyak.`;
  } else if (totalCarbs > 0 && totalCarbs < targetCarbs * 0.5) {
    insightText = `Asupan karbohidrat harian Anda masih tergolong rendah (${totalCarbs}g / ${targetCarbs}g). Coba tambahkan 1 porsi nasi merah (150g) atau 1 buah kentang rebus berukuran sedang untuk memberikan energi stabil sepanjang hari.`;
  } else {
    insightText = "Pertahankan pola makan seimbang! Selalu pantau porsi makan harian Anda menggunakan fitur pemindai makanan Nutrify AI. Klik tombol di sebelah kanan untuk melihat panduan takaran porsi makanan sehat yang direkomendasikan.";
  }

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
        <div className="text-left flex-1">
          <h3 className="text-lg font-bold text-[#1E1E1E] sm:text-xl">
            Insight & Rekomendasi
          </h3>

          <p className="mt-2 max-w-full text-sm leading-[1.8] text-[#444] lg:max-w-xl">
            {insightText}
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex w-full shrink-0 items-center justify-center gap-3 rounded-2xl border border-[#62C49D] bg-white px-5 py-3 text-sm font-semibold text-[#49AE84] transition-all duration-200 hover:bg-[#ECFFF5] sm:w-auto sm:px-7 sm:py-4 sm:text-[16px] cursor-pointer"
      >
        <BookOpen size={20} />
        Lihat Rekomendasi Takaran
      </button>

      {/* MODAL PORTION GUIDE */}
      <PortionGuideModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default InsightCard;