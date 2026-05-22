// ─────────────────────────────────────────────
//  FormInput – Reusable input component
//  Mendukung: text, number, date, select,
//             textarea.  Styling konsisten
//             dengan design system Nutrify.
// ─────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const BASE_INPUT_CLASS =
  "block w-full py-3 border border-gray-200 rounded-xl text-sm " +
  "focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none " +
  "transition-all text-[#1E1E1E] bg-white " +
  "hover:border-gray-300";

/**
 * FormInput
 *
 * @param {object}  props
 * @param {string}  props.label       – Label teks
 * @param {string}  props.type        – "text" | "number" | "date" | "select" | "textarea"
 * @param {string}  props.name        – name attribute (harus sama dengan key di formData)
 * @param {*}       props.value       – nilai saat ini
 * @param {func}    props.onChange    – handler onChange
 * @param {string}  [props.placeholder]
 * @param {boolean} [props.required]
 * @param {string}  [props.unit]      – satuan suffix (cm, kg, dll.)
 * @param {Array}   [props.options]   – [{ value, label }] untuk type="select"
 * @param {number}  [props.min]
 * @param {number}  [props.max]
 * @param {number}  [props.rows]      – untuk textarea
 */
export default function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  unit,
  options = [],
  min,
  max,
  rows = 3,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-600 block">{label}</label>

      {/* ── SELECT ── */}
      {type === "select" && (
        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`${BASE_INPUT_CLASS} text-left flex items-center justify-between cursor-pointer`}
            style={{
              paddingLeft: "16px",
              paddingRight: "40px",
            }}
          >
            <span>{selectedOption ? selectedOption.label : placeholder || "Pilih..."}</span>
          </button>
          <ChevronDown
            className="text-gray-400 transition-transform duration-200"
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: `translateY(-50%) ${isOpen ? "rotate(180deg)" : "rotate(0deg)"}`,
              pointerEvents: "none",
            }}
            size={18}
          />

          {isOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto py-1.5">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => {
                      onChange({ target: { name, value: opt.value } });
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? "text-[#1E7F4E] bg-[#F1F8F5] font-semibold"
                        : "text-gray-700 hover:bg-[#F1F8F5] hover:text-[#1E7F4E]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span className="text-[#1E7F4E] font-semibold text-[10px]">✓ Terpilih</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TEXTAREA ── */}
      {type === "textarea" && (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className={
            "block w-full border border-gray-200 rounded-xl text-sm " +
            "focus:ring-[#1E7F4E] focus:border-[#1E7F4E] outline-none " +
            "transition-all resize-none text-[#1E1E1E] hover:border-gray-300"
          }
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
        />
      )}

      {/* ── TEXT / NUMBER / DATE ── */}
      {type !== "select" && type !== "textarea" && (
        <div style={{ position: "relative" }}>
          <input
            type={type === "date" && !value ? "text" : type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              if (type === "date") e.target.type = "date";
            }}
            onBlur={(e) => {
              if (type === "date" && !e.target.value) e.target.type = "text";
            }}
            placeholder={placeholder}
            required={required}
            min={min}
            max={max}
            className={BASE_INPUT_CLASS}
            style={{
              paddingLeft: "16px",
              paddingRight: unit ? "48px" : "16px",
            }}
          />
          {unit && (
            <span
              className="text-sm text-gray-400 font-medium"
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              {unit}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
