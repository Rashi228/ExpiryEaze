import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-green-50 py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 mb-4">
            Save More. Waste Less. Make an Impact.
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8">
            Discover unbeatable discounts on near-expiry food and medicines while helping the planet.
          </p>
          <Link
            href="/join-waitlist"
            className="bg-green-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg hover:bg-green-700 transition duration-300"
          >
            Join the Waitlist Now
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            How ExpiryEaze Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Find Near-Expiry Products",
                description: "Browse surplus food and medicines at discounted rates.",
              },
              { title: "Verify and Purchase Safely", description: "All products verified for safety and quality." },
              { title: "Save Money & the Environment", description: "Enjoy affordable prices while reducing waste." },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Showcase Section */}
      <section className="w-full bg-gray-50 py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            Save Up to 50% on Essentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              { title: "Groceries", discount: "50% off", icon: "🍎" },
              { title: "Medicines", discount: "40% off", icon: "💊" },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 text-center">
                  <div className="text-5xl md:text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-green-600 font-bold text-xl md:text-2xl">{item.discount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="w-full py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-8 md:mb-12">
            Your Choices Matter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="bg-green-100 rounded-lg p-6">
              <p className="text-xl md:text-2xl font-bold text-green-600 mb-2">
                Every purchase saves 2 kg of food from waste
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-6">
              <p className="text-xl md:text-2xl font-bold text-green-600 mb-2">
                Join thousands reducing their carbon footprint
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-lg md:text-xl text-gray-600 italic">
              "ExpiryEaze has revolutionized the way I shop. I save money and feel good about reducing waste!"
            </p>
            <p className="mt-4 font-semibold">- Jane Doe, Happy User</p>
          </div>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section className="w-full bg-green-50 py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            Environmental Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-semibold mb-2">Reduced CO2 Emissions</h3>
              <p className="text-gray-600">By preventing food waste, we reduce methane emissions from landfills.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💧</div>
              <h3 className="text-xl font-semibold mb-2">Water Conservation</h3>
              <p className="text-gray-600">Reducing food waste means less water wasted in production and disposal.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌎</div>
              <h3 className="text-xl font-semibold mb-2">Sustainable Consumption</h3>
              <p className="text-gray-600">Promoting responsible consumption patterns for a healthier planet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="w-full py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            Community Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Supporting Local Businesses</h3>
              <p className="text-gray-600">
                By connecting consumers with local stores, we help support small businesses in your community.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Improving Food Access</h3>
              <p className="text-gray-600">
                Our platform helps make quality food more affordable, improving access for all community members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-gray-50 py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Emma Thompson",
                role: "Eco-conscious shopper",
                quote:
                  "ExpiryEaze has completely changed how I shop. I'm saving money and reducing waste at the same time!",
              },
              {
                name: "David Chen",
                role: "Local store owner",
                quote: "This platform has helped us connect with customers and reduce our food waste significantly.",
              },
              {
                name: "Sarah Johnson",
                role: "Student",
                quote:
                  "As a student on a budget, ExpiryEaze helps me eat well without breaking the bank. It's a win-win!",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="w-full py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            Our Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center">
            {[
              { name: "GreenGrocer", logo: "🥬" },
              { name: "EcoPharm", logo: "💊" },
              { name: "FreshMart", logo: "🍎" },
              { name: "NatureCare", logo: "🌿" },
            ].map((partner, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{partner.logo}</div>
                <p className="font-semibold">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-green-50 py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "How does ExpiryEaze ensure food safety?",
                answer:
                  "We work closely with our partners to ensure all products meet safety standards. Additionally, we provide clear expiration information for each item.",
              },
              {
                question: "Can I return items if I'm not satisfied?",
                answer:
                  "Due to the nature of near-expiry products, we generally don't accept returns. However, if you receive a damaged or unsafe product, please contact us immediately.",
              },
              {
                question: "How do I know if a product is still safe to consume?",
                answer:
                  "We provide clear expiration dates and storage instructions for all products. Always use your best judgment and follow food safety guidelines.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Now Section */}
      <section className="w-full bg-green-100 py-8 md:py-12 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-8 md:mb-12">
            Be the First to Make an Impact
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8">
            Join our waitlist today and be part of the solution for a sustainable future.
          </p>
          <Link
            href="/join-waitlist"
            className="bg-green-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg hover:bg-green-700 transition duration-300"
          >
            Join the Waitlist Now
          </Link>
        </div>
      </section>
    </div>
  )
}

