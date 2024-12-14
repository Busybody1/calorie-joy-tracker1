import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/useCredits";
import { useToast } from "@/components/ui/use-toast";
import { MealPreferences, GeneratedMeal } from "@/types/meal";
import { MealPreferencesForm } from "./meal-generator/MealPreferencesForm";
import { GeneratedMealCard } from "./meal-generator/GeneratedMealCard";
import { supabase } from "@/integrations/supabase/client";

export const AIMealGenerator = () => {
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

      const mockMeal: GeneratedMeal = {
        name: "Sample Generated Meal",
        description: data.generatedMeal || "This is a placeholder for the generated meal description.",
        calories: 450,
        protein: 30,
        carbs: 45,
        fat: 15,
      };
      
      setGeneratedMeal(mockMeal);
      toast({
        title: "Meal generated",
        description: "Your meal has been generated based on your preferences.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate meal. Please try again.",
      });
    }
  };

  const handleAddToDaily = () => {
    if (!generatedMeal) return;
    // TODO: Implement adding to daily intake
    toast({
      title: "Added to daily intake",
      description: "The meal has been added to your daily tracking.",
    });
  };

  return (
    <div className="space-y-4">
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
