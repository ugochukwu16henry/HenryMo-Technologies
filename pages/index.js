// pages/index.js

import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import ServiceCard from '../components/ServiceCard';
import TestimonialSlider from '../components/TestimonialSlider';

export default function Home() {
  const featuredServices = [
    {
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      features: ['React & Next.js', 'Responsive Design', 'Performance Optimization'],
    },
    {
      title: 'API Development',
      description: 'Robust RESTful APIs and backend services.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      features: ['RESTful APIs', 'Database Integration', 'Authentication'],
    },
    {
      title: 'Digital Solutions',
      description: 'Comprehensive digital transformation services.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: ['Cloud Solutions', 'Mobile Apps', 'Social Media Automation'],
    },
  ];

  return (
    <>
      <Head>
        <title>HenryMo Technologies - Where Ideas Become Powerful Digital Solutions</title>
        <meta name="description" content="Transform your ideas into powerful digital solutions with HenryMo Technologies. Web development, API development, and comprehensive digital services." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <Section background="indigo" padding="xl">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Where Ideas Become
              <br />
              <span className="text-indigo-200">Powerful Digital Solutions</span>
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              We transform innovative ideas into cutting-edge digital solutions that drive 
              business growth and create exceptional user experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Get Started
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="bg-white text-indigo-600 hover:bg-indigo-50">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>
        </Section>

        {/* Services Preview */}
        <Section padding="xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                features={service.features}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services">
              <Button variant="outline">
                View All Services
              </Button>
            </Link>
          </div>
        </Section>

        {/* Testimonials */}
        <Section background="gray" padding="xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by businesses worldwide
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <TestimonialSlider />
          </div>
        </Section>

        {/* CTA Section */}
        <Section padding="lg">
          <div className="text-center bg-indigo-600 rounded-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help bring your ideas to life and create 
              powerful digital solutions for your business.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Contact Us Today
              </Button>
            </Link>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
