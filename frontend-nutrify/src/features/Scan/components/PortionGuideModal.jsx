import { useEffect, useState } from "react";
import { X, Search, BookOpen } from "lucide-react";

const getStandardPortion = (foodName) => {
  const name = foodName.toLowerCase();
  
  if (name.includes("tomat")) {
    return "1 iris (25g)";
  }
  if (name.includes("selada") || name.includes("roti")) {
    return "1 lembar (20g)";
  }
  if (name.includes("ayam") || name.includes("daging") || name.includes("tempe") || name.includes("tahu") || name.includes("ikan") || name.includes("bebek")) {
    return "1 potong (50g)";
  }
  if (name.includes("telur")) {
    return "1 butir (55g)";
  }
  if (name.includes("pisang") || name.includes("apel") || name.includes("jeruk") || name.includes("mangga") || name.includes("alpukat") || name.includes("melon") || name.includes("semangka") || name.includes("buah")) {
    return "1 buah (100g)";
  }
  if (name.includes("nasi") || name.includes("mie") || name.includes("bihun") || name.includes("kwetiau") || name.includes("bubur")) {
    return "1 porsi (150g)";
  }
  if (name.includes("susu") || name.includes("jus") || name.includes("teh") || name.includes("kopi")) {
    return "1 gelas (240g)";
  }
  if (name.includes("sambal") || name.includes("saus") || name.includes("kecap") || name.includes("gula") || name.includes("mentega") || name.includes("minyak") || name.includes("madu")) {
    return "1 sendok makan (15g)";
  }
  if (name.includes("sayur") || name.includes("bayam") || name.includes("kangkung") || name.includes("buncis") || name.includes("sop") || name.includes("soto")) {
    return "1 mangkuk (200g)";
  }
  
  return "1 porsi (100g)";
};

function PortionGuideModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetchFoods("nasi");
  }, [isOpen]);

  const fetchFoods = async (query) => {
    setLoading(true);
    try {
      const url = `https://damassdev-nutrify-ai-api.hf.space/search-food?q=${encodeURIComponent(query)}&limit=15`;
      const res = await fetch(url);
      const data = await res.json();
      setFoods(data.candidates || []);
    } catch (error) {
      console.error("Gagal mengambil panduan takaran:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      if (isOpen) fetchFoods("nasi");
      return;
    }

    const timer = setTimeout(() => {
      fetchFoods(searchQuery.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAEAEA] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFFFF8] text-[#49AE84]">
              <BookOpen size={18} />
            </div>
            <div className="text-left">
              <h3 className="text-[16px] font-bold text-[#1E1E1E]">Panduan Takaran Makanan</h3>
              <p className="text-[11px] text-[#777]">Data langsung dari database AI Nutrify</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#777] hover:bg-[#FAFAFA] hover:text-[#1E1E1E] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-5 py-3.5 bg-[#FAFAFA] border-b border-[#EAEAEA]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-[#999]" />
            <input
              type="text"
              placeholder="Cari makanan (misal: ayam, roti, telur...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#D8D8D8] bg-white py-2 pl-10 pr-4 text-[13px] text-[#1E1E1E] placeholder-[#999] outline-none transition-all focus:border-[#49AE84] focus:ring-1 focus:ring-[#49AE84]"
              autoFocus
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#777] gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#49AE84] border-t-transparent" />
              <span className="text-[13px] font-medium">Mencari di database AI...</span>
            </div>
          ) : foods.length > 0 ? (
            <div className="divide-y divide-[#F0F0F0]">
              {foods.map((food, idx) => (
                <div key={idx} className="py-3 px-1.5 first:pt-0 last:pb-0 flex items-center justify-between text-left transition-colors hover:bg-[#FAFAFA] rounded-lg">
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1E1E1E] capitalize">
                      {food.food_name?.replace(/_/g, " ")}
                    </h4>
                    <p className="mt-1 text-[12px] text-[#666]">
                      Takaran Porsi: <span className="font-semibold text-[#49AE84]">{getStandardPortion(food.food_name)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#777]">
              <p className="text-[13px] font-semibold">Makanan tidak ditemukan</p>
              <p className="text-[11px] mt-1">Coba cari dengan kata kunci lain.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PortionGuideModal;
