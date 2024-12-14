import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkSubscriptionStatus = async (email: string) => {
    try {
      const response = await fetch(
        `https://api.beehiiv.com/v2/publications/pub_050c90b4-4ea8-4f89-a05b-f1c3256c5815/subscriptions/by_email/${email}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
          },
        }
      );

      if (response.status === 404) {
        // User not subscribed, let's subscribe them
        await subscribeUser(email);
      }
      
      return true;
    } catch (error) {
      console.error("Error checking subscription:", error);
      return false;
    }
  };

  const subscribeUser = async (email: string) => {
    try {
      await fetch(
        "https://api.beehiiv.com/v2/publications/pub_050c90b4-4ea8-4f89-a05b-f1c3256c5815/subscriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            reactivate_existing: false,
            send_welcome_email: false,
            utm_source: "CaloFree Ad",
            utm_medium: "Ad",
            utm_campaign: "BusyBits Subs",
            referring_site: "www.calofree-counter.com",
          }),
        }
      );
    } catch (error) {
      console.error("Error subscribing user:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const subscriptionChecked = await checkSubscriptionStatus(email);
      
      if (subscriptionChecked) {
        // Generate OTP and store it (we'll implement this in the next step)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Store OTP in localStorage temporarily (in production, use a proper backend)
        localStorage.setItem(`otp_${email}`, JSON.stringify({
          code: otp,
          expires: Date.now() + 5 * 60 * 1000 // 5 minutes expiration
        }));
        
        // Navigate to OTP verification page
        navigate("/verify", { state: { email } });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#e8fbfd] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to login or create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Continue with Email"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;