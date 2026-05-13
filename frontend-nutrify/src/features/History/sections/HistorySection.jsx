import { Droplets, Flame } from "lucide-react";

import foodImage from "../../../assets/healthy-food-img.png";

import HistoryFilter from "../components/HistoryFilter";
import HistoryList from "../components/HistoryList";
import InsightCard from "../components/InsightCard";
import NutritionSummaryCard from "../components/NutritionSummaryCard";

const historyItems = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  image: foodImage,
  time: "Hari ini, 13.00",
  name: "Nasi Goreng",
  components: 4,
  calories: 520,
  protein: 14,
  carbs: 72,
  fat: 18,
}));

function HistorySection() {
  return (
    <div className="mx-auto w-full max-w-290 px-5 py-7 lg:px-7">
      <HistoryFilter />

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_16rem]">
        <NutritionSummaryCard
          icon={<Flame size={28} />}
          title="Total Kalori Hari Ini"
          value="1.652"
          unit="kkal"
          targetText="85% dari target 2.000 kkal"
          progress={85}
          tone="green"
        />

        <NutritionSummaryCard
          icon={<Droplets size={28} />}
          title="Total Protein Hari Ini"
          value="62"
          unit="g"
          targetText="75% dari target 80 g"
          progress={75}
          tone="blue"
        />

        <div className="hidden lg:block" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_16rem]">
        <HistoryList items={historyItems} />
        <InsightCard />
      </div>
    </div>
  );
}

export default HistorySection;
