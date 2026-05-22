function HealthAnalysisCard({ items }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#E7DFC9] bg-[#FFFCF2] p-4 sm:p-5">
      <h3 className="text-[14px] font-bold text-[#1E1E1E] sm:text-[16px]">
        Analisis Kesehatan
      </h3>

      <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
        {items.map(({ icon, title, description }) => (
          <div key={title} className="flex min-w-0 gap-2.5 sm:gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white sm:h-7 sm:w-7">
              {icon}
            </div>

            <div className="min-w-0">
              <h4 className="text-[12px] font-bold text-[#1E1E1E] sm:text-[13px]">
                {title}
              </h4>
              <p className="mt-0.5 break-words text-[11px] leading-relaxed text-[#666]">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthAnalysisCard;
