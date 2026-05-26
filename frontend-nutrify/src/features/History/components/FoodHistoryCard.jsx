import { ChevronRight, Droplet, Flame, Leaf, Wheat, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FoodNutritionInfo from "./FoodNutritionInfo";

function FoodHistoryCard({ item, onDelete }) {
  const navigate = useNavigate();

  const handleOpenDetail = () => {
    navigate(`/history/${item.id}`);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpenDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenDetail();
        }
      }}
      className="group grid min-w-0 cursor-pointer gap-3 border-b border-[#D8D8D8] py-3 transition-all duration-200 last:border-b-0 hover:bg-[#F8FFFB] sm:grid-cols-[minmax(0,7.5rem)_1fr_auto] sm:items-center sm:gap-4"
    >
      <div className="flex gap-4 sm:block">
        <img
          src={item.image}
          alt={item.name}
          className="h-19 w-24 shrink-0 rounded-lg object-cover sm:h-18 sm:w-24"
        />

        <div className="sm:hidden">
          <p className="text-[12px] font-medium text-[#777]">
            {item.time}
          </p>
          <h3 className="mt-1 line-clamp-2 text-base font-bold text-[#1E1E1E]">
            {item.name}
          </h3>
        </div>
      </div>

      <div className="hidden min-w-0 sm:block">
        <p className="text-[12px] font-medium text-[#777]">
          {item.time}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold text-[#1E1E1E] sm:line-clamp-1">
          {item.name}
        </h3>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="inline-flex rounded-full border border-[#B9EBD7] bg-[#EFFFF8] px-2.5 py-0.5 text-[10px] font-semibold text-[#49AE84]">
            {item.components} komponen
          </span>
          {item.healthScore > 0 && (
            <span className="inline-flex rounded-full border border-[#FFD1D1] bg-[#FFEAEA] px-2.5 py-0.5 text-[10px] font-bold text-[#E74C3C]">
              Score: {item.healthScore}
            </span>
          )}
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-4">
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 md:gap-4">
          <FoodNutritionInfo
            icon={<Flame size={16} />}
            value={item.calories}
            label="kkal"
            colorClass="text-[#FF5733]"
          />
          <FoodNutritionInfo
            icon={<Leaf size={16} />}
            value={item.protein}
            label="g protein"
            colorClass="text-[#168C55]"
          />
          <FoodNutritionInfo
            icon={<Wheat size={16} />}
            value={item.carbs}
            label="g karbo"
            colorClass="text-[#F5A400]"
          />
          <FoodNutritionInfo
            icon={<Droplet size={16} />}
            value={item.fat}
            label="g lemak"
            colorClass="text-[#F5A400]"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(item.id);
              }}
              aria-label={`Hapus ${item.name}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#E74C3C] hover:bg-[#FFEAEA] transition-all duration-200"
            >
              <Trash2 size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleOpenDetail();
            }}
            aria-label={`Lihat detail ${item.name}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#1E1E1E] transition-all duration-200 group-hover:translate-x-1 group-hover:bg-[#EFFFF8] group-hover:text-[#49AE84]"
          >
            <ChevronRight size={25} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:hidden">
        <span className="inline-flex w-fit rounded-full border border-[#B9EBD7] bg-[#EFFFF8] px-2.5 py-0.5 text-[10px] font-semibold text-[#49AE84]">
          {item.components} komponen
        </span>
        {item.healthScore > 0 && (
          <span className="inline-flex rounded-full border border-[#FFD1D1] bg-[#FFEAEA] px-2.5 py-0.5 text-[10px] font-bold text-[#E74C3C]">
            Score: {item.healthScore}
          </span>
        )}
      </div>
    </article>
  );
}

export default FoodHistoryCard;
