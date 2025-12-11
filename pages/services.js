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
      title: 'Website Development',
      description: 'Custom web applications built with modern technologies and best practices. We create responsive, performant websites that deliver exceptional user experiences.',
    },
    {
      title: 'Mobile App Development',
      description: 'Cross-platform mobile applications for iOS and Android. Build native-feeling apps with React Native that work seamlessly across all devices.',
    },
    {
      title: 'Custom Software Engineering',
      description: 'Tailored software solutions designed specifically for your business needs. From concept to deployment, we build scalable applications that grow with you.',
    },
    {
      title: 'Database Design & Management',
      description: 'Robust database architectures and management solutions. We design efficient data structures and implement secure, scalable database systems.',
    },
    {
      title: 'Cloud Deployment',
      description: 'Scalable cloud infrastructure and deployment solutions. Deploy your applications on AWS, Azure, or other cloud platforms with CI/CD pipelines.',
    },
    {
      title: 'Digital Automation',
      description: 'Automate your digital workflows and social media management. Schedule posts, manage content, and streamline your digital operations.',
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

