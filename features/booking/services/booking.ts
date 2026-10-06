import { apiRequest } from "../../../lib/api/client";
import type { FoodCategory } from "../constants/food-packages-data";
import type { CelebrationCategory } from "../constants/celebration-packages-data";

// Fetch optional food packages (roast goat, grilled chicken, BBQ).
export function getFoodCategories(signal?: AbortSignal) {
  return apiRequest<{ items: FoodCategory[] }>("packages/food", { signal });
}

// Fetch celebration setups (birthday, anniversary).
export function getCelebrationCategories(signal?: AbortSignal) {
  return apiRequest<{ items: CelebrationCategory[] }>("packages/celebration", { signal });
}
