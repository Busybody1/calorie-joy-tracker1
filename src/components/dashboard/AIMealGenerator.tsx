import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCredits } from "@/hooks/useCredits";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MacroFocus, MealPreferences, GeneratedMeal } from "@/types/meal";
import { Plus } from "lucide-react";

const MACRO_OPTIONS: MacroFocus[] = ["Protein", "Fat", "Carbs", "Balanced"];

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
      // TODO: Implement AI meal generation with preferences
      const mockMeal: GeneratedMeal = {
        name: "Sample Generated Meal",
        description: "This is a placeholder for the generated meal description.",
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
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="diet">Diet Type</Label>
          <Input
            id="diet"
            placeholder={
              hasCredits
                ? "e.g., Keto, Vegan, Mediterranean..."
                : "No credits remaining. Please wait for reset."
            }
            value={preferences.diet}
            onChange={(e) => handleInputChange("diet", e.target.value)}
            disabled={!hasCredits}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxCalories">Maximum Calories</Label>
          <Input
            id="maxCalories"
            type="number"
            placeholder="Enter max calories"
            value={preferences.maxCalories}
            onChange={(e) =>
              handleInputChange("maxCalories", parseInt(e.target.value))
            }
            disabled={!hasCredits}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="foodPreferences">Food Preferences</Label>
          <Textarea
            id="foodPreferences"
            placeholder="Enter preferred ingredients or cuisines"
            value={preferences.foodPreferences}
            onChange={(e) => handleInputChange("foodPreferences", e.target.value)}
            disabled={!hasCredits}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="foodsToAvoid">Foods to Avoid</Label>
          <Textarea
            id="foodsToAvoid"
            placeholder="Enter ingredients to avoid"
            value={preferences.foodsToAvoid}
            onChange={(e) => handleInputChange("foodsToAvoid", e.target.value)}
            disabled={!hasCredits}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="macroFocus">Macro Focus</Label>
          <Select
            value={preferences.macroFocus}
            onValueChange={(value) =>
              handleInputChange("macroFocus", value as MacroFocus)
            }
            disabled={!hasCredits}
          >
            <SelectTrigger id="macroFocus">
              <SelectValue placeholder="Select macro focus" />
            </SelectTrigger>
            <SelectContent>
              {MACRO_OPTIONS.map((macro) => (
                <SelectItem key={macro} value={macro}>
                  {macro}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxBudget">Maximum Budget ($)</Label>
          <Input
            id="maxBudget"
            type="number"
            placeholder="Enter max budget"
            value={preferences.maxBudget}
            onChange={(e) =>
              handleInputChange("maxBudget", parseInt(e.target.value))
            }
            disabled={!hasCredits}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={!hasCredits}
        >
          Generate Meal
        </Button>
      </div>

      {generatedMeal && (
        <Card className="bg-accent/5">
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-medium text-lg">{generatedMeal.name}</h3>
              <p className="text-sm text-muted-foreground">
                {generatedMeal.description}
              </p>
              <div className="mt-2 text-sm space-y-1">
                <p>Calories: {generatedMeal.calories} kcal</p>
                <p>Protein: {generatedMeal.protein}g</p>
                <p>Carbs: {generatedMeal.carbs}g</p>
                <p>Fat: {generatedMeal.fat}g</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleAddToDaily}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Today's Intake
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};