// pages/index.js

import { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/ui/Button';

const services = [
  { title: "Website Development", description: "Modern, responsive websites with CMS & SEO." },
  { title: "Mobile App Development", description: "iOS, Android & cross-platform apps." },
  { title: "Custom Software Engineering", description: "Tailored enterprise solutions." },
  { title: "Database Design & Management", description: "Secure, scalable data architecture." },
  { title: "Cloud Deployment", description: "Hosting, CI/CD, and DevOps." },
  { title: "Digital Automation", description: "Social media, workflows, and AI tools." },
];

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch('/api/testimonials?featured=true')
      .then(res => res.json())
      .then(data => setTestimonials(data.slice(0, 3))) // Show max 3 featured
      .catch(err => console.error('Failed to load testimonials:', err));
  }, []);

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex text-yellow-400 mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <>
      <NextSeo
        title="We Build Powerful Digital Experiences for the Modern World"
        description="HenryMo Technologies creates modern websites, mobile apps, and custom software for global businesses. Affordable, scalable, and secure."
        openGraph={{
          title: 'HenryMo Technologies — Digital Solutions for a Smarter Future',
          description: 'Full-stack development, cloud deployment, and social automation for startups and enterprises.',
          images: [{ url: '/images/og-home.jpg' }],
        }}
      />

      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-[#007BFF] to-[#22C55E] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              We Build Powerful Digital Experiences for the Modern World.
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Transform your vision into scalable, secure, and stunning digital products.
            </p>
            <div className="space-x-4">
              <Button variant="gold" size="lg" href="/contact">Hire Us</Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[#007BFF]" href="/services">View Services</Button>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <ServiceCard key={i} title={service.title} description={service.description} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose HenryMo Technologies?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Full-stack expertise, affordable premium quality, and personalized support for global clients.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-[#007BFF] font-bold text-2xl">20+</div>
                <div>Global Clients</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-[#22C55E] font-bold text-2xl">100%</div>
                <div>Custom Solutions</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-[#FACC15] font-bold text-2xl">24/7</div>
                <div>Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                    {renderStars(testimonial.rating)}
                    <p className="text-gray-700 mb-4 italic">"{testimonial.testimonial}"</p>
                    <div className="flex items-center">
                      {testimonial.photo ? (
                        <img
                          src={testimonial.photo}
                          alt={testimonial.clientName}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold mr-4">
                          {testimonial.clientName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.clientName}</div>
                        {testimonial.position && (
                          <div className="text-sm text-gray-600">{testimonial.position}</div>
                        )}
                        {testimonial.company && (
                          <div className="text-sm text-gray-500">{testimonial.company}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-[#111827] text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build something amazing?</h2>
          <p className="mb-6">Let's bring your project to life.</p>
          <Button variant="gold" size="lg" as="a" href="/contact">Get Started</Button>
        </section>
      </main>

      <Footer />
    </>
  );
}
