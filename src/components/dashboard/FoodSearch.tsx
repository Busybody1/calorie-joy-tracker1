import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const USDA_API_KEY = "ldByUjvqs9QYqAXTMQeHB5omhMFNc1Y7VBgfDW77";

interface Nutrient {
  nutrientId: number;
  nutrientName: string;
  value: number;
  unitName: string;
}

interface Food {
  fdcId: number;
  description: string;
  foodNutrients: Nutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
}

interface FoodSearchProps {
  onAddFood: (food: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servings: number;
  }) => void;
}

export const FoodSearch = ({ onAddFood }: FoodSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const { toast } = useToast();

  const getNutrientValue = (nutrients: Nutrient[], targetId: number) => {
    const nutrient = nutrients.find((n) => n.nutrientId === targetId);
    return nutrient?.value || 0;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
          searchQuery
        )}&dataType=Foundation,SR%20Legacy&pageSize=50&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=${USDA_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch food data");
      }

      const data = await response.json();
      setSearchResults(data.foods || []);

      if (data.foods?.length === 0) {
        toast({
          title: "No foods found",
          description: "Try a different search term",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch food data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFood = (food: Food) => {
    const calories = getNutrientValue(food.foodNutrients, 2047); // Energy
    const protein = getNutrientValue(food.foodNutrients, 1003); // Protein
    const fat = getNutrientValue(food.foodNutrients, 1004); // Fat
    const carbs = getNutrientValue(food.foodNutrients, 1005); // Carbohydrates

    onAddFood({
      name: food.description,
      calories,
      protein,
      carbs,
      fat,
      servings: 1,
    });

    toast({
      title: "Food added",
      description: `Added ${food.description} to your daily intake`,
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search foods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </form>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Searching...
            </div>
          ) : (
            searchResults.map((food) => (
              <Card
                key={food.fdcId}
                className="transition-colors hover:bg-accent/5"
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{food.description}</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          Calories:{" "}
                          {getNutrientValue(food.foodNutrients, 2047).toFixed(1)}{" "}
                          kcal
                        </p>
                        <p>
                          Protein:{" "}
                          {getNutrientValue(food.foodNutrients, 1003).toFixed(1)}g
                        </p>
                        <p>
                          Fat:{" "}
                          {getNutrientValue(food.foodNutrients, 1004).toFixed(1)}g
                        </p>
                        <p>
                          Carbs:{" "}
                          {getNutrientValue(food.foodNutrients, 1005).toFixed(1)}g
                        </p>
                        <p className="text-xs">
                          Serving size:{" "}
                          {food.servingSize
                            ? `${food.servingSize} ${food.servingSizeUnit}`
                            : "100g"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAddFood(food)}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};