const waveformBars = ["h-3", "h-5", "h-8", "h-4", "h-7", "h-5", "h-3"];

function ListeningIndicator() {
  return (
    <div className="pointer-events-none absolute -top-15 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#49AE84]/20 bg-white/90 px-4 py-2.5 text-[#245747] shadow-[0_18px_44px_rgba(29,69,53,0.14)] backdrop-blur-md">
      <div className="flex h-8 items-center gap-1">
        {waveformBars.map((height, index) => (
          <span
            key={height + index}
            className={`${height} w-1.5 rounded-full bg-[#49AE84] animate-pulse`}
            style={{
              animationDelay: `${index * 90}ms`,
              animationDuration: "720ms",
            }}
          />
        ))}
      </div>

      <span className="whitespace-nowrap text-sm font-medium">Listening...</span>
    </div>
  );
}

export default ListeningIndicator;
