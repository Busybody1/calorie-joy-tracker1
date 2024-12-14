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
      
      // Log input validation
      console.log('Input validation:', {
        email,
        inputCode: otp,
        codeLength: otp.length,
        codeType: typeof otp,
        trimmedLength: otp.trim().length,
        currentTime: now
      });

      // First, check if the code exists without additional conditions
      console.log('Executing database query with parameters:', {
        email,
        code: otp,
        queryTime: new Date().toISOString()
      });

      const { data: otpData, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('code', otp)
        .maybeSingle();

      console.log('Full database response:', {
        data: otpData,
        error: otpError?.message,
        errorDetails: otpError
      });

      // If we got data, log its details
      if (otpData) {
        console.log('OTP record found:', {
          storedCode: otpData.code,
          storedEmail: otpData.email,
          isUsed: otpData.used,
          expiresAt: otpData.expires_at,
          isExpired: new Date(otpData.expires_at) <= new Date(),
          currentTime: new Date().toISOString()
        });
      } else {
        console.log('No OTP record found with these parameters');
        
        // Additional check to see if there are any codes for this email
        const { data: allCodes } = await supabase
          .from('otp_codes')
          .select('*')
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(5);
        
        console.log('Recent codes for this email:', allCodes);
      }

      if (otpError) {
        throw otpError;
      }

      if (!otpData) {
        throw new Error('Invalid verification code');
      }

      // Now check the code's validity
      if (otpData.used) {
        throw new Error('This code has already been used');
      }

      if (new Date(otpData.expires_at) <= new Date()) {
        throw new Error('This code has expired');
      }

      // Mark OTP as used
      const { error: updateError } = await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpData.id);

      if (updateError) {
        console.error('Error marking OTP as used:', updateError);
        throw updateError;
      }

      console.log('Verification successful, OTP marked as used');

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