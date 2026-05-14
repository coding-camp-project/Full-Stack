import { Flame, Wheat, Droplets } from "lucide-react";

import SummaryCard from "./SummaryCard";

function SummarySection() {
  return (
    <section className="grid grid-cols-3 gap-5">
      
      <SummaryCard
        title="Kalori Hari Ini"
        value="1.652"
        unit="kkal"
        progress={85}
        color="#33C267"
        icon={<Flame size={22} />}
      />

      <SummaryCard
        title="Karbohidrat"
        value="1.652"
        unit="kkal"
        progress={85}
        color="#F5A623"
        icon={<Wheat size={22} />}
      />

      <SummaryCard
        title="Lemak"
        value="1.652"
        unit="kkal"
        progress={85}
        color="#8B5CF6"
        icon={<Droplets size={22} />}
      />
    </section>
  );
}

export default SummarySection;