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
      ...healthAnalysis.map((description, index) => ({
        icon:
          index === 0 ? (
            <AlertTriangle size={16} className="text-[#F5A623]" />
          ) : (
            <ShieldCheck size={16} className="text-[#49AE84]" />
          ),
        title: index === 0 ? "Analisis Nutrisi" : "Catatan Kesehatan",
        description,
      }))
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
    <div className="w-full min-w-0 max-w-full px-3 py-5 sm:px-4 sm:py-8 lg:px-6 lg:max-w-[1360px] lg:mx-auto">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-[#D8D8D8] bg-white p-4 shadow-sm sm:p-6">
        {showRescanButton && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#1E7F4E] px-4 text-[14px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#16663E]"
            >
              <RefreshCcw size={16} />
              Scan Ulang
            </button>
          </div>
        )}

        <div className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-5 xl:grid-cols-[1.05fr_1.25fr]">
          <img
            src={imagePreview || healthyFoodImage}
            alt="Hasil scan makanan"
            className="h-48 w-full min-w-0 rounded-xl object-cover sm:h-60 lg:h-72 xl:h-77"
          />

          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1E1E1E] sm:text-[14px]">
                Informasi Nutrisi (per 100g)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {dynamicNutritionItems.map((item) => (
                <NutritionCard key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <ResultHeader 
            foodName={best_prediction?.food_name} 
            confidence={best_prediction?.confidence_score} 
          />
        </div>

        <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          <HealthAnalysisCard items={dynamicHealthItems} />
          <RecommendationCard items={dynamicRecommendationItems} />
        </div>
      </section>
    </div>
  );
}

export default ScanResultSection;
