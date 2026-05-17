function HealthAnalysisCard({ items }) {
  return (
    <div className="rounded-xl border border-[#E7DFC9] bg-[#FFFCF2] p-5">
      <h3 className="text-[16px] font-bold text-[#1E1E1E]">
        Analisis Kesehatan
      </h3>

      <div className="mt-4 space-y-4">
        {items.map(({ icon, title, description }) => (
          <div key={title} className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
              {icon}
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-[#1E1E1E]">
                {title}
              </h4>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#666]">
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
