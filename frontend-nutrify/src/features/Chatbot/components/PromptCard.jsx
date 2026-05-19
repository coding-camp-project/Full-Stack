function PromptCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button 
      onClick={onClick}
      className="flex h-37.5 w-37.5 flex-col items-center justify-center rounded-2xl bg-white px-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      
      <div className="mb-3 text-[#49AE84]">
        {icon}
      </div>

      <h3 className="text-[16px] font-semibold text-[#1E1E1E]">
        {title}
      </h3>

      <p className="mt-2 text-[12px] leading-normal text-[#777]">
        {description}
      </p>
    </button>
  );
}

export default PromptCard;