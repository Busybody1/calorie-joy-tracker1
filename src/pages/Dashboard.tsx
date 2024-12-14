import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search } from "lucide-react";
import { CalendarStrip } from "@/components/CalendarStrip";
import logo from "../assets/logo.png";

const Dashboard = () => {
  const [date, setDate] = useState<Date>(new Date(2024, 11, 14)); // December 14, 2024
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);

  // Placeholder data
  const searchResults = [
    { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
    { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  ];

  const addFood = (food: any) => {
    setSelectedFoods([...selectedFoods, { ...food, servings: 1 }]);
  };

  const updateServings = (index: number, newServings: number) => {
    const updatedFoods = [...selectedFoods];
    updatedFoods[index].servings = Math.max(0.25, newServings);
    setSelectedFoods(updatedFoods);
  };

  const totals = selectedFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories * food.servings,
      protein: acc.protein + food.protein * food.servings,
      carbs: acc.carbs + food.carbs * food.servings,
      fat: acc.fat + food.fat * food.servings,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>

            {/* Date Picker */}
            <CalendarStrip date={date} onSelect={setDate} />

            {/* Credits */}
            <div className="text-sm font-medium">
              Credits Left: <span className="text-primary">8/10</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Food Search Column */}
          <Card>
            <CardHeader>
              <CardTitle>Food Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {searchResults.map((food, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5"
                      >
                        <div>
                          <div className="font-medium">{food.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {food.calories} cal
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => addFood(food)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* AI Meal Generator Column */}
          <Card>
            <CardHeader>
              <CardTitle>AI Meal Generator</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Daily Counter Column */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Totals</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <div
                        key={index}
                        className="p-3 rounded-lg border space-y-2"
                      >
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
