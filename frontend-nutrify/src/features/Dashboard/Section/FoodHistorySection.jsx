

import FoodHistoryCard from "../Components/FoodHistoryCard";
import foodImage from "../../../assets/healthy-food-img.png";

function FoodHistorySection({ items = [] }) {
  const recentItems = items.slice(0, 3);

  if (recentItems.length === 0) {
    return <p className="text-[#777] text-sm py-4">Belum ada riwayat makanan.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {recentItems.map((food, index) => (
        <FoodHistoryCard
          key={food.id || index}
          title={food.name}
          time={food.time}
          components={`${food.components} komponen`}
          image={food.image || foodImage}
        />
      ))}
    </div>
  );
}

export default FoodHistorySection;