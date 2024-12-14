import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GeneratedMeal } from "@/types/meal";
import { Plus } from "lucide-react";

interface GeneratedMealCardProps {
  meal: GeneratedMeal;
  onAddToDaily: () => void;
}

export const GeneratedMealCard = ({ meal, onAddToDaily }: GeneratedMealCardProps) => {
  return (
    <Card className="bg-accent/5">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-medium text-lg">{meal.name}</h3>
          <p className="text-sm text-muted-foreground">{meal.description}</p>
          <div className="mt-2 text-sm space-y-1">
            <p>Calories: {meal.calories} kcal</p>
            <p>Protein: {meal.protein}g</p>
            <p>Carbs: {meal.carbs}g</p>
            <p>Fat: {meal.fat}g</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onAddToDaily}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Today's Intake
        </Button>
      </CardContent>
    </Card>
  );
};