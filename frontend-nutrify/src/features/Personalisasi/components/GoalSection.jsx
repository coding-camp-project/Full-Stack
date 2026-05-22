// ─────────────────────────────────────────────
//  GoalSection – Section 4: Preferensi & Tujuan
// ─────────────────────────────────────────────

import { Target } from "lucide-react";
import { PRIMARY_GOALS, FOOD_PREFERENCES } from "../data/options";
import FormInput from "./FormInput";

export default function GoalSection({ formData, onChange, onPreferenceChange }) {
  return (
    <div className="relative flex min-h-0 flex-col justify-between rounded-3xl border border-[#E7E7E7] bg-white p-5 shadow-xs sm:p-6 md:min-h-[320px] md:p-8 lg:min-h-[360px]">
      <div>
        {/* Section Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-base font-bold text-[#1E1E1E] mb-6 flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#EBF7F0", color: "#1E7F4E" }}
            >
              <Target size={16} />
            </span>
            4. Preferensi &amp; Tujuan
          </h2>

          {/* Decorative top-right icon */}
          <div className="text-gray-400 select-none">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="16" fill="#E8F5E9" opacity="0.6" />
              <circle cx="22" cy="22" r="10" fill="white" stroke="#81C784" strokeWidth="1.5" />
              <circle cx="22" cy="22" r="5" fill="#EF5350" />
              <path d="M30 14L24 20" stroke="#8D6E63" strokeWidth="2" strokeLinecap="round" />
              <path d="M24 20L23 21" stroke="#EF5350" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          {/* Primary Goal select */}
          <FormInput
            label="Tujuan Utama"
            type="select"
            name="primaryGoal"
            value={formData.primaryGoal}
            onChange={onChange}
            required
            options={PRIMARY_GOALS}
          />

          {/* Food Preference pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Preferensi Makanan
            </label>
            <div className="flex flex-wrap gap-2">
              {FOOD_PREFERENCES.map((pref) => {
                const isChecked = formData.foodPreferences.includes(pref);
                return (
                  <button
                    type="button"
                    key={pref}
                    onClick={() => onPreferenceChange(pref)}
                    className="rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    style={
                      isChecked
                        ? {
                            backgroundColor: "#EBF7F0",
                            borderColor: "#1E7F4E",
                            color: "#1E7F4E",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            paddingTop: "6px",
                            paddingBottom: "6px",
                          }
                        : {
                            backgroundColor: "#FFFFFF",
                            borderColor: "#E2E8F0",
                            color: "#4A5568",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            paddingTop: "6px",
                            paddingBottom: "6px",
                          }
                    }
                  >
                    {pref}
                    {isChecked && (
                      <span className="text-gray-400 font-normal ml-1 text-[10px]">✕</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional notes textarea */}
          <FormInput
            label="Catatan Tambahan (Opsional)"
            type="textarea"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={onChange}
            placeholder="Tuliskan catatan lain terkait kondisi atau preferensi makananmu..."
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
