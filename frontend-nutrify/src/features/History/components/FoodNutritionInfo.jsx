function FoodNutritionInfo({ icon, value, label, colorClass }) {
  return (
    <div className="flex min-w-12 flex-col items-center text-center">
      <div className={colorClass}>
        {icon}
      </div>
      <span className="mt-1 text-[14px] font-extrabold leading-none text-[#111]">
        {value}
      </span>
      <span className="mt-1 text-[11px] font-semibold text-[#111]">
        {label}
      </span>
    </div>
  );
}

export default FoodNutritionInfo;
