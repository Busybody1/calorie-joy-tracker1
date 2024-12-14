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
      
      // Log the exact format of input code
      console.log('Input code details:', {
        code: otp,
        type: typeof otp,
        length: otp.length,
        trimmedLength: otp.trim().length
      });

      // First, check if there's a valid code
      const { data: otpData, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('code', otp.trim())
        .eq('used', false)
        .gt('expires_at', now)
        .maybeSingle();

      // Log the exact query and response
      console.log('Database query:', {
        email: email,
        code: otp.trim(),
        currentTime: now
      });

      console.log('Database response:', {
        data: otpData,
        error: otpError
      });

      if (otpError) {
        throw otpError;
      }

      if (!otpData) {
        // Check specifically why the code is invalid
        const { data: existingCode } = await supabase
          .from('otp_codes')
          .select('*')
          .eq('email', email)
          .eq('code', otp.trim())
          .maybeSingle();

        console.log('Existing code details:', existingCode);

        if (existingCode) {
          if (existingCode.used) {
            toast({
              title: "Code Already Used",
              description: "This code has already been used. Please request a new verification code.",
              variant: "destructive",
            });
          } else if (new Date(existingCode.expires_at) <= new Date()) {
            toast({
              title: "Code Expired",
              description: "This code has expired. Please request a new verification code.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Invalid Code",
            description: "Please check the code and try again, or request a new one.",
            variant: "destructive",
          });
        }
        return;
      }

      // Mark OTP as used
      const { error: updateError } = await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpData.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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