import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const now = new Date().toISOString();
      
      console.log('Starting verification process:', {
        email,
        code: otp,
        currentTime: now
      });

      // First, just check if the code exists for this email
      const { data: rawCode, error: rawError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('code', otp)
        .maybeSingle();

      console.log('Raw code check:', {
        code: rawCode,
        error: rawError
      });

      if (rawError) {
        console.error('Database error:', rawError);
        throw new Error('Error checking verification code');
      }

      if (!rawCode) {
        console.log('No code found for this email/code combination');
        throw new Error('Invalid verification code');
      }

      // Now check specific conditions
      console.log('Found code details:', {
        id: rawCode.id,
        email: rawCode.email,
        code: rawCode.code,
        used: rawCode.used,
        expiresAt: rawCode.expires_at,
        currentTime: now,
        isExpired: new Date(rawCode.expires_at) <= new Date(now)
      });

      if (rawCode.used) {
        console.log('Code already used');
        throw new Error('This code has already been used');
      }

      if (new Date(rawCode.expires_at) <= new Date(now)) {
        console.log('Code expired');
        throw new Error('This code has expired');
      }

      // If we get here, the code is valid. Mark it as used.
      console.log('Code is valid, marking as used');
      const { error: updateError } = await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', rawCode.id);

      if (updateError) {
        console.error('Error marking code as used:', updateError);
        throw new Error('Error completing verification');
      }

      console.log('Verification successful');
      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#e8fbfd] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-center">
            We've sent a code to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-8">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit code"
                className="text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;