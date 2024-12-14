import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GeneratedMeal } from "@/types/meal";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GeneratedMealCardProps {
  meal: GeneratedMeal;
  onAddToDaily: () => void;
}

export const GeneratedMealCard = ({ meal, onAddToDaily }: GeneratedMealCardProps) => {
  const formatDescription = (description: string) => {
    return description.split('\n').map((line, index) => {
      if (line.trim() === '') return null;
      
      // Format section titles
      if (line.includes(':')) {
        const [title, content] = line.split(':');
        if (content) {
          return (
            <div key={index} className="mb-2">
              <strong className="text-primary">{title}:</strong>
              <span>{content}</span>
            </div>
          );
        }
      }
      
      // Format bullet points
      if (line.trim().startsWith('-')) {
        return (
          <div key={index} className="ml-4 mb-1">
            • {line.substring(1).trim()}
          </div>
        );
      }
      
      return <div key={index} className="mb-1">{line}</div>;
    });
  };

  return (
    <Card className="bg-accent/5">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-medium text-lg">{meal.name}</h3>
          <div className="mt-2 text-sm space-y-1">
            <p className="text-orange-500">Calories: {meal.calories} kcal</p>
            <p className="text-violet-500">Protein: {meal.protein}g</p>
            <p className="text-blue-500">Carbs: {meal.carbs}g</p>
            <p className="text-pink-500">Fat: {meal.fat}g</p>
          </div>
        </div>
        
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="text-sm text-muted-foreground">
            {formatDescription(meal.description)}
          </div>
        </ScrollArea>

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