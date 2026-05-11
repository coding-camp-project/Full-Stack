function SummaryCard({
  title,
  value,
  unit,
  progress,
  color,
  icon,
}) {
  return (
    <div className="rounded-[18px] bg-[#F7F7F7] p-5">
      
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
        <div className="ml-4 flex-1">
          <p className="text-[15px] font-medium text-[#1E1E1E]">
            {title}
          </p>

          <div className="mt-1 flex items-end gap-1">
            <h2 className="text-[38px] font-bold leading-none text-[#111111]">
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
        {progress}% dari target 2.000 kkal
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