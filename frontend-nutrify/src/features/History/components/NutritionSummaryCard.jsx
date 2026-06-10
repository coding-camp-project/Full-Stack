function NutritionSummaryCard({
  icon,
  title,
  value,
  unit,
  targetText,
  progress,
  tone = "green",
}) {
  const tones = {
    green: {
      wrapper: "bg-[#F5FCF8]",
      icon: "bg-[#D8F8E8] text-[#49AE84]",
      bar: "bg-[#49AE84]",
    },
    blue: {
      wrapper: "bg-[#F5FAFF]",
      icon: "bg-[#DFF0FF] text-[#168CE5]",
      bar: "bg-[#168CE5]",
    },
  };

  const selectedTone = tones[tone];

  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border border-[#103020]/15 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.04)] sm:p-6 ${selectedTone.wrapper}`}>
      <div className="flex min-w-0 items-start gap-3 sm:gap-5">
        <div className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-full transition-transform duration-300 hover:rotate-12 ${selectedTone.icon}`}>
          {icon}
        </div>

        <div className="w-full">
          <h3 className="text-[14px] font-bold text-slate-800">
            {title}
          </h3>

          <div className="mt-1 flex items-end gap-1">
            <span className="text-[34px] font-extrabold leading-none text-slate-800">
              {value}
            </span>
            <span className="pb-1 text-[16px] font-semibold text-slate-500">
              {unit}
            </span>
          </div>

          <p className="mt-4 text-[13px] font-semibold text-slate-600">
            {targetText}
          </p>

          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${selectedTone.bar}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionSummaryCard;
