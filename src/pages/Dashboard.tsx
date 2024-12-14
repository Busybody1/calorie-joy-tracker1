import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarStrip } from "@/components/CalendarStrip";
import { FoodSearch } from "@/components/dashboard/FoodSearch";
import { AIMealGenerator } from "@/components/dashboard/AIMealGenerator";
import { DailyCounter } from "@/components/dashboard/DailyCounter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import logo from "../assets/logo.png";
import { format } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCredits } from "@/hooks/useCredits";
import { useNavigate } from "react-router-dom";

interface Food {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
}

const Dashboard = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { credits, isLoading: isLoadingCredits } = useCredits();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        navigate('/login', { replace: true });
        return;
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user?.id) {
        navigate('/login', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: selectedFoods = [], isLoading } = useQuery({
    queryKey: ["daily-foods", format(date, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("daily_food_entries")
        .select("*")
        .eq("user_id", user.user.id)
        .eq("date", format(date, "yyyy-MM-dd"));

      if (error) throw error;

      return data.map((entry) => ({
        name: entry.food_name,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        servings: entry.servings,
      }));
    },
  });

  const addFood = async (food: Food) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to add foods",
        });
        return;
      }

      const { error } = await supabase.from("daily_food_entries").insert({
        user_id: user.user.id,
        date: format(date, "yyyy-MM-dd"),
        food_name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        servings: food.servings,
      });

      if (error) throw error;

      queryClient.invalidateQueries({
        queryKey: ["daily-foods", format(date, "yyyy-MM-dd")],
      });

      toast({
        title: "Food added",
        description: `Added ${food.name} to your daily intake`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add food. Please try again.",
      });
    }
  };

  const updateServings = async (index: number, newServings: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from("daily_food_entries")
        .select("id")
        .eq("user_id", user.user.id)
        .eq("date", format(date, "yyyy-MM-dd"));

      if (error) throw error;
      if (!data[index]) return;

      await supabase
        .from("daily_food_entries")
        .update({ servings: newServings })
        .eq("id", data[index].id);

      queryClient.invalidateQueries({
        queryKey: ["daily-foods", format(date, "yyyy-MM-dd")],
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update servings. Please try again.",
      });
    }
  };

  const removeFood = async (index: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from("daily_food_entries")
        .select("id")
        .eq("user_id", user.user.id)
        .eq("date", format(date, "yyyy-MM-dd"));

      if (error) throw error;
      if (!data[index]) return;

      await supabase
        .from("daily_food_entries")
        .delete()
        .eq("id", data[index].id);

      queryClient.invalidateQueries({
        queryKey: ["daily-foods", format(date, "yyyy-MM-dd")],
      });

      toast({
        title: "Food removed",
        description: "Food entry has been removed from your daily intake",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove food. Please try again.",
      });
    }
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
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>

            <CalendarStrip date={date} onSelect={setDate} />

            <div className="text-sm font-medium">
              Credits Left:{" "}
              <span className="text-primary">
                {isLoadingCredits ? "..." : `${credits}/30`}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Food Search</CardTitle>
            </CardHeader>
            <CardContent>
              <FoodSearch onAddFood={addFood} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Meal Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <AIMealGenerator />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Totals</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyCounter
                selectedFoods={selectedFoods}
                updateServings={updateServings}
                totals={totals}
                onRemoveFood={removeFood}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
