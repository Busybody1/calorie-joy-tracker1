import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

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
  onRemoveFood?: (index: number) => void;
}

export const DailyCounter = ({
  selectedFoods,
  updateServings,
  totals,
  onRemoveFood,
}: DailyCounterProps) => {
  const truncateName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}...`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-[#F97316]/10">
          <div className="text-sm font-medium text-[#F97316]">Calories</div>
          <div className="text-2xl font-bold text-[#F97316]">
            {totals.calories.toFixed(0)}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-[#8B5CF6]/10">
          <div className="text-sm font-medium text-[#8B5CF6]">Protein</div>
          <div className="text-2xl font-bold text-[#8B5CF6]">
            {totals.protein.toFixed(1)}g
          </div>
        </div>
        <div className="p-4 rounded-lg bg-[#0EA5E9]/10">
          <div className="text-sm font-medium text-[#0EA5E9]">Carbs</div>
          <div className="text-2xl font-bold text-[#0EA5E9]">
            {totals.carbs.toFixed(1)}g
          </div>
        </div>
        <div className="p-4 rounded-lg bg-[#D946EF]/10">
          <div className="text-sm font-medium text-[#D946EF]">Fat</div>
          <div className="text-2xl font-bold text-[#D946EF]">
            {totals.fat.toFixed(1)}g
          </div>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {selectedFoods.map((food, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-gray-200 space-y-2 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    {truncateName(food.name)}
                    <span className="text-sm text-muted-foreground ml-2">
                      (100g serving)
                    </span>
                  </div>
                  <div className="text-sm space-y-1 mt-1">
                    <span className="text-[#F97316] font-medium">
                      {(food.calories * food.servings).toFixed(0)} cal
                    </span>
                    {" • "}
                    <span className="text-[#8B5CF6]">
                      {(food.protein * food.servings).toFixed(1)}g protein
                    </span>
                    {" • "}
                    <span className="text-[#0EA5E9]">
                      {(food.carbs * food.servings).toFixed(1)}g carbs
                    </span>
                    {" • "}
                    <span className="text-[#D946EF]">
                      {(food.fat * food.servings).toFixed(1)}g fat
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveFood?.(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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