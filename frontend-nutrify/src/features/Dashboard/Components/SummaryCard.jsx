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
    <div className="min-w-0 overflow-hidden rounded-2xl border border-[#103020]/15 bg-[#FBFDFD]/90 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] sm:p-5">
      
      {/* TOP */}
      <div className="flex items-start justify-between">
        
        {/* ICON */}
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 hover:rotate-12"
          style={{
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {icon}
        </div>

        {/* TITLE */}
        <div className="ml-3 min-w-0 flex-1 sm:ml-4">
          <p className="text-sm font-semibold text-slate-500 sm:text-[15px]">
            {title}
          </p>

          <div className="mt-1 flex flex-wrap items-end gap-1">
            <h2 className="text-xl font-bold leading-none text-slate-800 sm:text-2xl lg:text-[28px]">
              {value}
            </h2>

            <span className="mb-1 text-[15px] font-semibold text-slate-400">
              {unit}
            </span>
          </div>
        </div>
      </div>

      {/* TARGET */}
      <p className="mt-5 text-[13px] font-medium text-slate-500">
        <span className="font-bold text-slate-700">{progress}%</span> dari target {targetValue?.toLocaleString("id-ID")} {unit}
      </p>

      {/* PROGRESS */}
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
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