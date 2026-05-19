function PromptCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button 
      onClick={onClick}
      className="flex h-[120px] w-[120px] md:h-[130px] md:w-[130px] flex-col items-center justify-center rounded-xl bg-white px-2 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer border border-white/10"
    >
      
      <div className="mb-1 text-[#49AE84]">
        {icon}
      </div>

      <h3 className="text-[12px] md:text-[13px] font-bold text-[#1E1E1E] tracking-tight">
        {title}
      </h3>

      <p className="mt-1 text-[9px] md:text-[10px] leading-snug text-[#777] px-1 line-clamp-2">
        {description}
      </p>
    </button>
  );
}

export default PromptCard;