// pages/about.js

import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - HenryMo Technologies</title>
        <meta name="description" content="Learn about HenryMo Technologies and our mission to transform ideas into powerful digital solutions." />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <Section background="indigo" padding="xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About HenryMo Technologies
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Where Ideas Become Powerful Digital Solutions
            </p>
          </div>
        </Section>

        {/* Mission Section */}
        <Section padding="xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4">
              At HenryMo Technologies, we are passionate about transforming innovative ideas into 
              powerful digital solutions that drive business growth and create exceptional user experiences.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              We combine cutting-edge technology with creative problem-solving to deliver solutions 
              that not only meet but exceed our clients' expectations.
            </p>
          </div>
        </Section>

        {/* Values Section */}
        <Section background="gray" padding="xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We stay at the forefront of technology, constantly exploring new tools and 
                methodologies to deliver cutting-edge solutions.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We are committed to delivering the highest quality work, paying attention to 
                every detail and ensuring client satisfaction.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Partnership</h3>
              <p className="text-gray-600">
                We build long-term relationships with our clients, working collaboratively to 
                achieve their business goals.
              </p>
            </Card>
          </div>
        </Section>

        {/* Team Section */}
        <Section padding="xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <div className="text-center">
                <div className="w-32 h-32 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-indigo-600">HK</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Henry Kolawole</h3>
                <p className="text-indigo-600 mb-4">Founder & CEO</p>
                <p className="text-gray-600">
                  With years of experience in software development and digital transformation, 
                  Henry leads our team in creating innovative solutions that make a difference.
                </p>
              </div>
            </Card>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}

