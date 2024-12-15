import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-16 px-4 animate-fade-in bg-gradient-to-b from-white to-[#e8fbfd]">
      <div className="container mx-auto max-w-7xl">
        {/* Centered Headline */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            Effortless & 100% Free Calorie Tracking
          </h1>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg 
              hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0.5
              active:shadow-md transform-gpu"
            onClick={() => navigate("/login")}
          >
            Start Tracking For Free
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Access a massive database of 30 million+ foods, track your macros, and never pay a cent.
            </p>
            <div className="space-y-4">
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
          </div>

          {/* Right Floating Container */}
          <div className="relative h-[500px] w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[90%] h-[90%] bg-white rounded-2xl shadow-2xl p-6 
                animate-floating transform-gpu
                hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-500
                before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br 
                before:from-primary/10 before:to-transparent before:rounded-2xl before:opacity-50">
                <div className="relative h-full w-full rounded-xl overflow-hidden">
                  <img 
                    src="/placeholder.svg"
                    alt="Person tracking calories" 
                    className="object-cover h-full w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;