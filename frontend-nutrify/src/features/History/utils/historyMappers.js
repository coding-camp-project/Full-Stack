import foodImage from "../../../assets/healthy-food-img.png";

function formatHistoryTime(dateValue) {
  return new Date(dateValue).toLocaleString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
}

export function mapHistoryRecordToCardItem(record) {
  const createdAt = record.createdAt || record.date || new Date().toISOString();

  return {
    id: record._id || record.id,
    time: record.time || formatHistoryTime(createdAt),
    name: record.foodName || record.name || "Makanan",
    components: record.components || 1,
    calories: Math.round(record.calories || 0),
    protein: parseFloat((record.protein || 0).toFixed(1)),
    carbs: parseFloat((record.carbs || record.carbohydrates || 0).toFixed(1)),
    fat: parseFloat((record.fat || 0).toFixed(1)),
    sugar: parseFloat((record.sugar || 0).toFixed(1)),
    sodium: parseFloat((record.sodium || 0).toFixed(1)),
    fiber: parseFloat((record.fiber || 0).toFixed(1)),
    image: record.image || foodImage,
    date: createdAt,
    healthScore: record.healthScore || 0,
    raw: record,
  };
}

export function mapHistoryRecordToScanResult(record) {
  return {
    best_prediction: {
      food_name: record.foodName || "Makanan",
      confidence_score: record.confidence || 0,
      serving_size_g: record.serving_size_g,
      serving_unit: record.serving_unit,
    },
    nutrition: {
      calories: record.calories || 0,
      protein: record.protein || 0,
      fat: record.fat || 0,
      carbohydrates: record.carbs || 0,
      fiber: record.fiber || 0,
      sugar: record.sugar || 0,
      sodium: record.sodium || 0,
    },
    recommendation: record.recommendation || "Konsumsi dalam porsi seimbang.",
    healthAnalysis: record.healthAnalysis || [],
    healthScore: record.healthScore,
  };
}
