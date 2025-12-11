// pages/services.js

import Head from 'next/head';

import Header from '../components/Header';

import Footer from '../components/Footer';

import Button from '../components/ui/Button';



const serviceData = [

  {

    title: "Website Development",

    description: "From corporate sites to e-commerce stores.",

    features: ["Responsive Design", "Custom CMS", "SEO Optimized", "Booking Systems"],

    pricing: "$200 – $5000"

  },

  {

    title: "Mobile App Development",

    description: "iOS, Android, and cross-platform apps.",

    features: ["Flutter/React Native", "Push Notifications", "Offline Support", "App Store Deployment"],

    pricing: "$800 – $15,000"

  },

  {

    title: "Custom Software Engineering",

    description: "Tailored enterprise solutions.",

    features: ["CRM/ERP", "Inventory Systems", "HR Tools", "Internal Dashboards"],

    pricing: "$1000 – $50,000+"

  },

  {

    title: "Database Design & Management",

    description: "Secure, scalable data architecture.",

    features: ["MySQL, PostgreSQL, MongoDB", "Optimization", "Backup & Recovery", "Cloud Hosting"],

    pricing: "$150 – $200/month"

  },

  {

    title: "API Development",

    description: "Custom integrations and RESTful services.",

    features: ["Authentication", "Third-Party Integrations", "Documentation", "Rate Limiting"],

    pricing: "Custom Quote"

  },

  {

    title: "Social Media Automation",

    description: "Centralized dashboard for all platforms.",

    features: ["Post Scheduling", "Analytics", "AI Content", "Multi-Account"],

    pricing: "$100 – $500/month"

  },

  {

    title: "IT Consulting",

    description: "Digital transformation strategy.",

    features: ["Tech Audits", "System Setup", "Software Recommendations", "Ongoing Support"],

    pricing: "Hourly or Project-Based"

  },

  {

    title: "Branding & Digital Identity",

    description: "Logo, UI/UX, and content strategy.",

    features: ["Logo Design", "Brand Guidelines", "Portfolio Sites", "Personal Branding"],

    pricing: "$300 – $2000"

  }

];



export default function Services() {

  return (

    <>

      <Head>

        <title>Our Services — HenryMo Technologies</title>

        <meta name="description" content="Website, mobile, software, database, API, and automation services." />

      </Head>



      <Header />



      <main className="container mx-auto px-4 py-16">

        <h1 className="text-4xl font-bold mb-4">Our Services</h1>

        <p className="text-xl mb-12">High-quality, modern, and scalable digital solutions for your business.</p>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {serviceData.map((service, i) => (

            <div key={i} className="border border-gray-200 rounded-xl p-6">

              <h2 className="text-2xl font-bold mb-2">{service.title}</h2>

              <p className="text-gray-600 mb-4">{service.description}</p>

              <ul className="list-disc pl-5 mb-4 text-gray-700">

                {service.features.map((f, j) => <li key={j}>{f}</li>)}

              </ul>

              <div className="flex justify-between items-center">

                <span className="font-bold text-lg">{service.pricing}</span>

                <Button size="sm" as="a" href="/contact">Get Quote</Button>

              </div>

            </div>

          ))}

        </div>

      </main>



      <Footer />

    </>

  );

}
