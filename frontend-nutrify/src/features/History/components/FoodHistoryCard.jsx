import { ChevronRight, Droplet, Flame, Leaf, Wheat } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FoodNutritionInfo from "./FoodNutritionInfo";

function FoodHistoryCard({ item }) {
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
      className="group grid cursor-pointer gap-4 border-b border-[#D8D8D8] py-3 transition-all duration-200 last:border-b-0 hover:bg-[#F8FFFB] sm:grid-cols-[7.5rem_1fr_auto] sm:items-center"
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
          <h3 className="mt-1 text-[16px] font-bold text-[#1E1E1E]">
            {item.name}
          </h3>
        </div>
      </div>

      <div className="hidden sm:block">
        <p className="text-[12px] font-medium text-[#777]">
          {item.time}
        </p>
        <h3 className="mt-1 text-[16px] font-bold text-[#1E1E1E]">
          {item.name}
        </h3>
        <span className="mt-2 inline-flex rounded-full border border-[#B9EBD7] bg-[#EFFFF8] px-2.5 py-1 text-[10px] font-semibold text-[#49AE84]">
          {item.components} komponen terdeteksi
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="grid flex-1 grid-cols-4 gap-4">
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

      <span className="inline-flex w-fit rounded-full border border-[#B9EBD7] bg-[#EFFFF8] px-2.5 py-1 text-[10px] font-semibold text-[#49AE84] sm:hidden">
        {item.components} komponen terdeteksi
      </span>
    </article>
  );
}

export default FoodHistoryCard;
