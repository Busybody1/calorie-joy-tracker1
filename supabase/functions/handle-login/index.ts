import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

interface LoginRequest {
  email: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json() as LoginRequest;
    
    // Check Beehiiv subscription status
    const beehiivResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/pub_050c90b4-4ea8-4f89-a05b-f1c3256c5815/subscriptions/by_email/${email}`,
      {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('BEEHIIV_API_KEY')}`,
        },
      }
    );

    // If user is not subscribed (404), subscribe them
    if (beehiivResponse.status === 404) {
      await fetch(
        'https://api.beehiiv.com/v2/publications/pub_050c90b4-4ea8-4f89-a05b-f1c3256c5815/subscriptions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('BEEHIIV_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            reactivate_existing: false,
            send_welcome_email: false,
            utm_source: 'CaloFree Ad',
            utm_medium: 'Ad',
            utm_campaign: 'BusyBits Subs',
            referring_site: 'www.calofree-counter.com',
          }),
        }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store OTP in database
    await supabaseClient
      .from('otp_codes')
      .insert({
        email,
        code: otp,
        expires_at: expiresAt.toISOString(),
      });

    // Send email with OTP (for now, just console.log it)
    console.log(`OTP for ${email}: ${otp}`);

    return new Response(
      JSON.stringify({ message: 'OTP sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});