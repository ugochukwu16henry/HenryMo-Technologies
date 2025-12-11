// pages/contact.js

import { useState } from 'react';

import Head from 'next/head';

import Header from '../components/Header';

import Footer from '../components/Footer';

import Button from '../components/ui/Button';

export default function Contact() {

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {

    e.preventDefault();

    setStatus('sending');

    

    const res = await fetch('/api/inquiries', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify(formData),

    });

    if (res.ok) {

      setStatus('success');

      setFormData({ name: '', email: '', message: '' });

    } else {

      setStatus('error');

    }

  };

  return (

    <>

      <Head>

        <title>Contact Us — HenryMo Technologies</title>

        <meta name="description" content="Get in touch for your next digital project." />

      </Head>

      <Header />

      <main className="container mx-auto px-4 py-16">

        <h1 className="text-4xl font-bold mb-4">Let's Build Something Amazing</h1>

        <p className="text-xl mb-8">Ready to bring your project to life?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          <div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>

                <label className="block mb-1 font-medium">Name</label>

                <input

                  type="text"

                  className="w-full px-4 py-2 border rounded-lg"

                  value={formData.name}

                  onChange={e => setFormData({...formData, name: e.target.value})}

                  required

                />

              </div>

              <div>

                <label className="block mb-1 font-medium">Email</label>

                <input

                  type="email"

                  className="w-full px-4 py-2 border rounded-lg"

                  value={formData.email}

                  onChange={e => setFormData({...formData, email: e.target.value})}

                  required

                />

              </div>

              <div>

                <label className="block mb-1 font-medium">Message</label>

                <textarea

                  rows="5"

                  className="w-full px-4 py-2 border rounded-lg"

                  value={formData.message}

                  onChange={e => setFormData({...formData, message: e.target.value})}

                  required

                ></textarea>

              </div>

              <Button type="submit" disabled={status === 'sending'}>

                {status === 'sending' ? 'Sending...' : 'Send Message'}

              </Button>

              {status === 'success' && <p className="text-green-600 mt-2">Message sent! We'll reply soon.</p>}

              {status === 'error' && <p className="text-red-600 mt-2">Failed to send. Please try again.</p>}

            </form>

          </div>

          <div>

            <h2 className="text-2xl font-bold mb-4">Contact Info</h2>

            <p><strong>Email:</strong> <a href="mailto:ugochukwuhenry16@gmail.com" className="text-[#007BFF] hover:underline">ugochukwuhenry16@gmail.com</a></p>

            <p className="mt-4"><strong>WhatsApp:</strong> <a href="https://wa.me/2349015718484" className="text-[#007BFF] hover:underline" target="_blank" rel="noopener noreferrer">+234 901 571 8484</a></p>

            <p className="mt-6">

              <strong>Office Hours:</strong><br />

              Mon–Fri: 9AM – 6PM WAT

            </p>

            <div className="mt-6">

              <Button as="a" href="https://wa.me/2349015718484?text=Hello%20Henry%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20you." variant="gold" target="_blank" rel="noopener noreferrer">

                Chat on WhatsApp

              </Button>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </>

  );

}
