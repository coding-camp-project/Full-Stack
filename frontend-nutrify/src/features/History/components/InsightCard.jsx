import { CheckCircle2 } from "lucide-react";

import healthyFoodImage from "../../../assets/healthy-food.png";

function InsightCard() {
  return (
    <aside className="flex min-h-0 w-full min-w-0 flex-col rounded-xl border border-[#D8D8D8] bg-[#F8FCFA] p-4 shadow-sm sm:min-h-130 sm:p-5 xl:sticky xl:top-4">
      <h3 className="text-[14px] font-bold text-[#1E1E1E]">
        Insight Hari Ini
      </h3>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative">
          <img
            src={healthyFoodImage}
            alt="Insight nutrisi"
            className="h-32 w-32 object-contain"
          />
          <div className="absolute right-1 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#159B68] text-white shadow-sm">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <h4 className="mt-7 max-w-42 text-[18px] font-extrabold leading-tight text-[#1E1E1E]">
          Kalori kamu sudah mendekati target!
        </h4>

        <p className="mt-4 max-w-44 text-[12px] font-medium leading-relaxed text-[#555]">
          Coba tambahkan serat dari sayur dan buah untuk keseimbangan nutrisi
        </p>
      </div>
    </aside>
  );
}

export default InsightCard;
