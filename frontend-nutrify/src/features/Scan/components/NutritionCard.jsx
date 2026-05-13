function NutritionCard({ icon, label, value, unit, tone = "green" }) {
  const tones = {
    orange: "border-[#FFE2C2] bg-[#FFF9F0] text-[#F28C28]",
    green: "border-[#D8F3E7] bg-[#F7FFFB] text-[#49AE84]",
    blue: "border-[#DDEBFF] bg-[#F7FBFF] text-[#4A90E2]",
    purple: "border-[#EFDCF9] bg-[#FEF7FF] text-[#9B59D6]",
  };

  return (
    <div className={`rounded-lg border px-4 py-3 ${tones[tone]}`}>
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          {icon}
        </div>

        <div>
          <p className="text-[12px] font-medium text-[#666]">
            {label}
          </p>
          <div className="mt-1 flex items-end gap-1">
            <span className="text-[23px] font-extrabold leading-none text-[#1E1E1E]">
              {value}
            </span>
            <span className="text-[11px] font-medium text-[#555]">
              {unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionCard;
