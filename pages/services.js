// pages/services.js

import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/ui/Section';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/ui/Button';
import Link from 'next/link';

export default function Services() {
  const services = [
    {
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies and best practices.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      features: [
        'React & Next.js Development',
        'Responsive Design',
        'Performance Optimization',
        'SEO Best Practices',
      ],
    },
    {
      title: 'API Development',
      description: 'Robust RESTful APIs and backend services for your applications.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      features: [
        'RESTful API Design',
        'Database Integration',
        'Authentication & Security',
        'API Documentation',
      ],
    },
    {
      title: 'Mobile Development',
      description: 'Cross-platform mobile applications for iOS and Android.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      features: [
        'React Native Development',
        'Native Performance',
        'App Store Deployment',
        'Push Notifications',
      ],
    },
    {
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment solutions.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      features: [
        'AWS & Azure Setup',
        'CI/CD Pipelines',
        'Scalable Architecture',
        'Monitoring & Logging',
      ],
    },
    {
      title: 'Digital Marketing',
      description: 'Social media management and automated posting solutions.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      features: [
        'Social Media Automation',
        'Content Scheduling',
        'Analytics & Reporting',
        'Multi-Platform Support',
      ],
    },
    {
      title: 'Consulting',
      description: 'Expert guidance on technology strategy and digital transformation.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      features: [
        'Technology Strategy',
        'Architecture Review',
        'Code Audits',
        'Team Training',
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Services - HenryMo Technologies</title>
        <meta name="description" content="Comprehensive digital solutions including web development, API development, mobile apps, and cloud services." />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <Section background="indigo" padding="xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Services
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
              Comprehensive digital solutions to transform your business
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
            </Link>
          </div>
        </Section>

        {/* Services Grid */}
        <Section padding="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                features={service.features}
              />
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <Section background="gray" padding="lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Let's discuss how we can help bring your ideas to life.
            </p>
            <Link href="/contact">
              <Button size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}

