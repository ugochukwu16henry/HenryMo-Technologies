// pages/about.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Default content (fallback)
const defaultContent = {
  intro: {
    title: "About HenryMo Technologies",
    paragraph1: "HenryMo Technologies is a full-stack digital solutions company dedicated to helping businesses grow through innovation, design, and advanced technology.",
    paragraph2: "We create websites, mobile apps, enterprise software, and automated systems that are fast, secure, and built to scale. Our mission is simple: turn your ideas into real, high-impact digital solutions.",
  },
  vision: {
    title: "Our Vision",
    content: "To become a leading African-to-global technology powerhouse, offering advanced digital products and automation tools for businesses worldwide.",
  },
  mission: {
    title: "Our Mission",
    content: "To empower businesses and individuals with world-class technology solutions that boost efficiency, growth, and digital transformation.",
  },
  team: {
    name: "Henry M. Ugochukwu",
    role: "Founder & CEO",
    bio: "With years of experience in software development and digital transformation, Henry leads our team in creating innovative solutions that make a difference for businesses worldwide.",
    photo: "/images/henrypassportnew.jpg",
  },
  techStack: ["React", "Vue", "Node.js", "Django", "Flutter", "MySQL", "PostgreSQL", "MongoDB", "REST APIs"],
};

export default function About() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setContent({
          intro: data.intro || defaultContent.intro,
          vision: data.vision || defaultContent.vision,
          mission: data.mission || defaultContent.mission,
          team: data.team || defaultContent.team,
          techStack: data.techStack || defaultContent.techStack,
        });
      })
      .catch(err => {
        console.error('Failed to load about page content:', err);
        // Keep defaults
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>About Us — HenryMo Technologies</title>
        <meta name="description" content="Learn about our mission, vision, and team." />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-8">{content.intro.title}</h1>
            
            <div className="max-w-3xl mb-12">
              <p className="text-lg mb-6">{content.intro.paragraph1}</p>
              <p className="text-lg">{content.intro.paragraph2}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">{content.vision.title}</h2>
                <p>{content.vision.content}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">{content.mission.title}</h2>
                <p>{content.mission.content}</p>
              </div>
            </div>

            {/* Team Section */}
            {content.team && content.team.name && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Our Team</h2>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0 relative">
                    {content.team.photo ? (
                      <img
                        src={content.team.photo}
                        alt={content.team.name}
                        className="w-48 h-48 rounded-full object-cover border-4 border-[#007BFF]"
                        onError={(e) => {
                          // Try alternative image paths
                          const alternatives = [
                            '/images/henry-profile.jpg',
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
                    ) : null}
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#007BFF] to-[#22C55E] flex items-center justify-center text-white text-4xl font-bold" style={{ display: content.team.photo ? 'none' : 'flex' }}>
                      {content.team.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'HMU'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{content.team.name}</h3>
                    {content.team.role && (
                      <p className="text-[#007BFF] font-semibold mb-4">{content.team.role}</p>
                    )}
                    {content.team.bio && (
                      <p className="text-gray-700">{content.team.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {content.techStack && content.techStack.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {content.techStack.map((tech, i) => (
                    <span key={i} className="bg-[#007BFF] text-white px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
