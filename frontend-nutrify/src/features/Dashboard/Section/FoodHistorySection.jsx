

import FoodHistoryCard from "../Components/FoodHistoryCard";

function FoodHistorySection() {
  const foods = [
    {
      title: "Nasi Goreng",
      time: "Hari ini, 13.00",
      components: "4 komponen",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200",
    },

    {
      title: "Nasi Goreng",
      time: "Hari ini, 13.00",
      components: "4 komponen",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200",
    },

    {
      title: "Nasi Goreng",
      time: "Hari ini, 13.00",
      components: "4 komponen",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {foods.map((food, index) => (
        <FoodHistoryCard
          key={index}
          title={food.title}
          time={food.time}
          components={food.components}
          image={food.image}
        />
      ))}
    </div>
  );
}

export default FoodHistorySection;