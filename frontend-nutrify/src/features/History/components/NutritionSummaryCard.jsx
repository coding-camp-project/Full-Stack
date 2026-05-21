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
    <div className={`min-w-0 overflow-hidden rounded-xl p-4 shadow-sm sm:p-6 ${selectedTone.wrapper}`}>
      <div className="flex min-w-0 items-start gap-3 sm:gap-5">
        <div className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-full ${selectedTone.icon}`}>
          {icon}
        </div>

        <div className="w-full">
          <h3 className="text-[14px] font-bold text-[#1E1E1E]">
            {title}
          </h3>

          <div className="mt-1 flex items-end gap-1">
            <span className="text-[34px] font-extrabold leading-none text-[#111]">
              {value}
            </span>
            <span className="pb-1 text-[16px] font-semibold text-[#1E1E1E]">
              {unit}
            </span>
          </div>

          <p className="mt-4 text-[13px] font-semibold text-[#1E1E1E]">
            {targetText}
          </p>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#5E5E5E]">
            <div
              className={`h-full rounded-full ${selectedTone.bar}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionSummaryCard;
