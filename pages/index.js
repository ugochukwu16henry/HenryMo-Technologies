// pages/index.js

import Head from 'next/head';
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
  return (
    <>
      <Head>
        <title>HenryMo Technologies — Where Ideas Become Powerful Digital Solutions</title>
        <meta name="description" content="We build powerful digital experiences for the modern world." />
      </Head>

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
