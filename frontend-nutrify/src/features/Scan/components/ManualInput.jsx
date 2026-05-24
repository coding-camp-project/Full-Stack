import { useState, useEffect, useRef } from "react";

const getDefaultUnit = (foodName) => {
  const name = foodName.toLowerCase();
  if (name.includes("tomat")) return "1 iris";
  if (name.includes("selada") || name.includes("roti") || name.includes("daun")) return "1 lembar";
  if (
    name.includes("ayam") || name.includes("daging") || name.includes("tempe") ||
    name.includes("tahu") || name.includes("ikan") || name.includes("bebek") ||
    name.includes("kambing") || name.includes("sapi")
  ) return "1 potong";
  if (name.includes("telur")) return "1 butir";
  if (
    name.includes("pisang") || name.includes("apel") || name.includes("jeruk") ||
    name.includes("mangga") || name.includes("alpukat") || name.includes("melon") ||
    name.includes("semangka")
  ) return "1 buah";
  if (
    name.includes("nasi") || name.includes("mie") || name.includes("bihun") ||
    name.includes("kwetiau") || name.includes("bubur")
  ) return "1 porsi";
  if (name.includes("susu") || name.includes("jus") || name.includes("teh") || name.includes("kopi")) return "1 gelas";
  if (
    name.includes("sambal") || name.includes("saus") || name.includes("kecap") ||
    name.includes("gula") || name.includes("mentega") || name.includes("minyak") ||
    name.includes("madu")
  ) return "1 sendok makan";
  if (
    name.includes("sayur") || name.includes("bayam") || name.includes("kangkung") ||
    name.includes("buncis") || name.includes("sop") || name.includes("soto")
  ) return "1 mangkuk";
  return "1 porsi";
};

function ManualInput({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [query, setQuery] = useState("");
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Parse what the user is currently typing at their cursor position
  useEffect(() => {
    if (!value) {
      setQuery("");
      return;
    }

    const textBeforeCursor = value.slice(0, cursorPos);
    // Split by comma, semicolon, or newline to get the current item being typed
    const parts = textBeforeCursor.split(/[,;\n]+/);
    const lastPart = parts[parts.length - 1] || "";

    // Ignore if last part contains numbers (likely typing quantity/unit)
    if (/\d+/.test(lastPart)) {
      setQuery("");
      return;
    }

    setQuery(lastPart.trim());
  }, [value, cursorPos]);

  // Fetch suggestions with 200ms debounce
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
        const response = await fetch(`${API_URL}/api/scan/suggest?q=${encodeURIComponent(query)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.suggestions);
          setShowSuggestions(data.suggestions.length > 0);
        }
      } catch (error) {
        console.error("Autocomplete fetch failed:", error);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query, API_URL]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTextareaChange = (e) => {
    onChange(e);
    setCursorPos(e.target.selectionStart);
  };

  const handleKeyUpAndClick = (e) => {
    setCursorPos(e.target.selectionStart);
  };

  const handleSelectSuggestion = (suggestion) => {
    const textBeforeCursor = value.slice(0, cursorPos);
    const textAfterCursor = value.slice(cursorPos);

    // Split keeping delimiters to rebuild string accurately
    const parts = textBeforeCursor.split(/([,;\n]+)/);
    
    // Replace the last text item with the selected suggestion and a default quantity
    let leadingSpace = "";
    if (parts.length > 1 && parts[parts.length - 2].includes(",")) {
      leadingSpace = " ";
    }
    
    const defaultUnit = getDefaultUnit(suggestion);
    parts[parts.length - 1] = `${leadingSpace}${suggestion} ${defaultUnit}`;

    const rebuiltBefore = parts.join("");
    const newValue = rebuiltBefore + textAfterCursor;

    // Trigger change event to update parent state
    onChange({ target: { value: newValue } });

    setSuggestions([]);
    setShowSuggestions(false);

    // Refocus and place cursor directly after the inserted item
    if (textareaRef.current) {
      textareaRef.current.focus();
      const newPos = rebuiltBefore.length;
      setTimeout(() => {
        textareaRef.current.setSelectionRange(newPos, newPos);
      }, 0);
    }
  };

  return (
    <div className="relative">
      <h3 className="text-[15px] font-bold text-[#1E1E1E]">
        Input manual makanan Anda
      </h3>

      <p className="mt-1 text-[12px] font-medium text-[#555]">
        Tuliskan komposisi makanan (bisa digunakan sendiri atau bersamaan dengan foto untuk mengoreksi hasil scan gambar).
      </p>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          onKeyUp={handleKeyUpAndClick}
          onClick={handleKeyUpAndClick}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Contoh: Nasi putih 1 porsi, ayam goreng 1 potong, tomat 2 iris, selada 3 lembar, telur 1 butir."
          className="mt-4 min-h-25 w-full resize-none rounded-lg border border-[#D8D8D8] bg-white px-4 py-3 text-[13px] leading-relaxed text-[#333] outline-none transition-all duration-200 placeholder:text-[#999] focus:border-[#49AE84] focus:ring-2 focus:ring-[#49AE84]/10"
        />

        {/* Suggestion Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#D8D8D8] bg-white p-1 shadow-lg"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#999]">
              Rekomendasi Makanan (IntelliSense)
            </div>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] text-[#333] transition-colors duration-150 hover:bg-[#ECFFF8] hover:text-[#1E7F4E]"
              >
                <span className="flex items-center gap-1.5">🔍 {suggestion}</span>
                <span className="text-[10px] font-semibold text-[#49AE84] bg-[#EFFFF8] px-2 py-0.5 rounded-full shrink-0">
                  {getDefaultUnit(suggestion)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2.5 text-[11px] text-[#555] bg-[#F4FBF7] border border-[#DDF5EC] rounded-xl p-3 flex items-start gap-2 leading-relaxed">
        <span className="text-[#3e9d7d] shrink-0">💡</span>
        <span>
          <strong>Tips:</strong> Pilih saran dari menu dropdown saat mengetik agar nama makanan sesuai dengan dataset nutrisi model AI secara presisi.
        </span>
      </div>
    </div>
  );
}

export default ManualInput;
