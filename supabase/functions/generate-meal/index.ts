import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences } = await req.json();
    console.log('Received preferences:', preferences);

    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set');
    }

    const messages = [
      {
        role: "system",
        content: `# Construct the prompt according to the instructions:
# Insert the user-provided dietary preference, max calorie limit, food preferences, foods to avoid, macro focus, and budget into the prompt.
# Follow all formatting and content rules:
# - No markup other than dashes for bullet points
# - Must adhere to dietary preferences, max calories, etc.
# - Carbs: 4 kcal/g, Protein: 4 kcal/g, Fat: 9 kcal/g
# - Total calories must add up exactly
# - Use no ranges, only exact values
# - Include instructions and the final recipe format

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
- Must adhere to ${preferences.diet} if specified.
- Must not exceed ${preferences.maxCalories} per serving.
- Exclude foods in the list: ${preferences.foodsToAvoid}
- Include ${preferences.foodPreferences} if possible.
- Focus on ${preferences.macroFocus} as the key macro if applicable.
- Stay under $${preferences.maxBudget}.
- Sum of macros must match total calories exactly, no approximations.`
      }
    ];

    console.log('Sending request to Groq API with messages:', messages);

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        max_tokens: 7999,
        temperature: 1.2,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', errorData);
      throw new Error(`Groq API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Groq API response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format from Groq API:', data);
      throw new Error('Invalid response format from Groq API');
    }

    const generatedMeal = data.choices[0].message.content;
    console.log('Generated meal:', generatedMeal);

    return new Response(
      JSON.stringify({ generatedMeal }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-meal function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while generating the meal'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});