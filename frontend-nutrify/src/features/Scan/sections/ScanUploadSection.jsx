import { useState } from "react";
import { BarChart3, ImagePlus, Sparkles, Utensils, BookOpen, Info, ChevronDown, ChevronUp } from "lucide-react";

import ManualInput from "../components/ManualInput";
import TipsCard from "../components/TipsCard";
import UploadBox from "../components/UploadBox";
import WorkflowCard from "../components/WorkflowCard";

const SUPPORTED_FOODS = [
  "Ayam Bakar", "Ayam Geprek", "Bika Ambon Medan", "Dimsum Ayam",
  "Es Cendol", "Es Doger", "Ikan Lele", "Kangkung", "Kentang Goreng",
  "Klepon", "Martabak Manis Keju", "Martabak Telur", "Melon",
  "Mie Ayam", "Nasi Goreng", "Nasi Putih", "Nugget Ayam",
  "Perkedel Kentang", "Pisang Goreng", "Rawon Daging", "Sate Madura",
  "Sayur Asem", "Soto Lamongan", "Tape Ketan Hitam", "Teh Manis Dingin"
];

function ScanUploadSection({
  imagePreview,
  manualInput,
  onImageChange,
  onManualInputChange,
  onAnalyze,
  canAnalyze,
  onOpenPortionModal,
}) {
  const [showFoodList, setShowFoodList] = useState(false);

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 px-3 py-5 sm:px-4 sm:py-8 lg:px-6 lg:max-w-[1360px] lg:mx-auto">
      {/* Prominent Info Alert Banner for Image Recognition Classes */}
      <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/70 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Info size={20} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-blue-900 flex items-center gap-2">
                Ketentuan & Batasan AI Image Scanner
              </h4>
              <p className="mt-1 text-[13px] leading-relaxed text-blue-800">
                Saat ini, fitur <strong>pindai gambar</strong> kami baru mendukung <strong>25 jenis makanan Indonesia</strong> populer secara visual. Kami sedang terus mengembangkan kecerdasan AI agar dapat mengenali lebih banyak hidangan ke depannya!
              </p>
              <p className="mt-2 text-[12px] text-blue-700/95 italic">
                Tips: Jika makanan Anda tidak terdaftar atau tidak terdeteksi, silakan ketik langsung di bagian <strong>Input Manual</strong> (Fitur pencarian instan lokal kami mendukung ribuan data makanan).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFoodList(!showFoodList)}
            className="flex items-center justify-center gap-1.5 self-start rounded-lg border border-blue-300 bg-white px-4 py-2 text-[12px] font-bold text-blue-800 shadow-sm transition-all hover:bg-blue-50 active:scale-95 shrink-0"
          >
            {showFoodList ? "Sembunyikan Daftar" : "Lihat 25 Makanan Didukung"}
            {showFoodList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Collapsible Food List Grid */}
        {showFoodList && (
          <div className="mt-4 rounded-xl border border-blue-200/60 bg-white/70 p-4 transition-all duration-300">
            <h5 className="text-[12px] font-bold uppercase tracking-wider text-blue-900/70 mb-3">
              Daftar Makanan yang Bisa Discan Gambar:
            </h5>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {SUPPORTED_FOODS.map((food, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg bg-blue-50/80 px-3 py-1.5 border border-blue-100/50 hover:bg-blue-100/40 transition-colors"
                >
                  <span className="text-[10px] font-bold text-blue-600/60 bg-blue-200/50 rounded-full h-4 w-4 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-medium text-blue-900 truncate">
                    {food}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-[#FBFDFD]/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] sm:p-6">
        <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-8 xl:grid-cols-[1.2fr_1fr]">
          
          {/* LEFT: UPLOAD IMAGE */}
          <UploadBox imagePreview={imagePreview} onImageChange={onImageChange} />

          {/* MIDDLE: OR DIVIDER */}
          <div className="relative lg:absolute lg:inset-y-0 lg:left-[calc(50%-16px)] xl:left-[calc(54.54%-16px)] flex items-center justify-center py-2 lg:py-0 z-10 pointer-events-none">
            <div className="absolute inset-0 flex items-center lg:flex-col lg:justify-center">
              <div className="h-px w-full bg-slate-100 lg:h-full lg:w-px" />
            </div>
            <span className="relative z-10 rounded-full border border-slate-100 bg-white px-3.5 py-1.5 text-xs font-extrabold text-slate-400 shadow-xs uppercase tracking-wider">
              atau
            </span>
          </div>

          {/* RIGHT: MANUAL INPUT */}
          <div className="flex flex-col justify-between">
            <ManualInput value={manualInput} onChange={onManualInputChange} />
            <TipsCard onAnalyze={onAnalyze} disabled={!canAnalyze} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#49AE84]/20 bg-[#ECFFF8]/50 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)]">
        <h3 className="text-[16px] font-bold text-slate-800">
          Cara kerja scan nutrify
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          <WorkflowCard
            icon={<ImagePlus size={30} />}
            title="1.Upload atau Input"
            description="Upload foto makanan anda atau tuliskan komposisinya secara manual."
          />
          <WorkflowCard
            icon={<Sparkles size={30} />}
            title="2.Analisis AI"
            description="AI akan mendeteksi makanan dan menghitung kandungan nutrisi secara otomatis."
          />
          <WorkflowCard
            icon={<BarChart3 size={30} />}
            title="3.Dapatkan Hasil"
            description="Lihat informasi nutrisi lengkap beserta rekomendasi untuk pola makan sehat anda."
            showArrow={false}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-[#F0C778]/30 bg-[#FFF9EB]/50 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF2CF] text-[#F2A51A]">
            <Utensils size={18} />
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-slate-800">
              Tidak yakin jumlahnya?
            </h4>
            <p className="mt-1 text-[12px] text-[#555]">
              Anda bisa memilih perkiraan umum atau lihat panduan takaran di sini.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPortionModal}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#49AE84] bg-white px-5 text-[12px] font-semibold text-[#49AE84] transition-all duration-200 hover:bg-[#F4FFF9]"
        >
          <BookOpen size={15} />
          Lihat Panduan Takaran
        </button>
      </section>
    </div>
  );
}

export default ScanUploadSection;
