

function FoodHistoryCard({
  image,
  title,
  time,
  components,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-3 transition-all duration-200 hover:shadow-sm">
      
      {/* IMAGE */}
      <div className="h-[78px] w-[92px] overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col">
        
        {/* TIME */}
        <span className="text-[13px] text-[#7A7A7A]">
          {time}
        </span>

        {/* TITLE */}
        <h3 className="mt-1 text-[22px] font-semibold leading-none text-[#1E1E1E]">
          {title}
        </h3>

        {/* BADGE */}
        <div className="mt-3 w-fit rounded-full border border-[#7BC9A7] bg-[#EAF8F1] px-3 py-1">
          <span className="text-[12px] font-medium text-[#49A57D]">
            {components}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FoodHistoryCard;