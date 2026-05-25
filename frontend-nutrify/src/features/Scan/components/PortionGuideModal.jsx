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

const CURATED_HEALTHY_MENUS = [
  {
    name: "Nasi Campur Dada Ayam & Sayur",
    description: "Kombinasi karbohidrat kompleks, protein tinggi rendah lemak, dan serat pangan.",
    portions: [
      "1 porsi Nasi Merah / Cokelat (100g)",
      "1 potong Dada Ayam Panggang/Kukus (80g)",
      "1 mangkuk Tumis Sayuran Hijau Tanpa Minyak Berlebih (100g)"
    ],
    calories: "~380 kkal"
  },
  {
    name: "Gado-Gado Sehat Rendah Lemak",
    description: "Kaya serat pangan dan protein nabati berkualitas dari tahu & tempe.",
    portions: [
      "1 porsi Sayuran Rebus (bayam, kol, kecambah) (150g)",
      "2 potong Tahu & Tempe Rebus/Kukus (60g)",
      "1.5 sendok makan Saus Kacang Encer (20g)"
    ],
    calories: "~290 kkal"
  },
  {
    name: "Pepes Ikan Kembung & Kentang Rebus",
    description: "Tinggi asam lemak baik (omega-3) untuk kesehatan jantung dan kolesterol.",
    portions: [
      "1 ekor Pepes Ikan Kembung bumbu tradisional (90g)",
      "1 mangkuk Cah Kangkung Bawang Putih (100g)",
      "1 porsi Kentang Rebus pengganti nasi (120g)"
    ],
    calories: "~340 kkal"
  },
  {
    name: "Oatmeal Pisang & Madu",
    description: "Menu sarapan tinggi serat pangan untuk energi yang tahan lama.",
    portions: [
      "4 sendok makan Oatmeal instan / rolled oats (40g)",
      "1 buah Pisang Ambon iris (100g)",
      "1 sendok teh Madu Murni (5g)",
      "1 gelas Susu Almond / Kedelai (200ml)"
    ],
    calories: "~310 kkal"
  },
  {
    name: "Salad Buah Segar & Yogurt",
    description: "Camilan segar kaya vitamin dan probiotik pencernaan.",
    portions: [
      "1 mangkuk Campuran Buah (apel, melon, pepaya, naga) (150g)",
      "3 sendok makan Yogurt tawar rendah lemak (45g)",
      "1 sendok teh Almond panggang cincang (5g)"
    ],
    calories: "~180 kkal"
  },
  {
    name: "Smoothie Hijau Alpukat & Bayam",
    description: "Minuman padat zat gizi pembantu pemulihan energi.",
    portions: [
      "1 genggam Daun Bayam Segar (30g)",
      "1/2 buah Alpukat sedang (60g)",
      "1 gelas Susu Kedelai tanpa gula (240ml)",
      "1/2 buah Pisang sebagai pemanis alami"
    ],
    calories: "~240 kkal"
  },
  {
    name: "Sup Ayam Sayur & Tempe Panggang",
    description: "Hangat, menghidrasi, tinggi protein rendah lemak, serta kaya antioksidan.",
    portions: [
      "1 mangkuk Sup Ayam dengan wortel dan kentang (150g)",
      "1 potong Tempe Panggang tanpa minyak (50g)",
      "1 porsi Nasi Merah (100g)"
    ],
    calories: "~330 kkal"
  },
  {
    name: "Pecel Sayuran & Telur Rebus",
    description: "Kaya serat pangan alami dan protein hewani murni bebas lemak jenuh.",
    portions: [
      "1 porsi Sayuran Rebus pecel (kangkung, tauge, kacang panjang) (150g)",
      "1 butir Telur Rebus matang (55g)",
      "1.5 sendok makan Bumbu Pecel tradisional (20g)"
    ],
    calories: "~260 kkal"
  },
  {
    name: "Pepes Tahu Jamur & Tumis Buncis",
    description: "Menu vegetarian tinggi protein nabati dan serat pangan.",
    portions: [
      "2 bungkus Pepes Tahu dengan jamur tiram kukus (120g)",
      "1 porsi Tumis Buncis bawang putih (80g)",
      "1 porsi Nasi Jagung / Nasi Merah (100g)"
    ],
    calories: "~290 kkal"
  },
  {
    name: "Ikan Bakar Rica & Cah Brokoli",
    description: "Protein hewani tinggi pembangun otot dan zat besi sayuran.",
    portions: [
      "1 potong Ikan Nila / Mas Bakar bumbu rica minimal minyak (100g)",
      "1 mangkuk Cah Brokoli wortel (100g)",
      "1 porsi Nasi Merah (100g)"
    ],
    calories: "~350 kkal"
  },
  {
    name: "Roti Gandum Selai Kacang & Apel",
    description: "Menu pra-olahraga terbaik untuk stamina dan energi berkelanjutan.",
    portions: [
      "2 lembar Roti Gandum panggang (50g)",
      "1 sendok makan Selai Kacang murni tanpa tambahan gula (15g)",
      "1 buah Apel iris tipis (100g)"
    ],
    calories: "~320 kkal"
  },
  {
    name: "Bihun Ayam Kuah Bening",
    description: "Karbohidrat ringan, hangat dan nyaman untuk pencernaan sensitif.",
    portions: [
      "1 mangkuk Bihun Beras Kuah kaldu ayam bening (150g)",
      "3 sendok makan Dada Ayam Suwir rebus (50g)",
      "1 mangkuk Sawi Hijau & Tomat iris (80g)"
    ],
    calories: "~280 kkal"
  }
];

function PortionGuideModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setFoods([]);
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
              <h3 className="text-[16px] font-bold text-[#1E1E1E]">Panduan Menu Makanan Sehat</h3>
              <p className="text-[11px] text-[#777]">Saran takaran porsi ideal sehari-hari</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#777] hover:bg-[#FAFAFA] hover:text-[#1E1E1E] transition-all cursor-pointer"
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
              placeholder="Cari takaran bahan spesifik (misal: ayam, roti, apel...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#D8D8D8] bg-white py-2 pl-10 pr-4 text-[13px] text-[#1E1E1E] placeholder-[#999] outline-none transition-all focus:border-[#49AE84] focus:ring-1 focus:ring-[#49AE84]"
              autoFocus
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {searchQuery.trim() === "" ? (
            <div className="space-y-4 text-left">
              <h4 className="text-[14px] font-bold text-[#1E1E1E] mb-3">
                Rekomendasi Kombinasi Porsi Menu Sehat
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CURATED_HEALTHY_MENUS.map((menu, idx) => (
                  <div key={idx} className="rounded-xl border border-[#E8F7F0] bg-[#FAFDFB] p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <h5 className="text-[14px] font-bold text-[#1E7F4E]">{menu.name}</h5>
                      <p className="text-[11px] text-[#666] mt-1">{menu.description}</p>
                      
                      <div className="mt-3 space-y-1.5">
                        <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider block">Panduan Takaran Piring:</span>
                        <ul className="list-disc list-inside space-y-1 text-[12px] text-[#444]">
                          {menu.portions.map((p, pIdx) => (
                            <li key={pIdx} className="leading-relaxed">{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-2 border-t border-[#EAF6F0] flex justify-between items-center text-[12px]">
                      <span className="text-[#666]">Estimasi Kalori:</span>
                      <span className="font-bold text-[#1E7F4E]">{menu.calories}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : loading ? (
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
                      Takaran Porsi Standar: <span className="font-semibold text-[#49AE84]">{getStandardPortion(food.food_name)}</span>
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
