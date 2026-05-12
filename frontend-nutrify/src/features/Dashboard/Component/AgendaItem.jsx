function AgendaItem({
  color,
  title,
  time,
  icon,
}) {
  return (
    <div className="flex items-start gap-4">
      
      {/* ICON */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: `${color}20`,
          color: color,
        }}
      >
        {icon}
      </div>

      {/* CONTENT */}
      <div>
        <h4 className="text-[15px] font-semibold text-[#1E1E1E]">
          {title}
        </h4>

        <p className="mt-1 text-[14px] text-[#666]">
          {time}
        </p>
      </div>
    </div>
  );
}

export default AgendaItem;