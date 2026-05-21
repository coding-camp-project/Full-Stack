import { Flame, Wheat, Droplets } from "lucide-react";

import SummaryCard from "./SummaryCard";

function SummarySection({ calories = 0, carbs = 0, fat = 0 }) {
  const targetCalories = 2000;
  const targetCarbs = 300;
  const targetFat = 70;

  const calProgress = Math.min(Math.round((calories / targetCalories) * 100), 100);
  const carbsProgress = Math.min(Math.round((carbs / targetCarbs) * 100), 100);
  const fatProgress = Math.min(Math.round((fat / targetFat) * 100), 100);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      <SummaryCard
        title="Kalori Hari Ini"
        value={calories.toString()}
        unit="kkal"
        progress={calProgress}
        color="#33C267"
        icon={<Flame size={22} />}
      />

      <SummaryCard
        title="Karbohidrat"
        value={carbs.toString()}
        unit="g"
        progress={carbsProgress}
        color="#F5A623"
        icon={<Wheat size={22} />}
      />

      <SummaryCard
        title="Lemak"
        value={fat.toString()}
        unit="g"
        progress={fatProgress}
        color="#8B5CF6"
        icon={<Droplets size={22} />}
      />
    </section>
  );
}

export default SummarySection;