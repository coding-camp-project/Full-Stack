// ─────────────────────────────────────────────
//  HealthSection – Section 2: Riwayat Kesehatan
// ─────────────────────────────────────────────

import { Heart, Lightbulb } from "lucide-react";
import { HEALTH_CONDITIONS } from "../data/options";
import FormInput from "./FormInput";

export default function HealthSection({ formData, onConditionChange, onChange }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-[#E7E7E7] bg-white p-5 shadow-xs sm:p-6 md:p-8">
      {/* Section Header */}
      <h2 className="text-base font-bold text-[#1E1E1E] mb-6 flex items-center gap-3">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
        >
          <Heart size={16} />
        </span>
        2. Riwayat Kesehatan
      </h2>

      {/* Flexbox 75% + 25% split */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left: form inputs (75%) ── */}
        <div className="w-full min-w-0 space-y-5 lg:flex-[3]">

          {/* Condition Pill Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Penyakit / Kondisi
            </label>
            <div className="flex flex-wrap gap-2.5">
              {HEALTH_CONDITIONS.map((condition) => {
                const isChecked = formData.healthConditions.includes(condition);
                return (
                  <button
                    type="button"
                    key={condition}
                    onClick={() => onConditionChange(condition)}
                    className="rounded-xl border text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
                    style={
                      isChecked
                        ? {
                            backgroundColor: "#EBF7F0",
                            borderColor: "#1E7F4E",
                            color: "#1E7F4E",
                            fontWeight: "600",
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }
                        : {
                            backgroundColor: "#FFFFFF",
                            borderColor: "#E2E8F0",
                            color: "#4A5568",
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }
                    }
                  >
                    {/* Custom checkbox box */}
                    <span
                      className="w-4 h-4 rounded border flex items-center justify-center text-[9px] transition-all"
                      style={
                        isChecked
                          ? {
                              backgroundColor: "#1E7F4E",
                              borderColor: "#1E7F4E",
                              color: "#FFFFFF",
                            }
                          : { borderColor: "#CBD5E1", backgroundColor: "#FFFFFF" }
                      }
                    >
                      {isChecked && "✓"}
                    </span>
                    {condition}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other conditions textarea */}
          <FormInput
            label="Riwayat Penyakit Lain (Opsional)"
            type="textarea"
            name="otherConditions"
            value={formData.otherConditions}
            onChange={onChange}
            placeholder="Contoh: pernah operasi usus buntu tahun 2022, dll."
            rows={3}
          />
        </div>

        {/* ── Right: tips card (25%) ── */}
        <div
          className="flex w-full min-w-0 flex-col justify-start gap-2 self-start rounded-2xl border p-4 sm:p-5 lg:flex-1"
          style={{ backgroundColor: "#F1F8F5", borderColor: "#D1F2DE" }}
        >
          <div className="flex items-center gap-2 text-[#1E7F4E] font-bold text-xs">
            <Lightbulb size={15} className="shrink-0" />
            <span>Tips Pengisian</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Semakin lengkap data yang kamu berikan, semakin akurat rekomendasi
            yang kami berikan untukmu.
          </p>
        </div>
      </div>
    </div>
  );
}
