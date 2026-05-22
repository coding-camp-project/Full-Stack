// ─────────────────────────────────────────────
//  PreferenceSection – Section 3: Alergi & Pantangan
//  Tag-selector dengan search + custom input
// ─────────────────────────────────────────────

import { useRef, useEffect } from "react";
import { X, ChevronDown, UtensilsCrossed } from "lucide-react";
import { COMMON_ALLERGIES, COMMON_RESTRICTIONS } from "../data/options";

// ── Reusable Tag Selector ───────────────────
function TagSelector({
  label,
  tags,
  searchValue,
  onSearchChange,
  showDropdown,
  onOpenDropdown,
  onCloseDropdown,
  onAddTag,
  onRemoveTag,
  suggestions,
  placeholder,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!showDropdown) return;

    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onCloseDropdown();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [showDropdown, onCloseDropdown]);

  const filtered = suggestions.filter((item) =>
    item.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
        {label}
      </label>

      {/* Tag input box */}
      <div
        className="flex flex-wrap gap-1.5 border border-gray-200 rounded-xl bg-white min-h-[48px] items-center relative cursor-pointer focus-within:ring-2 focus-within:ring-[#1E7F4E] focus-within:border-[#1E7F4E] transition-all hover:border-gray-300"
        onClick={onOpenDropdown}
        style={{
          paddingLeft: "12px",
          paddingRight: "40px",
          paddingTop: "8px",
          paddingBottom: "8px",
        }}
      >
        {/* Existing tags */}
        {tags.map((tag, index) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 border text-xs font-semibold rounded-lg shrink-0"
            style={{
              backgroundColor: "#EBF7F0",
              borderColor: "#D1F2DE",
              color: "#1E7F4E",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "4px",
              paddingBottom: "4px",
            }}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTag(index);
              }}
              className="hover:text-red-500 transition-colors cursor-pointer text-gray-400 ml-1.5"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {/* Inline search input */}
        <input
          type="text"
          placeholder={tags.length === 0 ? placeholder : ""}
          value={searchValue}
          onChange={(e) => {
            onSearchChange(e.target.value);
            onOpenDropdown();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const trimmed = searchValue.trim();
              if (trimmed && !tags.includes(trimmed)) {
                onAddTag(trimmed);
                onSearchChange("");
              }
            }
          }}
          className="flex-1 min-w-[120px] bg-transparent outline-none border-none text-xs text-gray-700 placeholder-gray-400 py-1"
          style={{ paddingLeft: "8px" }}
        />

        <ChevronDown
          className="absolute right-3.5 text-gray-400 pointer-events-none transition-transform duration-200"
          style={{
            transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
            top: "50%",
            marginTop: "-9px",
          }}
          size={18}
        />
      </div>

      {/* Floating dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto py-1.5">
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Pilihan Populer
          </div>

          {filtered.map((item) => {
            const isSelected = tags.includes(item);
            return (
              <button
                type="button"
                key={item}
                disabled={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSelected) onAddTag(item);
                  onSearchChange("");
                  onCloseDropdown();
                }}
                className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                    : "text-gray-700 hover:bg-[#F1F8F5] hover:text-[#1E7F4E]"
                }`}
              >
                <span>{item}</span>
                {isSelected && (
                  <span className="text-[#1E7F4E] font-semibold">✓ Terpilih</span>
                )}
              </button>
            );
          })}

          {/* Custom entry option */}
          {searchValue.trim() && !tags.includes(searchValue.trim()) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddTag(searchValue.trim());
                onSearchChange("");
                onCloseDropdown();
              }}
              className="w-full text-left px-4 py-2 text-xs text-[#1E7F4E] hover:bg-[#F1F8F5] font-semibold border-t border-gray-100 transition-colors"
            >
              Tambah &quot;{searchValue}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────
export default function PreferenceSection({
  formData,
  allergySearch,
  setAllergySearch,
  showAllergies,
  setShowAllergies,
  restrictionSearch,
  setRestrictionSearch,
  showRestrictions,
  setShowRestrictions,
  onAddAllergy,
  onRemoveAllergy,
  onAddRestriction,
  onRemoveRestriction,
}) {
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
              <UtensilsCrossed size={16} />
            </span>
            3. Alergi &amp; Pantangan
          </h2>

          {/* Decorative top-right icon */}
          <div className="text-gray-400 select-none">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="16" fill="#E8F5E9" opacity="0.6" />
              <path d="M14 22C14 26 16 28 22 28C28 28 30 26 30 22H14Z" fill="#A5D6A7" />
              <circle cx="22" cy="22" r="10" fill="white" stroke="#EF5350" strokeWidth="2" />
              <line x1="15" y1="15" x2="29" y2="29" stroke="#EF5350" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          {/* Allergy tag selector */}
          <TagSelector
            label="Alergi"
            tags={formData.allergies}
            searchValue={allergySearch}
            onSearchChange={setAllergySearch}
            showDropdown={showAllergies}
            onOpenDropdown={() => setShowAllergies(true)}
            onCloseDropdown={() => setShowAllergies(false)}
            onAddTag={onAddAllergy}
            onRemoveTag={onRemoveAllergy}
            suggestions={COMMON_ALLERGIES}
            placeholder="Pilih atau cari alergi..."
          />

          {/* Food restriction tag selector */}
          <TagSelector
            label="Pantangan Makanan / Bahan"
            tags={formData.foodRestrictions}
            searchValue={restrictionSearch}
            onSearchChange={setRestrictionSearch}
            showDropdown={showRestrictions}
            onOpenDropdown={() => setShowRestrictions(true)}
            onCloseDropdown={() => setShowRestrictions(false)}
            onAddTag={onAddRestriction}
            onRemoveTag={onRemoveRestriction}
            suggestions={COMMON_RESTRICTIONS}
            placeholder="Pilih atau cari pantangan..."
          />
        </div>
      </div>
    </div>
  );
}
