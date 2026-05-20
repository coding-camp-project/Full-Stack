import {
  AlertTriangle,
  Beef,
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

const nutritionItems = [
  {
    icon: <Flame size={20} />,
    label: "Kalori",
    value: "520",
    unit: "kkal",
    tone: "orange",
  },
  {
    icon: <Leaf size={20} />,
    label: "Protein",
    value: "14",
    unit: "g",
    tone: "green",
  },
  {
    icon: <Flame size={20} />,
    label: "Lemak",
    value: "18",
    unit: "g",
    tone: "orange",
  },
  {
    icon: <Droplets size={20} />,
    label: "Karbohidrat",
    value: "72",
    unit: "g",
    tone: "blue",
  },
  {
    icon: <Sprout size={20} />,
    label: "Serat",
    value: "2",
    unit: "g",
    tone: "green",
  },
  {
    icon: <TestTube2 size={20} />,
    label: "Gula",
    value: "3",
    unit: "g",
    tone: "purple",
  },
  {
    icon: <Lock size={20} />,
    label: "Sodium",
    value: "82",
    unit: "mg",
    tone: "purple",
  },
];

const healthItems = [
  {
    icon: <AlertTriangle size={16} className="text-[#F5A623]" />,
    title: "Nasi Goreng",
    description: "Kandungan sodium dalam makanan ini tergolong tinggi.",
  },
  {
    icon: <ShieldCheck size={16} className="text-[#49AE84]" />,
    title: "Rendah Serat",
    description: "Kandungan serat makanan ini tergolong rendah.",
  },
  {
    icon: <ShieldCheck size={16} className="text-[#49AE84]" />,
    title: "Gula Aman",
    description: "Kandungan gula dalam batas aman.",
  },
];

const recommendationItems = [
  {
    icon: <Salad size={16} className="text-[#49AE84]" />,
    title: "Tambahkan sayuran",
    description: "Tambahkan sayuran hijau untuk meningkatkan asupan serat.",
  },
  {
    icon: <Beef size={16} className="text-[#49AE84]" />,
    title: "Kurangi penggunaan garam",
    description: "Batasi bumbu berlebih untuk mengurangi asupan sodium.",
  },
  {
    icon: <Sprout size={16} className="text-[#49AE84]" />,
    title: "Porsi yang disarankan",
    description: "Konsumsi dalam porsi seimbang dengan makanan bergizi lainnya.",
  },
];

function ScanResultSection({ imagePreview, result }) {
  if (!result || !result.nutrition) return null;

  const { best_prediction, nutrition, recommendation, warning } = result;

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

  const dynamicRecommendationItems = [
    {
      icon: <Salad size={16} className="text-[#49AE84]" />,
      title: "Rekomendasi AI",
      description: recommendation || "Konsumsi dalam porsi seimbang.",
    },
  ];

  return (
    <div className="w-full px-4 py-8 lg:px-6">
      <section className="rounded-2xl border border-[#D8D8D8] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#1E1E1E]">
            Hasil Scan: {best_prediction?.food_name?.replace(/_/g, " ").toUpperCase()} ({(best_prediction?.confidence_score * 100).toFixed(1)}%)
          </h2>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#1E7F4E] px-4 text-[14px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#16663E]"
          >
            <RefreshCcw size={16} />
            Scan Ulang
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_1.25fr]">
          <img
            src={imagePreview || healthyFoodImage}
            alt="Hasil scan makanan"
            className="h-72 w-full rounded-xl object-cover lg:h-77"
          />

          <div>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-[14px] font-bold text-[#1E1E1E]">
                Informasi Nutrisi (per 100g)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-2">
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

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <HealthAnalysisCard items={dynamicHealthItems} />
          <RecommendationCard items={dynamicRecommendationItems} />
        </div>
      </section>
    </div>
  );
}

export default ScanResultSection;
