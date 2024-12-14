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
      // Get the most recent valid OTP for this email
      const { data: otpData, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('OTP Verification:', {
        enteredCode: otp,
        dbResponse: otpData,
        error: otpError
      });

      if (otpError) {
        throw otpError;
      }

      if (!otpData) {
        toast({
          title: "Code Expired",
          description: "Please request a new verification code.",
          variant: "destructive",
        });
        return;
      }

      // Compare the entered OTP with the one from database
      if (otpData.code !== otp.trim()) {
        toast({
          title: "Invalid Code",
          description: "The code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
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

      // Success! Navigate to dashboard
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