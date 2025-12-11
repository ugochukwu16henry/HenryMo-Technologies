// pages/portfolio.js

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/ui/Section';
import ProjectCard from '../components/ProjectCard';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects from API
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to default projects if API fails
        setProjects([
          {
            id: 1,
            title: 'E-Commerce Platform',
            description: 'A full-featured e-commerce platform built with React and Node.js',
            image: 'https://via.placeholder.com/800x600',
            techStack: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com/example',
          },
          {
            id: 2,
            title: 'Social Media Dashboard',
            description: 'Comprehensive dashboard for managing multiple social media accounts',
            image: 'https://via.placeholder.com/800x600',
            techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com/example',
          },
          {
            id: 3,
            title: 'Mobile Banking App',
            description: 'Secure mobile banking application with real-time transactions',
            image: 'https://via.placeholder.com/800x600',
            techStack: ['React Native', 'Node.js', 'MongoDB', 'AWS'],
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com/example',
          },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Portfolio - HenryMo Technologies</title>
        <meta name="description" content="Explore our portfolio of successful projects and digital solutions." />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <Section background="indigo" padding="xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Portfolio
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Showcasing our successful projects and digital solutions
            </p>
          </div>
        </Section>

        {/* Projects Grid */}
        <Section padding="xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  techStack={project.techStack}
                  liveUrl={project.liveUrl}
                  githubUrl={project.githubUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects found.</p>
            </div>
          )}
        </Section>
      </main>

      <Footer />
    </>
  );
}

