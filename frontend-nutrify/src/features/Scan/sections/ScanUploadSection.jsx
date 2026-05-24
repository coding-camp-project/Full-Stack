import { BarChart3, ImagePlus, Sparkles, Utensils, BookOpen } from "lucide-react";

import ManualInput from "../components/ManualInput";
import TipsCard from "../components/TipsCard";
import UploadBox from "../components/UploadBox";
import WorkflowCard from "../components/WorkflowCard";

function ScanUploadSection({
  imagePreview,
  manualInput,
  onImageChange,
  onManualInputChange,
  onAnalyze,
  canAnalyze,
  onOpenPortionModal,
}) {
  return (
    <div className="w-full min-w-0 max-w-full space-y-5 px-3 py-5 sm:px-4 sm:py-8 lg:px-6 lg:max-w-[1360px] lg:mx-auto">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-[#D8D8D8] bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 xl:grid-cols-[1.2fr_1px_1fr]">
          <UploadBox imagePreview={imagePreview} onImageChange={onImageChange} />

          <div className="hidden bg-[#D8D8D8] lg:block" />

          <div className="flex flex-col justify-between">
            <ManualInput value={manualInput} onChange={onManualInputChange} />
            <div className="my-5 flex items-center gap-3 lg:hidden">
              <div className="h-px flex-1 bg-[#D8D8D8]" />
              <span className="text-[12px] text-[#777]">dan / atau</span>
              <div className="h-px flex-1 bg-[#D8D8D8]" />
            </div>
            <TipsCard onAnalyze={onAnalyze} disabled={!canAnalyze} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#49AE84] bg-[#ECFFF8] p-5 shadow-sm">
        <h3 className="text-[16px] font-bold text-[#1E1E1E]">
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

      <section className="flex flex-col gap-4 rounded-2xl border border-[#F0C778] bg-[#FFF9EB] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF2CF] text-[#F2A51A]">
            <Utensils size={18} />
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-[#1E1E1E]">
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
