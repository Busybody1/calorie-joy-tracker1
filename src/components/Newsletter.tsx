import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://api.beehiiv.com/v2/publications/pub_050c90b4-4ea8-4f89-a05b-f1c3256c5815/subscriptions", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: false,
          utm_source: "CaloFree Ad",
          utm_medium: "Ad",
          utm_campaign: "BusyBits Subs",
          referring_site: "www.calofree-counter.com",
          custom_fields: [
            {
              name: "First Name",
              value: firstName
            },
            {
              name: "Last Name", 
              value: lastName
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      toast({
        title: "Success!",
        description: "You've been successfully subscribed to our newsletter.",
      });
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#e8fbfd] to-white">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          Get More Out of Your Health Journey
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Subscribe to our newsletter and receive quick, actionable tips and tricks to help you eat better, feel better, and get more out of every meal.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="First Name (Optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-full border-gray-200 focus:border-primary focus:ring-primary"
          />
          <Input
            type="text"
            placeholder="Last Name (Optional)"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-full border-gray-200 focus:border-primary focus:ring-primary"
          />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-full border-gray-200 focus:border-primary focus:ring-primary"
          />
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white whitespace-nowrap rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            {isLoading ? "Joining..." : "Join Now (It's Free)"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;