import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const AIMealGenerator = () => {
  return (
    <div className="space-y-4">
      <Input placeholder="Dietary preferences..." />
      <Input placeholder="Calorie goal..." type="number" />
      <Button className="w-full">Generate Meal</Button>
      <Card className="bg-accent/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Your AI-generated meal will appear here...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};