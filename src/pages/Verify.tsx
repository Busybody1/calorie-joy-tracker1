import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Verify = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Starting verification process:", {
        email,
        code,
        currentTime: new Date().toISOString(),
      });

      // First verify the OTP code
      const { data: codeCheck, error: codeError } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("used", false)
        .single();

      console.log("Raw code check:", { code: codeCheck, error: codeError });

      if (codeError || !codeCheck) {
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: "Please check your code and try again.",
        });
        return;
      }

      const now = new Date();
      const expiresAt = new Date(codeCheck.expires_at);

      if (now > expiresAt) {
        toast({
          variant: "destructive",
          title: "Code expired",
          description: "Please request a new code.",
        });
        return;
      }

      console.log("Code is valid, marking as used");

      // Mark the OTP as used
      await supabase
        .from("otp_codes")
        .update({ used: true })
        .eq("id", codeCheck.id);

      // Generate a random password for the user
      const password = Math.random().toString(36).slice(-12);

      // Try to sign up first
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirmed_at: new Date().toISOString(),
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          // User exists, update their password using admin API
          const { error: updateError } = await supabase.functions.invoke('update-user-password', {
            body: { email, password }
          });

          if (updateError) {
            console.error("Error updating password:", updateError);
            throw updateError;
          }

          // Now try to sign in with the new password
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            console.error("Error signing in:", signInError);
            throw signInError;
          }

          console.log("Sign in successful:", signInData);
        } else {
          console.error("Error signing up:", signUpError);
          throw signUpError;
        }
      } else {
        console.log("Sign up successful:", signUpData);
      }

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });

      toast({
        title: "Verification successful",
        description: "You are now logged in.",
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#e8fbfd] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-center">
            We sent a code to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
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