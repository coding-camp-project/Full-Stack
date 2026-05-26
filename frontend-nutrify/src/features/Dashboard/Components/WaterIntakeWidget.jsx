import { useState, useEffect } from "react";
import { Droplet } from "lucide-react";
import { getUserData } from "@/utils/userSession";

function WaterIntakeWidget() {
  const userData = getUserData();
  const conditions = (userData?.healthConditions || []).map(c => c.toLowerCase());
  const target = conditions.includes("asam urat") ? 3000 : 2000;
  const mlPerGlass = 400;
  const [intake, setIntake] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedIntake = localStorage.getItem(`waterIntake_${today}`);
    if (savedIntake) {
      setIntake(parseInt(savedIntake));
    }
  }, []);

  const toggleWater = (index) => {
    let newIntake;
    const clickedVolume = (index + 1) * mlPerGlass;
    
    // If clicking the current exact level, remove one glass
    if (intake === clickedVolume) {
      newIntake = intake - mlPerGlass;
    } else {
      newIntake = clickedVolume;
    }

    setIntake(newIntake);
    const today = new Date().toDateString();
    localStorage.setItem(`waterIntake_${today}`, newIntake.toString());
  };

  const glassesCount = Math.ceil(target / mlPerGlass); 
  const currentGlasses = Math.floor(intake / mlPerGlass);
  const percentage = Math.min(Math.round((intake / target) * 100), 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EBF5FF] text-[#529DF8]">
            <Droplet size={14} strokeWidth={2.5} />
          </div>
          <span className="text-[14px] font-bold text-[#1E1E1E]">Minum Air</span>
        </div>
        
        {/* Progress Bar Mini */}
        <div className="h-2 w-[4.5rem] overflow-hidden rounded-full bg-[#E5E7EB]">
          <div 
            className="h-full bg-[#529DF8] transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex items-end justify-between mt-1">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-bold text-[#1E1E1E] leading-none">
              {(intake / 1000).toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] font-bold text-[#777]">
              / {(target / 1000).toLocaleString('id-ID')} Liter
            </span>
          </div>
          <p className="text-[10px] font-medium text-[#777] mt-1.5">
            {percentage}% dari target harian
          </p>
        </div>

        {/* Glasses */}
        <div className="flex gap-1">
          {Array.from({ length: glassesCount }).map((_, i) => {
            const isFilled = i < currentGlasses;
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleWater(i)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <svg 
                  width="18" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill={isFilled ? "#529DF8" : "transparent"} 
                  stroke="#529DF8" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 2L6 20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20L19 2H5Z" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WaterIntakeWidget;
