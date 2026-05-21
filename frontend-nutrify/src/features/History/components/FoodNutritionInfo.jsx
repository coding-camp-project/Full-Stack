function FoodNutritionInfo({ icon, value, label, colorClass }) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div className={`shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <span className="mt-1 text-xs font-extrabold leading-none text-[#111] sm:text-sm">
        {value}
      </span>
      <span className="mt-0.5 text-[10px] font-semibold leading-tight text-[#111] sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

export default FoodNutritionInfo;
