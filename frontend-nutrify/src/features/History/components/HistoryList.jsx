import { ChevronDown } from "lucide-react";

import EmptyHistory from "./EmptyHistory";
import FoodHistoryCard from "./FoodHistoryCard";

function HistoryList({ items, loading = false, onDelete }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-[#FBFDFD]/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold text-slate-800">
          Riwayat Makanan
        </h2>

        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 transition-all duration-200 hover:border-[#49AE84]"
        >
          Terbaru
          <ChevronDown size={16} />
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-dashed border-[#B9EBD7] bg-[#F8FFFB] px-4 py-8 text-center text-[14px] font-semibold text-[#49AE84]">
          Memuat riwayat scan...
        </div>
      ) : items.length > 0 ? (
        <div>
          {items.map((item) => (
            <FoodHistoryCard key={item.id} item={item} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <EmptyHistory />
      )}
    </section>
  );
}

export default HistoryList;
