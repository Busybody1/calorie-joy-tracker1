import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCredits } from "@/hooks/useCredits";
import { useToast } from "@/components/ui/use-toast";

export const AIMealGenerator = () => {
  const [preferences, setPreferences] = useState("");
  const [calories, setCalories] = useState("");
  const { useCredit, hasCredits } = useCredits();
  const { toast } = useToast();

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
      // TODO: Implement AI meal generation
      toast({
        title: "Coming soon",
        description: "AI meal generation will be implemented soon!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate meal. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder={
          hasCredits
            ? "Dietary preferences..."
            : "No credits remaining. Please wait for reset."
        }
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        disabled={!hasCredits}
      />
      <Input
        placeholder={
          hasCredits ? "Calorie goal..." : "Credits will reset weekly."
        }
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        disabled={!hasCredits}
      />
      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={!hasCredits}
      >
        Generate Meal
      </Button>
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