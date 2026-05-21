

function FoodHistoryCard({
  image,
  title,
  time,
  components,
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-3 transition-all duration-200 hover:shadow-sm sm:gap-4">
      
      {/* IMAGE */}
      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl sm:h-19.5 sm:w-23">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1 flex-col">
        
        {/* TIME */}
        <span className="text-xs text-[#7A7A7A] sm:text-[13px]">
          {time}
        </span>

        {/* TITLE */}
        <h3 className="mt-1 truncate text-base font-semibold leading-tight text-[#1E1E1E] sm:text-lg lg:text-[22px]">
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