import {
  AlertTriangle,
  Droplets,
  Flame,
  Leaf,
  Lock,
  Salad,
  ShieldCheck,
  Sprout,
  TestTube2,
  RefreshCcw,
} from "lucide-react";

import healthyFoodImage from "../../../assets/healthy-food-img.png";

import HealthAnalysisCard from "../components/HealthAnalysisCard";
import NutritionCard from "../components/NutritionCard";
import RecommendationCard from "../components/RecommendationCard";
import ResultHeader from "../components/ResultHeader";

function ScanResultSection({ imagePreview, result, showRescanButton = true }) {
  if (!result || !result.nutrition) return null;

  const { best_prediction, nutrition, recommendation, warning, healthAnalysis } = result;

  const dynamicNutritionItems = [
    {
      icon: <Flame size={20} />,
      label: "Kalori",
      value: Math.round(nutrition.calories).toString(),
      unit: "kkal",
      tone: "orange",
    },
    {
      icon: <Leaf size={20} />,
      label: "Protein",
      value: nutrition.protein.toFixed(1),
      unit: "g",
      tone: "green",
    },
    {
      icon: <Flame size={20} />,
      label: "Lemak",
      value: nutrition.fat.toFixed(1),
      unit: "g",
      tone: "orange",
    },
    {
      icon: <Droplets size={20} />,
      label: "Karbohidrat",
      value: nutrition.carbohydrates.toFixed(1),
      unit: "g",
      tone: "blue",
    },
    {
      icon: <Sprout size={20} />,
      label: "Serat",
      value: nutrition.fiber.toFixed(1),
      unit: "g",
      tone: "green",
    },
    {
      icon: <TestTube2 size={20} />,
      label: "Gula",
      value: nutrition.sugar.toFixed(1),
      unit: "g",
      tone: "purple",
    },
    {
      icon: <Lock size={20} />,
      label: "Sodium",
      value: Math.round(nutrition.sodium).toString(),
      unit: "mg",
      tone: "purple",
    },
  ];

  // We can derive some basic health items from nutrition if we want, or from recommendation text
  const dynamicHealthItems = [];
  if (nutrition.sodium > 400) {
    dynamicHealthItems.push({
      icon: <AlertTriangle size={16} className="text-[#F5A623]" />,
      title: "Sodium Tinggi",
      description: "Kandungan sodium dalam makanan ini tergolong cukup tinggi.",
    });
  } else {
    dynamicHealthItems.push({
      icon: <ShieldCheck size={16} className="text-[#49AE84]" />,
      title: "Sodium Aman",
      description: "Kandungan sodium masih dalam batas aman.",
    });
  }

  if (nutrition.sugar > 10) {
    dynamicHealthItems.push({
      icon: <AlertTriangle size={16} className="text-[#F5A623]" />,
      title: "Gula Tinggi",
      description: "Perhatikan asupan gula Anda.",
    });
  } else {
    dynamicHealthItems.push({
      icon: <ShieldCheck size={16} className="text-[#49AE84]" />,
      title: "Gula Aman",
      description: "Kandungan gula dalam batas wajar.",
    });
  }

  if (warning) {
    dynamicHealthItems.push({
      icon: <AlertTriangle size={16} className="text-[#F5A623]" />,
      title: "Warning AI",
      description: warning,
    });
  }

  if (Array.isArray(healthAnalysis) && healthAnalysis.length > 0) {
    dynamicHealthItems.splice(
      0,
      dynamicHealthItems.length,
      ...healthAnalysis.map((description) => {
        const isWarning = description.startsWith("⚠️") || description.toLowerCase().includes("peringatan") || description.toLowerCase().includes("catatan");
        return {
          icon: isWarning ? (
            <AlertTriangle size={16} className="text-[#F5A623]" />
          ) : (
            <ShieldCheck size={16} className="text-[#49AE84]" />
          ),
          title: isWarning ? "Catatan Kesehatan" : "Analisis Nutrisi",
          description,
        };
      })
    );
  }

  const dynamicRecommendationItems = [
    {
      icon: <Salad size={16} className="text-[#49AE84]" />,
      title: "Rekomendasi AI",
      description: recommendation || "Konsumsi dalam porsi seimbang.",
    },
  ];

  return (
    <div className="w-full min-w-0 max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 lg:max-w-[1360px] lg:mx-auto">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-[#D8D8D8] bg-white p-3 shadow-sm sm:p-5 lg:p-6">

        {/* Rescan button */}
        {showRescanButton && (
          <div className="mb-3 flex justify-end sm:mb-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#1E7F4E] px-3 text-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#16663E] sm:h-10 sm:gap-2 sm:px-4 sm:text-[14px]"
            >
              <RefreshCcw size={14} className="sm:size-4" />
              Scan Ulang
            </button>
          </div>
        )}

        {/* Image + Nutrition grid */}
        <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-5 xl:grid-cols-[1.05fr_1.25fr]">
          <img
            src={imagePreview || healthyFoodImage}
            alt="Hasil scan makanan"
            className="h-44 w-full min-w-0 rounded-xl object-cover sm:h-56 lg:h-72 xl:h-77"
          />

          <div className="min-w-0">
            <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
              <h3 className="text-[12px] font-bold text-[#1E1E1E] sm:text-[14px] text-left">
                Informasi Nutrisi ({best_prediction?.serving_size_g ? `Takaran: 1 ${best_prediction.serving_unit || 'porsi'} - ${best_prediction.serving_size_g}g` : "per 100g"})
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
              {dynamicNutritionItems.map((item) => (
                <NutritionCard key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Result header */}
        <div className="mt-3 sm:mt-5">
          <ResultHeader
            foodName={best_prediction?.food_name}
            confidence={best_prediction?.confidence_score}
            healthScore={result.healthScore}
            healthGrade={result.healthGrade}
            servingSizeG={best_prediction?.serving_size_g}
            servingUnit={best_prediction?.serving_unit}
          />
        </div>

        {/* Analysis + Recommendation — stack on mobile, 2-col on lg */}
        <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:mt-5 lg:grid-cols-2 lg:gap-5">
          <HealthAnalysisCard items={dynamicHealthItems} />
          <RecommendationCard items={dynamicRecommendationItems} />
        </div>
      </section>
    </div>
  );
}

export default ScanResultSection;
