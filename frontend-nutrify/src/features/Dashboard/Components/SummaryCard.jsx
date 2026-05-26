function SummaryCard({
  title,
  value,
  unit,
  progress,
  color,
  icon,
  targetValue,
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[18px] border border-[#E7E7E7] bg-white p-4 shadow-sm sm:p-5">
      
      {/* TOP */}
      <div className="flex items-start justify-between">
        
        {/* ICON */}
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </div>

        {/* TITLE */}
        <div className="ml-3 min-w-0 flex-1 sm:ml-4">
          <p className="text-sm font-medium text-[#1E1E1E] sm:text-[15px]">
            {title}
          </p>

          <div className="mt-1 flex flex-wrap items-end gap-1">
            <h2 className="text-xl font-bold leading-none text-[#111111] sm:text-2xl lg:text-[28px]">
              {value}
            </h2>

            <span className="mb-1 text-[15px] font-medium text-[#555]">
              {unit}
            </span>
          </div>
        </div>
      </div>

      {/* TARGET */}
      <p className="mt-5 text-[14px] text-[#444]">
        {progress}% dari target {targetValue?.toLocaleString("id-ID")} {unit}
      </p>

      {/* PROGRESS */}
      <div className="mt-2 h-1.25 w-full overflow-hidden rounded-full bg-[#5E5E5E]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export default SummaryCard;