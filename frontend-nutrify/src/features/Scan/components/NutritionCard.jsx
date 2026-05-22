function NutritionCard({ icon, label, value, unit, tone = "green" }) {
  const tones = {
    orange: "border-[#FFE2C2] bg-[#FFF9F0] text-[#F28C28]",
    green: "border-[#D8F3E7] bg-[#F7FFFB] text-[#49AE84]",
    blue: "border-[#DDEBFF] bg-[#F7FBFF] text-[#4A90E2]",
    purple: "border-[#EFDCF9] bg-[#FEF7FF] text-[#9B59D6]",
  };

  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 ${tones[tone]}`}>
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="shrink-0 [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-[#666] sm:text-[12px]">
            {label}
          </p>
          <div className="mt-0.5 flex min-w-0 items-end gap-1">
            <span className="text-[18px] font-extrabold leading-none text-[#1E1E1E] sm:text-[22px]">
              {value}
            </span>
            <span className="pb-0.5 text-[10px] font-medium text-[#555] sm:text-[11px]">
              {unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionCard;
