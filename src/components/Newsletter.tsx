import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#e8fbfd] to-white">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          Get More Out of Your Health Journey
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Subscribe to our newsletter and receive quick, actionable tips and tricks to help you eat better, feel better, and get more out of every meal.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-full border-gray-200 focus:border-primary focus:ring-primary"
          />
          <Button className="bg-primary hover:bg-primary/90 text-white whitespace-nowrap rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            Join Now (It's Free)
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;