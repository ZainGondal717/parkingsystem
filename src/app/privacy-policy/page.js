'use client';

import { ArrowLeft, Mail, Phone, Shield, Lock } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const sections = [
    {
      number: '1',
      title: 'Information We Collect',
      content: 'We collect information you provide directly and automatically when you use our Services, including:',
      items: [
        'Personal Information you provide: Name, email, phone number, payment details, vehicle information, and any data you submit when creating an account or making a parking transaction.',
        'Technical & Usage Information: IP address, device identifiers, browser info, location data, and other usage data via cookies or similar technology.'
      ]
    },
    {
      number: '2',
      title: 'How We Use Your Information',
      content: 'We use collected information to:',
      items: [
        'Provide and fulfill parking services and transactions.',
        'Communicate with you about your account or Services.',
        'Improve our app, website, and Services.',
        'Send you marketing and promotional messages (with your consent).',
        'Comply with legal obligations.'
      ]
    },
    {
      number: '3',
      title: 'Sharing Your Information',
      content: 'Sharing Your Information',
      items: [
        'With service providers who assist us in delivering the Services.',
        'With partners or affiliates when necessary to fulfill Services.',
        'As required by law, or to protect rights and safety.',
        'We do not sell your Personal Information for commercial purposes.'
      ]
    },
    {
      number: '4',
      title: 'Cookies & Tracking Technologies',
      content: 'We use cookies, beacons, and similar technologies to understand usage patterns, remember login information, and enhance your experience. You can manage or disable cookies via your browser settings, though this may affect functionality.'
    },
    {
      number: '5',
      title: 'Data Storage & Security',
      content: 'Your data is stored and processed in the U.S. and may be transferred internationally to fulfill service needs. We implement reasonable security measures to protect your information, but no system is completely secure.'
    },
    {
      number: '6',
      title: 'Your Choices & Rights',
      content: 'You may:',
      items: [
        'Opt out of marketing communications.',
        'Access, correct, or delete your Personal Information in accordance with applicable law.',
        'Manage tracking preferences (cookies or push notifications).'
      ]
    },
    {
      number: '7',
      title: 'Children\'s Privacy',
      content: 'Our Services are not intended for use by children under 16. We do not knowingly collect Personal Information from minors.'
    },
    {
      number: '8',
      title: 'Changes to this Policy',
      content: 'We may update this policy from time to time. Continued use of our Services after changes are posted constitutes your acceptance.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 mb-6 hover:text-blue-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-blue-100 text-lg">How we protect your information</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Effective Date */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-lg mb-12">
          <p className="text-gray-700 mb-3">
            <span className="font-semibold text-blue-900">Effective Date:</span> February 17, 2026
          </p>
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy explains how Detroit Parking LLC ("we," "us," or "our") collects, uses, and protects information when you use our mobile app, website, parking services, and related features (collectively, the "Services").
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 border border-gray-200">
              {/* Section Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {section.number}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>

              {/* Section Content */}
              {section.items ? (
                <div className="ml-14 space-y-3">
                  <p className="text-gray-600 mb-4">{section.content}</p>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="ml-14 text-gray-700 leading-relaxed">{section.content}</p>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-4">
            <Lock className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              <p className="text-gray-600 mt-1">Questions about your privacy?</p>
            </div>
          </div>

          <div className="ml-12 space-y-6">
            <p className="text-gray-600">If you have questions about this Privacy Policy or wish to exercise your privacy rights, contact:</p>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Detroit Parking LLC</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a 
                      href="mailto:detroitparkingllc@gmail.com"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      detroitparkingllc@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a 
                      href="tel:+15138795163"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      +1 (513) 879-5163
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Privacy Matters to Us</h2>
          <p className="text-blue-100 mb-6 text-lg">We're committed to protecting your data and keeping you informed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15138795163"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
            <a
              href="mailto:detroitparkingllc@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
