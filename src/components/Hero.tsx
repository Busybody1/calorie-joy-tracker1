import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-16 px-4 animate-fade-in bg-gradient-to-b from-white to-[#e8fbfd]">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          Effortless & 100% Free Calorie Tracking
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Access a massive database of 30 million+ foods, track your macros, and never pay a cent.
        </p>
        <div className="space-y-4 mb-12 text-left max-w-2xl mx-auto">
          {[
            'No Paid Plans: Use every feature without spending a dime.',
            '30 Million+ Foods: Quickly find and track practically anything you eat.',
            '1,100+ 5-Star Reviews: Loved and trusted by health enthusiasts worldwide.'
          ].map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 bg-white/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <p className="text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          Start Tracking For Free
        </Button>
      </div>
    </section>
  );
};

export default Hero;