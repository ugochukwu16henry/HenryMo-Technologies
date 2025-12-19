// pages/terms.js

import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | HenryMo Technologies</title>
        <meta
          name="description"
          content="Terms of Service for HenryMo Technologies - Rules and guidelines for using our services."
        />
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
              <Link href="/" className="text-gray-600 hover:text-[#007BFF]">
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-[#007BFF]"
              >
                About
              </Link>
              <Link
                href="/portfolio"
                className="text-gray-600 hover:text-[#007BFF]"
              >
                Portfolio
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-[#007BFF]">
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-[#007BFF]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-[#007BFF] to-[#0056b3] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-blue-100">
              Please read these terms carefully before using our services
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
              {/* Agreement */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Agreement to Terms
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing or using the services provided by HenryMo
                  Technologies, you agree to be bound by these Terms of Service.
                  If you do not agree to these terms, please do not use our
                  services.
                </p>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Our Services
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  HenryMo Technologies provides digital solutions including but
                  not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Website Development</li>
                  <li>Mobile App Development</li>
                  <li>Custom Software Engineering</li>
                  <li>Database Design & Management</li>
                  <li>API Development</li>
                  <li>Social Media Automation</li>
                  <li>IT Consulting</li>
                  <li>Branding & Digital Identity</li>
                </ul>
              </div>

              {/* User Responsibilities */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. User Responsibilities
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When using our services, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>
                    Maintain the confidentiality of any account credentials
                  </li>
                  <li>Use our services only for lawful purposes</li>
                  <li>Not interfere with or disrupt our services</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Intellectual Property
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  All content, designs, code, and materials created by HenryMo
                  Technologies remain our intellectual property until full
                  payment is received. Upon completion of payment, ownership of
                  deliverables will transfer to the client as specified in
                  individual project agreements.
                </p>
              </div>

              {/* Payment Terms */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Payment Terms
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Payment terms are as follows:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>A deposit may be required before project commencement</li>
                  <li>
                    Payment schedules will be outlined in individual project
                    proposals
                  </li>
                  <li>Late payments may incur additional fees</li>
                  <li>All prices are subject to applicable taxes</li>
                </ul>
              </div>

              {/* Project Timeline */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Project Timeline
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Project timelines are estimates and may vary based on project
                  scope and complexity. We will communicate any changes to the
                  timeline promptly. Delays caused by client feedback or changes
                  may extend the project deadline.
                </p>
              </div>

              {/* Revisions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Revisions and Changes
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Each project includes a specified number of revision rounds as
                  outlined in the project agreement. Additional revisions or
                  scope changes may incur extra charges.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  HenryMo Technologies shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages
                  arising from your use of our services. Our total liability
                  shall not exceed the amount paid for the specific service in
                  question.
                </p>
              </div>

              {/* Warranty Disclaimer */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Warranty Disclaimer
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Our services are provided &quot;as is&quot; without warranties
                  of any kind, either express or implied. We do not guarantee
                  that our services will be uninterrupted, error-free, or meet
                  all your requirements.
                </p>
              </div>

              {/* Termination */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Termination
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Either party may terminate a project agreement with written
                  notice. Upon termination, the client is responsible for
                  payment of all work completed up to the termination date.
                </p>
              </div>

              {/* Confidentiality */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Confidentiality
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We treat all client information as confidential and will not
                  disclose it to third parties without consent, except as
                  required by law.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  12. Governing Law
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Service shall be governed by and construed in
                  accordance with the laws of Nigeria, without regard to
                  conflict of law principles.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  13. Changes to Terms
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these terms at any time.
                  Changes will be effective upon posting to our website. Your
                  continued use of our services constitutes acceptance of the
                  updated terms.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="text-gray-600 space-y-2">
                  <p>
                    <strong>HenryMo Technologies</strong>
                  </p>
                  <p>Uyo Nsukara Offot, Uyo, Akwa Ibom 460103, Nigeria</p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:ugochukwuhenry16@gmail.com"
                      className="text-[#007BFF] hover:underline"
                    >
                      ugochukwuhenry16@gmail.com
                    </a>
                  </p>
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
