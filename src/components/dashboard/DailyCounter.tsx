import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Food {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
}

interface DailyCounterProps {
  selectedFoods: Food[];
  updateServings: (index: number, newServings: number) => void;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const DailyCounter = ({
  selectedFoods,
  updateServings,
  totals,
}: DailyCounterProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="text-sm font-medium">Calories</div>
          <div className="text-2xl font-bold">{totals.calories.toFixed(0)}</div>
        </div>
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="text-sm font-medium">Protein</div>
          <div className="text-2xl font-bold">{totals.protein.toFixed(1)}g</div>
        </div>
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="text-sm font-medium">Carbs</div>
          <div className="text-2xl font-bold">{totals.carbs.toFixed(1)}g</div>
        </div>
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="text-sm font-medium">Fat</div>
          <div className="text-2xl font-bold">{totals.fat.toFixed(1)}g</div>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {selectedFoods.map((food, index) => (
            <div key={index} className="p-3 rounded-lg border space-y-2">
              <div className="flex justify-between">
                <div className="font-medium">{food.name}</div>
                <div className="text-sm text-muted-foreground">
                  {(food.calories * food.servings).toFixed(0)} cal
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateServings(index, food.servings - 0.25)}
                >
                  -
                </Button>
                <div className="text-sm font-medium w-16 text-center">
                  {food.servings} serving{food.servings !== 1 ? "s" : ""}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateServings(index, food.servings + 0.25)}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};