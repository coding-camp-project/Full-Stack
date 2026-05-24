import { ChevronDown } from "lucide-react";

import EmptyHistory from "./EmptyHistory";
import FoodHistoryCard from "./FoodHistoryCard";

function HistoryList({ items, loading = false, onDelete }) {
  return (
    <section className="rounded-xl border border-[#D8D8D8] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold text-[#1E1E1E]">
          Riwayat Makanan
        </h2>

        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-lg border border-[#D8D8D8] bg-white px-4 text-[13px] font-semibold text-[#1E1E1E] transition-all duration-200 hover:border-[#49AE84]"
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
