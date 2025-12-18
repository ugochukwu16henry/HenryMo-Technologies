// pages/privacy.js

import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | HenryMo Technologies</title>
        <meta name="description" content="Privacy Policy for HenryMo Technologies - How we collect, use, and protect your information." />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-[#007BFF]">
                HenryMo Technologies
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-[#007BFF]">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-[#007BFF]">About</Link>
              <Link href="/portfolio" className="text-gray-600 hover:text-[#007BFF]">Portfolio</Link>
              <Link href="/blog" className="text-gray-600 hover:text-[#007BFF]">Blog</Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#007BFF]">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-[#007BFF] to-[#0056b3] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-100">
              Your privacy is important to us
            </p>
            <p className="text-sm text-blue-200 mt-4">
              Last updated: December 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-8">
              
              {/* Introduction */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  HenryMo Technologies (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website or use our services.
                </p>
              </div>

              {/* Information We Collect */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may collect information about you in a variety of ways, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact information you voluntarily provide through our contact forms.</li>
                  <li><strong>Usage Data:</strong> Information about how you use our website, including pages visited, time spent, and navigation patterns.</li>
                  <li><strong>Device Data:</strong> Information about your device, browser type, IP address, and operating system.</li>
                  <li><strong>Cookies:</strong> Small data files stored on your device to enhance your browsing experience.</li>
                </ul>
              </div>

              {/* How We Use Your Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you updates about our services (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Protect against fraudulent or unauthorized activity</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                <p className="text-gray-600 leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-4">
                  <li>With service providers who assist us in operating our website</li>
                  <li>To comply with legal requirements or respond to lawful requests</li>
                  <li>To protect our rights, privacy, safety, or property</li>
                  <li>With your explicit consent</li>
                </ul>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, or 
                  destruction. However, no method of transmission over the Internet is 100% secure, 
                  and we cannot guarantee absolute security.
                </p>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our website uses cookies to enhance your browsing experience. You can control 
                  cookie settings through your browser preferences. Disabling cookies may affect 
                  some features of our website.
                </p>
              </div>

              {/* Third-Party Links */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible 
                  for the privacy practices or content of these external sites. We encourage you 
                  to review their privacy policies before providing any personal information.
                </p>
              </div>

              {/* Children's Privacy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not 
                  knowingly collect personal information from children. If we become aware that 
                  we have collected information from a child, we will take steps to delete it.
                </p>
              </div>

              {/* Changes to This Policy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted 
                  on this page with an updated revision date. We encourage you to review this 
                  policy periodically.
                </p>
              </div>

              {/* Contact Us */}
              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="text-gray-600 space-y-2">
                  <p><strong>HenryMo Technologies</strong></p>
                  <p>Uyo Nsukara Offot, Uyo, Akwa Ibom 460103, Nigeria</p>
                  <p>Email: <a href="mailto:admin@henrymo.tech" className="text-[#007BFF] hover:underline">admin@henrymo.tech</a></p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

