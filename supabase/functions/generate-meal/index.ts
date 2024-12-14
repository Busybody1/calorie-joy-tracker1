import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences } = await req.json();

    const prompt = `
Dietary Preference: ${preferences.diet}
Max Calories Limit: ${preferences.maxCalories} kcal
Food Preferences: ${preferences.foodPreferences}
Foods to Avoid: ${preferences.foodsToAvoid}
What Macro to Focus On: ${preferences.macroFocus}
Max Budget per Meal: $${preferences.maxBudget}

Carbohydrates provide 4 calories per gram
Protein provides 4 calories per gram
Fat provides 9 calories per gram
Ensure the total calories match exactly the sum of all macros (no rounding, no ranges).
Use USDA FoodData Central information for calorie and nutrient data.
No warnings or health disclaimers. Be concise, simple, and direct. 5th to 7th-grade reading level.
Do not use any markup (no bold, no BBCode, no headings) other than a dash (-) for bullet points.
No extra fluff, just provide the meal directly.

The response should follow this format exactly:

Here is your meal. I hope you enjoy it.

[Name of the Dish],
Servings Per Recipe: [Number of Servings],
Serving Amount: [Serving Value] [Serving Units]
Calories per Serving: [Exact Calories per Serving in kcal]
Protein per Serving: [Protein in grams]
Carbs per Serving: [Carbohydrates in grams]
Fats per Serving: [Fats in grams]

Ingredients: [List each ingredient with quantity in grams and also specify counts, e.g., 2 peppers (20g)],

Instructions: [Step-by-step instructions to prepare the meal]

Constraints:
- Must adhere to ${preferences.diet} if specified
- Must not exceed ${preferences.maxCalories} kcal per serving
- Exclude foods in the list: ${preferences.foodsToAvoid}
- Include ${preferences.foodPreferences} if possible
- Focus on ${preferences.macroFocus} as the key macro
- Stay under $${preferences.maxBudget}
- Sum of macros must match total calories exactly, no approximations
`;

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 7999,
        temperature: 1.2,
      }),
    });

    const data = await response.json();
    const generatedMeal = data.choices[0].message.content;

    return new Response(JSON.stringify({ generatedMeal }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-meal function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});