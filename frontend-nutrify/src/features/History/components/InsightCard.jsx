import { CheckCircle2 } from "lucide-react";

import healthyFoodImage from "../../../assets/healthy-food.png";

function InsightCard() {
  return (
    <aside className="flex min-h-0 w-full min-w-0 flex-col rounded-2xl border border-[#103020]/15 bg-[#F8FCFA] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] h-fit sm:p-5 xl:sticky xl:top-4">
      <h3 className="text-[14px] font-bold text-[#1E1E1E]">
        Insight Hari Ini
      </h3>

      <div className="flex flex-1 flex-col items-center justify-center text-center pb-4">
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

      {/* Rekomendasi Tambahan */}
      <div className="mt-auto border-t border-[#103020]/10 pt-4 text-left">
        <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Tips Hidup Sehat:
        </h4>
        <div className="space-y-2.5">
          <div className="flex gap-2.5 rounded-xl border border-slate-100 bg-white p-2.5 shadow-2xs transition-colors hover:border-[#103020]/10">
            <span className="text-sm shrink-0">💧</span>
            <div>
              <p className="text-[11px] font-extrabold text-slate-800">Hidrasi Tubuh</p>
              <p className="text-[10px] leading-normal text-slate-500 mt-0.5">Minum air putih minimal 2 liter sehari agar tubuh terhidrasi.</p>
            </div>
          </div>
          <div className="flex gap-2.5 rounded-xl border border-slate-100 bg-white p-2.5 shadow-2xs transition-colors hover:border-[#103020]/10">
            <span className="text-sm shrink-0">🚶</span>
            <div>
              <p className="text-[11px] font-extrabold text-slate-800">Aktif Bergerak</p>
              <p className="text-[10px] leading-normal text-slate-500 mt-0.5">Jalan kaki ringan 10 menit setelah makan untuk pencernaan.</p>
            </div>
          </div>
          <div className="flex gap-2.5 rounded-xl border border-slate-100 bg-white p-2.5 shadow-2xs transition-colors hover:border-[#103020]/10">
            <span className="text-sm shrink-0">🍏</span>
            <div>
              <p className="text-[11px] font-extrabold text-slate-800">Camilan Berserat</p>
              <p className="text-[10px] leading-normal text-slate-500 mt-0.5">Pilih buah segar seperti apel atau melon sebagai selingan sehat.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default InsightCard;
