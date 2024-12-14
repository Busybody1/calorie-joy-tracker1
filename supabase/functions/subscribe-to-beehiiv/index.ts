import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, ...subscriptionData } = await req.json();
    
    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_050c90b4-4ea8-4f89-a05b-f1c3256c5815/subscriptions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('BEEHIIV_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          ...subscriptionData
        }),
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});