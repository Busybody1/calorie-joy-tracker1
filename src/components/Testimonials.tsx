import { Star } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#e8fbfd]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              text: "I finally found a free tool that actually works and isn't upselling me.",
              author: "Sarah Z."
            },
            {
              text: "Huge food database, no hidden fees, super simple to use.",
              author: "Marcus L."
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex text-primary mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 text-lg">"{testimonial.text}"</p>
              <p className="text-gray-500 font-medium">– {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;