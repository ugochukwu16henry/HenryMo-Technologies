// pages/about.js

import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us — HenryMo Technologies</title>
        <meta name="description" content="Learn about our mission, vision, and team." />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">About HenryMo Technologies</h1>
        
        <div className="max-w-3xl mb-12">
          <p className="text-lg mb-6">
            HenryMo Technologies is a full-stack digital solutions company dedicated to helping businesses grow through innovation, design, and advanced technology.
          </p>
          <p className="text-lg">
            We create websites, mobile apps, enterprise software, and automated systems that are fast, secure, and built to scale. Our mission is simple: turn your ideas into real, high-impact digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p>To become a leading African-to-global technology powerhouse, offering advanced digital products and automation tools for businesses worldwide.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p>To empower businesses and individuals with world-class technology solutions that boost efficiency, growth, and digital transformation.</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0 relative">
              <img
                src="/images/henry-profile.jpg"
                alt="Henry Kolawole"
                className="w-48 h-48 rounded-full object-cover border-4 border-[#007BFF]"
                onError={(e) => {
                  // Try alternative image paths
                  const alternatives = [
                    '/images/henry-profile.png',
                    '/images/henry.jpg',
                    '/images/henry.png',
                    '/images/profile.jpg',
                    '/images/profile.png',
                    '/images/Henrymo logo.png'
                  ];
                  let currentIndex = alternatives.indexOf(e.target.src.replace(window.location.origin, ''));
                  if (currentIndex === -1) currentIndex = 0;
                  
                  if (currentIndex < alternatives.length - 1) {
                    e.target.src = alternatives[currentIndex + 1];
                  } else {
                    // Final fallback - show initials
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }
                }}
              />
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#007BFF] to-[#22C55E] flex items-center justify-center text-white text-4xl font-bold" style={{ display: 'none' }}>
                HK
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Henry Kolawole</h3>
              <p className="text-[#007BFF] font-semibold mb-4">Founder & CEO</p>
              <p className="text-gray-700">
                With years of experience in software development and digital transformation, 
                Henry leads our team in creating innovative solutions that make a difference 
                for businesses worldwide.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
          <div className="flex flex-wrap gap-2">
            {['React', 'Vue', 'Node.js', 'Django', 'Flutter', 'MySQL', 'PostgreSQL', 'MongoDB', 'REST APIs'].map((tech, i) => (
              <span key={i} className="bg-[#007BFF] text-white px-3 py-1 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
