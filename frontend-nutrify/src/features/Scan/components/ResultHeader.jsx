import { CheckCircle2, Heart } from "lucide-react";

function ResultHeader({ foodName = "Nasi Goreng", confidence = 0.92, healthScore = 75, healthGrade = "B", servingSizeG, servingUnit }) {
  const formattedName = foodName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  // Calculate display confidence score
  let displayConfidence = 100.0;
  if (confidence !== undefined && confidence !== null) {
    displayConfidence = parseFloat((confidence * 100).toFixed(1));
    // If confidence was parsed from 100 down
    if (displayConfidence > 100) displayConfidence = 100;
  }

  // Determine color and description based on healthGrade
  let gradeColor = "bg-[#49AE84] text-white";
  let gradeText = "Sangat Sehat";
  if (healthGrade === "B") {
    gradeColor = "bg-[#2ECC71] text-white";
    gradeText = "Sehat";
  } else if (healthGrade === "C") {
    gradeColor = "bg-[#F1C40F] text-black";
    gradeText = "Cukup Sehat";
  } else if (healthGrade === "D") {
    gradeColor = "bg-[#E67E22] text-white";
    gradeText = "Kurang Sehat";
  } else if (healthGrade === "E") {
    gradeColor = "bg-[#E74C3C] text-white";
    gradeText = "Batasi Konsumsi";
  }

  return (
    <div className="min-w-0 rounded-xl border border-[#DCEFE6] bg-[#F4FFF9] px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex min-w-0 items-start gap-2.5 sm:items-center sm:gap-3">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#49AE84] sm:mt-0 sm:size-[22px]" />

        <div className="min-w-0 text-left">
          <p className="text-[11px] font-medium text-[#777] sm:text-[12px]">
            Makanan terdeteksi:
          </p>
          <h2 className="break-words text-[15px] font-bold text-[#1E1E1E] sm:text-[18px]">
            {formattedName}
          </h2>
          {servingSizeG && servingUnit && (
            <p className="text-[11px] font-bold text-[#1E7F4E] mt-0.5">
              Takaran Saji: 1 {servingUnit} ({servingSizeG}g)
            </p>
          )}
          <p className="text-[10px] font-medium text-[#777] sm:text-[11px] mt-0.5">
            Tingkat keyakinan: {displayConfidence}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-center border-l-0 sm:border-l border-[#DCEFE6] pl-0 sm:pl-5">
        <Heart size={20} className="text-[#E74C3C]" />
        <div>
          <p className="text-[11px] font-medium text-[#777] sm:text-[12px]">
            Health Score:
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-bold text-[#1E1E1E]">{healthScore}/100</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${gradeColor}`}>
              Kelas {healthGrade} ({gradeText})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultHeader;
