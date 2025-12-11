// pages/portfolio.js

import { useState, useEffect } from 'react';

import Head from 'next/head';

import Header from '../components/Header';

import Footer from '../components/Footer';

import Button from '../components/ui/Button';



export default function Portfolio() {

  const [projects, setProjects] = useState([]);



  useEffect(() => {

    fetch('/api/portfolio/items')

      .then(res => res.json())

      .then(data => setProjects(data))

      .catch(err => console.error("Failed to load portfolio", err));

  }, []);



  return (

    <>

      <Head>

        <title>Portfolio — HenryMo Technologies</title>

        <meta name="description" content="View our latest digital projects and case studies." />

      </Head>



      <Header />



      <main className="container mx-auto px-4 py-16">

        <h1 className="text-4xl font-bold mb-4">Our Work</h1>

        <p className="text-xl mb-12">High-impact digital solutions for global clients.</p>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.length > 0 ? (

            projects.map(project => (

              <div key={project.id} className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow">

                {project.image && (

                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />

                )}

                <div className="p-5">

                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>

                  <p className="text-gray-600 mb-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">

                    {project.techStack?.map((tech, i) => (

                      <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">

                        {tech}

                      </span>

                    ))}

                  </div>

                  <div className="flex space-x-3">

                    {project.liveUrl && (

                      <Button size="sm" as="a" href={project.liveUrl} target="_blank">Live Demo</Button>

                    )}

                    {project.githubUrl && (

                      <Button size="sm" variant="outline" as="a" href={project.githubUrl} target="_blank">GitHub</Button>

                    )}

                  </div>

                </div>

              </div>

            ))

          ) : (

            <p className="col-span-full text-center text-gray-500">No projects yet. Add some from your admin dashboard.</p>

          )}

        </div>

      </main>



      <Footer />

    </>

  );

}
