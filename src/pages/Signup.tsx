import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!email || !password || !name) {
        throw new Error("Please fill in all fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Attempt to create account
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Set session duration to 30 days
        await supabase.auth.updateUser({
          data: { session_duration: 30 * 24 * 60 * 60 } // 30 days in seconds
        });

        navigate("/dashboard");
        toast({
          title: "Success!",
          description: "Your account has been created. Welcome!",
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
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
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to sign up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>
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
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
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

export default Signup;