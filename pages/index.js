// pages/index.js

import { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/ui/Button';

// Default content (fallback)
const defaultServices = [
  { title: "Website Development", description: "Modern, responsive websites with CMS & SEO.", price: "" },
  { title: "Mobile App Development", description: "iOS, Android & cross-platform apps.", price: "" },
  { title: "Custom Software Engineering", description: "Tailored enterprise solutions.", price: "" },
  { title: "Database Design & Management", description: "Secure, scalable data architecture.", price: "" },
  { title: "Cloud Deployment", description: "Hosting, CI/CD, and DevOps.", price: "" },
  { title: "Digital Automation", description: "Social media, workflows, and AI tools.", price: "" },
];

const defaultHero = {
  title: "We Build Powerful Digital Experiences for the Modern World.",
  subtitle: "Transform your vision into scalable, secure, and stunning digital products.",
  primaryButton: { text: "Hire Us", link: "/contact" },
  secondaryButton: { text: "View Services", link: "/services" },
};

const defaultWhy = {
  title: "Why Choose HenryMo Technologies?",
  description: "Full-stack expertise, affordable premium quality, and personalized support for global clients.",
  stats: [
    { value: "20+", label: "Global Clients" },
    { value: "100%", label: "Custom Solutions" },
    { value: "24/7", label: "Support" },
  ],
};

const defaultCta = {
  title: "Ready to build something amazing?",
  description: "Let's bring your project to life.",
  button: { text: "Get Started", link: "/contact" },
};

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [hero, setHero] = useState(defaultHero);
  const [services, setServices] = useState(defaultServices);
  const [whyChooseUs, setWhyChooseUs] = useState(defaultWhy);
  const [cta, setCta] = useState(defaultCta);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch testimonials
    fetch('/api/testimonials?featured=true')
      .then(res => res.json())
      .then(data => setTestimonials(data.slice(0, 3))) // Show max 3 featured
      .catch(err => console.error('Failed to load testimonials:', err));

    // Fetch homepage content
    fetch('/api/homepage')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch homepage content');
        }
        return res.json();
      })
      .then(data => {
        console.log('Homepage data received:', data); // Debug log
        
        // Update hero if available
        if (data.hero && (data.hero.title || data.hero.subtitle)) {
          setHero({
            title: data.hero.title || defaultHero.title,
            subtitle: data.hero.subtitle || defaultHero.subtitle,
            primaryButton: {
              text: data.hero.primaryButtonText || defaultHero.primaryButton.text,
              link: data.hero.primaryButtonLink || defaultHero.primaryButton.link,
            },
            secondaryButton: {
              text: data.hero.secondaryButtonText || defaultHero.secondaryButton.text,
              link: data.hero.secondaryButtonLink || defaultHero.secondaryButton.link,
            },
          });
        }

        // Update services - always use data from API if it's an array (even if empty)
        if (data.services && Array.isArray(data.services)) {
          if (data.services.length > 0) {
            setServices(data.services);
            console.log('Services updated from API:', data.services); // Debug log
          }
          // If services array is empty, keep defaults (don't override)
        }

        // Update Why Choose Us if available
        if (data.whyChooseUs && data.whyChooseUs.title) {
          setWhyChooseUs({
            title: data.whyChooseUs.title || defaultWhy.title,
            description: data.whyChooseUs.description || defaultWhy.description,
            stats: data.whyChooseUs.stats && data.whyChooseUs.stats.length > 0
              ? data.whyChooseUs.stats
              : defaultWhy.stats,
          });
        }

        // Update CTA if available
        if (data.cta && data.cta.title) {
          setCta({
            title: data.cta.title || defaultCta.title,
            description: data.cta.description || defaultCta.description,
            button: {
              text: data.cta.buttonText || defaultCta.button.text,
              link: data.cta.buttonLink || defaultCta.button.link,
            },
          });
        }
      })
      .catch(err => {
        console.error('Failed to load homepage content:', err);
        // Keep defaults
      })
      .finally(() => setLoading(false));
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
              {hero.title}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {hero.subtitle}
            </p>
            <div className="space-x-4">
              {hero.primaryButton.text && (
                <Button variant="gold" size="lg" href={hero.primaryButton.link}>
                  {hero.primaryButton.text}
                </Button>
              )}
              {hero.secondaryButton.text && (
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[#007BFF]" href={hero.secondaryButton.link}>
                  {hero.secondaryButton.text}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            {services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services
                  .filter(service => service && service.title && service.title.trim())
                  .map((service, i) => (
                    <ServiceCard 
                      key={i} 
                      title={service.title} 
                      description={service.description || ''} 
                      price={service.price || ''} 
                    />
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No services available</p>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{whyChooseUs.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {whyChooseUs.description}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {whyChooseUs.stats.map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow">
                  <div className={`font-bold text-2xl ${
                    i === 0 ? 'text-[#007BFF]' : i === 1 ? 'text-[#22C55E]' : 'text-[#FACC15]'
                  }`}>
                    {stat.value}
                  </div>
                  <div>{stat.label}</div>
                </div>
              ))}
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
          <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
          <p className="mb-6">{cta.description}</p>
          {cta.button.text && (
            <Button variant="gold" size="lg" as="a" href={cta.button.link}>
              {cta.button.text}
            </Button>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
