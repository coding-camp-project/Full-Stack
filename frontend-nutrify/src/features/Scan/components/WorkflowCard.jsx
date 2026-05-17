function WorkflowCard({ icon, title, description, showArrow = true }) {
  return (
    <div className="relative flex flex-1 items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#C9F5E6] text-[#49AE84]">
        {icon}
      </div>

      <div>
        <h4 className="text-[13px] font-bold text-[#1E1E1E]">
          {title}
        </h4>
        <p className="mt-1 max-w-45 text-[11px] leading-relaxed text-[#555]">
          {description}
        </p>
      </div>

      {showArrow && (
        <span className="ml-auto mr-3 hidden text-[28px] font-light text-[#A9D4C6] lg:block">
          &gt;
        </span>
      )}
    </div>
  );
}

export default WorkflowCard;
