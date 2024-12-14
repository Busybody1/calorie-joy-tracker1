export type MacroFocus = "Protein" | "Fat" | "Carbs" | "Balanced";

export interface MealPreferences {
  diet: string;
  maxCalories: number;
  foodPreferences: string;
  foodsToAvoid: string;
  macroFocus: MacroFocus;
  maxBudget: number;
}

export interface GeneratedMeal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}