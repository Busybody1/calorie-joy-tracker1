import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/useCredits";
import { useToast } from "@/components/ui/use-toast";
import { MealPreferences, GeneratedMeal } from "@/types/meal";
import { MealPreferencesForm } from "./meal-generator/MealPreferencesForm";
import { GeneratedMealCard } from "./meal-generator/GeneratedMealCard";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AIMealGeneratorProps {
  date: Date;
  onAddFood: (food: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servings: number;
  }) => void;
}

export const AIMealGenerator = ({ date, onAddFood }: AIMealGeneratorProps) => {
  const [preferences, setPreferences] = useState<MealPreferences>({
    diet: "",
    maxCalories: 500,
    foodPreferences: "",
    foodsToAvoid: "",
    macroFocus: "Balanced",
    maxBudget: 10,
  });
  const [generatedMeal, setGeneratedMeal] = useState<GeneratedMeal | null>(null);
  const { useCredit, hasCredits } = useCredits();
  const { toast } = useToast();

  const handleInputChange = (
    field: keyof MealPreferences,
    value: string | number
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setGeneratedMeal(null);
    setPreferences({
      diet: "",
      maxCalories: 500,
      foodPreferences: "",
      foodsToAvoid: "",
      macroFocus: "Balanced",
      maxBudget: 10,
    });
  };

  const handleGenerate = async () => {
    if (!hasCredits) {
      toast({
        variant: "destructive",
        title: "No credits remaining",
        description: "Please wait for your credits to reset.",
      });
      return;
    }

    try {
      await useCredit();
      
      const { data, error } = await supabase.functions.invoke('generate-meal', {
        body: { preferences },
      });

      if (error) throw error;

      // Parse the generated meal response
      const mealLines = data.generatedMeal.split('\n');
      let parsedMeal: GeneratedMeal = {
        name: "",
        description: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

      mealLines.forEach((line: string) => {
        if (line.includes("Name of the Dish:")) {
          parsedMeal.name = line.split(":")[1].trim();
        } else if (line.includes("Calories per Serving:")) {
          parsedMeal.calories = parseInt(line.split(":")[1].trim());
        } else if (line.includes("Protein per Serving:")) {
          parsedMeal.protein = parseFloat(line.split(":")[1].trim());
        } else if (line.includes("Carbs per Serving:")) {
          parsedMeal.carbs = parseFloat(line.split(":")[1].trim());
        } else if (line.includes("Fats per Serving:")) {
          parsedMeal.fat = parseFloat(line.split(":")[1].trim());
        }
      });

      parsedMeal.description = data.generatedMeal;
      setGeneratedMeal(parsedMeal);

      toast({
        title: "Meal generated",
        description: "Your meal has been generated based on your preferences.",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate meal. Please try again.",
      });
    }
  };

  const handleAddToDaily = () => {
    if (!generatedMeal) return;
    
    onAddFood({
      name: generatedMeal.name,
      calories: generatedMeal.calories,
      protein: generatedMeal.protein,
      carbs: generatedMeal.carbs,
      fat: generatedMeal.fat,
      servings: 1,
    });

    toast({
      title: "Added to daily intake",
      description: "The meal has been added to your daily tracking.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleClear}
          className="w-24"
        >
          Clear
        </Button>
        <span className="text-sm text-muted-foreground">
          Date: {format(date, "MMM d, yyyy")}
        </span>
      </div>

      <MealPreferencesForm
        preferences={preferences}
        onPreferenceChange={handleInputChange}
        disabled={!hasCredits}
      />

      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={!hasCredits}
      >
        Generate Meal
      </Button>

      {generatedMeal && (
        <GeneratedMealCard meal={generatedMeal} onAddToDaily={handleAddToDaily} />
      )}
    </div>
  );
};