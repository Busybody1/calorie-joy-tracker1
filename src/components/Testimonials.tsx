const Testimonials = () => {
  return (
    <section className="py-16">
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
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-primary mb-2">★ ★ ★ ★ ★</div>
              <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
              <p className="text-gray-500">– {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;