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
    console.log('Starting login process...');
    const { email } = await req.json() as LoginRequest;
    console.log('Email received:', email);
    
    // Check Beehiiv subscription status
    console.log('Checking Beehiiv subscription...');
    const beehiivResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/pub_050c90b4-4ea8-4f89-a05b-f1c3256c5815/subscriptions/by_email/${email}`,
      {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('BEEHIIV_API_KEY')}`,
        },
      }
    );
    console.log('Beehiiv response status:', beehiivResponse.status);

    // If user is not subscribed (404), subscribe them
    if (beehiivResponse.status === 404) {
      console.log('User not subscribed, creating subscription...');
      const subscribeResponse = await fetch(
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
            utm_source: "calofree",
            utm_medium: "ads",
            utm_campaign: "busybits",
            referring_site: "www.freecaloriecounter.com/"
          }),
        }
      );
      console.log('Subscription creation response:', subscribeResponse.status);
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    console.log('Generated OTP:', otp);
    console.log('Expires at:', expiresAt.toISOString());

    // Initialize Supabase client
    console.log('Initializing Supabase client...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Store OTP in database - Using upsert to handle potential duplicates
    console.log('Storing OTP in database...');
    const { data: insertData, error: insertError } = await supabaseClient
      .from('otp_codes')
      .insert({
        email,
        code: otp,
        expires_at: expiresAt.toISOString(),
        used: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing OTP:', insertError);
      throw insertError;
    }

    console.log('OTP stored successfully:', insertData);

    // Send email with OTP via Mailgun
    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN = 'emailsearch.uk';

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.error('Mailgun configuration is missing');
      console.log(`OTP for ${email}: ${otp}`);
      return new Response(
        JSON.stringify({ message: 'OTP generated (check logs)' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    try {
      console.log('Sending email via Mailgun...');
      const mailgunResponse = await fetch(
        `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            from: `Calorie Joy <mailgun@${MAILGUN_DOMAIN}>`,
            to: email,
            subject: 'Your Login OTP Code',
            text: `Your one-time password (OTP) is: ${otp}. This code is valid for the next 5 minutes.`,
          }),
        }
      );

      if (!mailgunResponse.ok) {
        console.error('Mailgun error:', await mailgunResponse.text());
        throw new Error('Failed to send email');
      }
      
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      console.log(`OTP for ${email}: ${otp}`);
      return new Response(
        JSON.stringify({ message: 'OTP generated (check logs)' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    console.log('Login process completed successfully');
    return new Response(
      JSON.stringify({ message: 'OTP sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in login process:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});