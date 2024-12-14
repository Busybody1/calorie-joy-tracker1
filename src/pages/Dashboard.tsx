import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarStrip } from "@/components/CalendarStrip";
import { FoodSearch } from "@/components/dashboard/FoodSearch";
import { AIMealGenerator } from "@/components/dashboard/AIMealGenerator";
import { DailyCounter } from "@/components/dashboard/DailyCounter";
import logo from "../assets/logo.png";

interface Food {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
}

const Dashboard = () => {
  const [date, setDate] = useState<Date>(new Date(2024, 11, 14)); // December 14, 2024
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);

  const addFood = (food: Food) => {
    setSelectedFoods([...selectedFoods, food]);
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
              <FoodSearch onAddFood={addFood} />
            </CardContent>
          </Card>

          {/* AI Meal Generator Column */}
          <Card>
            <CardHeader>
              <CardTitle>AI Meal Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <AIMealGenerator />
            </CardContent>
          </Card>

          {/* Daily Counter Column */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Totals</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyCounter
                selectedFoods={selectedFoods}
                updateServings={updateServings}
                totals={totals}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;