import Food from "../models/food.model.js";
import { loadFoodsFromCSV } from "../services/csv.service.js";

const seedDatabase = async () => {
  try {
    const foods = loadFoodsFromCSV();
    
    // Filter out duplicate food names in-memory to respect the unique index constraint
    const seenNames = new Set();
    const uniqueFoods = [];
    
    for (const food of foods) {
      const nameLower = food.food_name.toLowerCase().trim();
      if (!seenNames.has(nameLower)) {
        seenNames.add(nameLower);
        uniqueFoods.push(food);
      }
    }

    const foodCount = await Food.countDocuments();
    
    if (foodCount === uniqueFoods.length) {
      console.log(`Database already seeded with all ${foodCount} unique food items.`);
      return;
    }

    console.log(`Food count in database (${foodCount}) does not match unique CSV records (${uniqueFoods.length}). Re-seeding food database...`);
    
    // Clear existing foods
    await Food.deleteMany({});
    
    if (uniqueFoods.length === 0) {
      console.log("No foods found to seed.");
      return;
    }

    // Insert all unique foods in chunks
    const chunkSize = 500;
    for (let i = 0; i < uniqueFoods.length; i += chunkSize) {
      const chunk = uniqueFoods.slice(i, i + chunkSize);
      await Food.insertMany(chunk);
    }
    
    const finalCount = await Food.countDocuments();
    console.log(`Successfully seeded ${finalCount} unique food items into MongoDB.`);
  } catch (error) {
    console.error("Error seeding food database:", error);
  }
};

export default seedDatabase;
