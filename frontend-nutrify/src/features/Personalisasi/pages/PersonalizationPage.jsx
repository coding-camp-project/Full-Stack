// ─────────────────────────────────────────────
//  PersonalizationPage – Container (pure orchestrator)
//
//  
// ─────────────────────────────────────────────

import { RefreshCw, Shield, AlertCircle, Lock } from "lucide-react";
import { usePersonalizationForm } from "../hooks/usePersonalizationForm";

import ProfileSection    from "../components/ProfileSection";
import HealthSection     from "../components/HealthSection";
import PreferenceSection from "../components/PreferenceSection";
import GoalSection       from "../components/GoalSection";
import ActionButtons     from "../components/ActionButtons";

export default function PersonalizationPage() {
  const {
    formData,
    loading,
    fetching,
    message,
    allergySearch,
    setAllergySearch,
    showAllergies,
    setShowAllergies,
    restrictionSearch,
    setRestrictionSearch,
    showRestrictions,
    setShowRestrictions,
    handleChange,
    handleConditionChange,
    handleRemoveAllergy,
    handleAddAllergy,
    handleRemoveRestriction,
    handleAddRestriction,
    handlePreferenceChange,
    handleSubmit,
    handleReset,
    calculateAge,
  } = usePersonalizationForm();

  // ── Loading skeleton ──────────────────────
  if (fetching) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-[#1E7F4E]" />
          <p className="text-gray-500 font-medium">Memuat profil kesehatan Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-7 lg:px-7 space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-2 relative">
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-[32px] font-bold text-[#1E1E1E] tracking-tight mb-2">
              Personalisasi
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
              Lengkapi informasi dirimu agar kami dapat memberikan rekomendasi
              gizi yang lebih akurat dan sesuai kebutuhanmu.
            </p>
          </div>

          {/* Secure banner */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2.5 border rounded-xl text-sm font-medium shadow-2xs"
            style={{
              backgroundColor: "#EBF7F0",
              borderColor: "#D1F2DE",
              color: "#1E7F4E",
            }}
          >
            <Lock size={16} className="shrink-0" />
            Data kamu aman dan hanya digunakan untuk memberikan rekomendasi gizi personal.
          </div>
        </div>

        {/* Hero illustration */}
        <div className="hidden lg:block shrink-0 pr-4 select-none">
          <svg width="240" height="180" viewBox="0 0 240 180" fill="none">
            <circle cx="120" cy="90" r="70" fill="#EBF7F0" opacity="0.7" />
            <circle cx="180" cy="120" r="30" fill="#EBF7F0" opacity="0.9" />
            <path d="M210 120C225 105 235 125 220 140C205 155 195 135 210 120Z" fill="#A5D6A7" opacity="0.4" />
            <path d="M30 140C15 125 5 145 20 160C35 175 45 155 30 140Z" fill="#A5D6A7" opacity="0.4" />
            <rect x="70" y="20" width="80" height="110" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="95" y="14" width="30" height="12" rx="3" fill="#A5D6A7" />
            <rect x="103" y="8" width="14" height="8" rx="2" fill="#718096" />
            <circle cx="110" cy="45" r="8" fill="#EBF7F0" stroke="#1E7F4E" strokeWidth="1.5" />
            <path d="M100 62C100 57 104 55 110 55C116 55 120 57 120 62" fill="none" stroke="#1E7F4E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M85 80L90 85L98 75" fill="none" stroke="#1E7F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="104" y1="80" x2="135" y2="80" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M85 98L90 103L98 93" fill="none" stroke="#1E7F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="104" y1="98" x2="130" y2="98" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M85 116L90 121L98 111" fill="none" stroke="#1E7F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="104" y1="116" x2="125" y2="116" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="170" cy="140" rx="35" ry="10" fill="#E2E8F0" opacity="0.6" />
            <path d="M135 120C135 142 150 145 170 145C190 145 205 142 205 120H135Z" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="150" cy="115" r="12" fill="#A5D6A7" />
            <circle cx="165" cy="112" r="14" fill="#81C784" />
            <circle cx="180" cy="114" r="13" fill="#A5D6A7" />
            <circle cx="192" cy="116" r="10" fill="#C8E6C9" />
            <circle cx="158" cy="118" r="7" fill="#F87171" />
            <circle cx="158" cy="118" r="4" fill="#EF4444" />
            <circle cx="178" cy="116" r="8" fill="#F87171" />
            <circle cx="178" cy="116" r="5" fill="#EF4444" />
            <circle cx="168" cy="122" r="6" fill="#E8F5E9" stroke="#1E7F4E" strokeWidth="1.5" />
            <circle cx="186" cy="120" r="5" fill="#E8F5E9" stroke="#1E7F4E" strokeWidth="1.5" />
            <path d="M210 135C207 135 204 137 202 139C200 137 197 135 194 135C188 135 184 140 184 146C184 153 192 159 198 161C200 161 204 161 206 161C212 159 220 153 220 146C220 140 216 135 210 135Z" fill="#81C784" />
            <path d="M202 135C202 131 204 129 205 128" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M205 128C208 128 211 130 211 131C211 132 208 132 205 128Z" fill="#4CAF50" />
          </svg>
        </div>
      </div>

      {/* ── ALERT MESSAGE ── */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-[#EBF7F0] border-[#D1F2DE] text-[#1E7F4E]"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <Shield className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      {/* ── MAIN FORM ── */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 1 – Data Diri */}
        <ProfileSection formData={formData} onChange={handleChange} />

        {/* Section 2 – Riwayat Kesehatan */}
        <HealthSection
          formData={formData}
          onChange={handleChange}
          onConditionChange={handleConditionChange}
        />

        {/* Section 3 & 4 – Side by side grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 3 – Alergi & Pantangan */}
          <PreferenceSection
            formData={formData}
            allergySearch={allergySearch}
            setAllergySearch={setAllergySearch}
            showAllergies={showAllergies}
            setShowAllergies={setShowAllergies}
            restrictionSearch={restrictionSearch}
            setRestrictionSearch={setRestrictionSearch}
            showRestrictions={showRestrictions}
            setShowRestrictions={setShowRestrictions}
            onAddAllergy={handleAddAllergy}
            onRemoveAllergy={handleRemoveAllergy}
            onAddRestriction={handleAddRestriction}
            onRemoveRestriction={handleRemoveRestriction}
          />

          {/* Section 4 – Preferensi & Tujuan */}
          <GoalSection
            formData={formData}
            onChange={handleChange}
            onPreferenceChange={handlePreferenceChange}
          />
        </div>

        {/* Bottom: Summary + Action Buttons */}
        <ActionButtons
          loading={loading}
          onReset={handleReset}
          formData={formData}
          calculateAge={calculateAge}
        />
      </form>
    </div>
  );
}
