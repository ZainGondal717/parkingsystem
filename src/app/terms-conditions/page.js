'use client';

import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function TermsConditions() {
  const sections = [
    {
      number: '1',
      title: 'Acceptance of Terms',
      content: 'Your access to and use of the Services constitutes a binding agreement between you and Detroit Parking LLC, and your acceptance of these Terms and our Privacy Policy. You agree to follow and be bound by all Terms and applicable law.'
    },
    {
      number: '2',
      title: 'Use of Services',
      content: 'Use of Services',
      items: [
        'You must be at least 16 years old to use or create an account.',
        'You agree to provide accurate, complete registration and payment information.',
        'You are responsible for all activity on your account.',
        'You agree to comply with all local parking rules, signs, regulations, and posted instructions at parking facilities.'
      ]
    },
    {
      number: '3',
      title: 'Account Responsibilities',
      content: 'Account Responsibilities',
      items: [
        'You are responsible for maintaining the confidentiality of your login credentials.',
        'You agree to notify us immediately if unauthorized use of your account occurs.',
        'Detroit Parking LLC may suspend or terminate your account at any time for violation of Terms or misuse of Services.'
      ]
    },
    {
      number: '4',
      title: 'Payments and Fees',
      content: 'Payments and Fees',
      items: [
        'Parking fees are charged based on the usage and the rates posted at the time of parking.',
        'All fees and charges are due and payable at the time of parking service.',
        'You agree to pay all taxes and fees associated with your account.',
        'No refunds will be provided unless required by law.'
      ]
    },
    {
      number: '5',
      title: 'Use Restrictions',
      content: 'When using our Services, you agree not to:',
      items: [
        'Use the Services unlawfully, fraudulently, or in ways that harm others.',
        'Interfere with or disrupt the operation of the Services.',
        'Use bots, scripts, or automated tools to access or manage your account.',
        'Reverse engineer, modify, or tamper with the Services.'
      ]
    },
    {
      number: '6',
      title: 'Intellectual Property',
      content: 'All content, trademarks, service marks, logos, graphics, and software associated with the Services are the property of Detroit Parking LLC or its licensors and are protected by applicable laws.'
    },
    {
      number: '7',
      title: 'Disclaimer & Limitation of Liability',
      content: 'Disclaimer & Limitation of Liability',
      items: [
        'Detroit Parking LLC provides Services "as is" and does not guarantee uninterrupted or error-free operation.',
        'We are not responsible for loss or damage to vehicles or property while parked.',
        'To the extent permitted by law, Detroit Parking LLC is not liable for indirect, incidental, special, or consequential damages.'
      ]
    },
    {
      number: '8',
      title: 'Modification of Terms',
      content: 'We may change these Terms at any time by posting updated Terms on our website or app. Continued use of the Services indicates your acceptance of the modified Terms.'
    },
    {
      number: '9',
      title: 'Governing Law',
      content: 'These Terms are governed by the laws of the State in which Detroit Parking LLC operates, without regard to conflict of law principles.'
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-blue-100 text-lg">Detroit Parking LLC</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Effective Date */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-12">
          <p className="text-gray-700">
            <span className="font-semibold text-blue-900">Effective Date:</span> February 17, 2026
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            By using Detroit Parking LLC's parking services, mobile app, website, or related features (collectively, the "Services") you agree to these Terms and Conditions. If you do not agree, do not use our Services.
          </p>
        </div>

        {/* Terms Sections */}
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

        {/* Section 10: Contact */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
              10
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
          </div>

          <div className="ml-14 space-y-6">
            <p className="text-gray-600">If you have questions about these Terms, please contact:</p>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Detroit Parking LLC</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-700">1102 Adams St., Toledo, OH 43604</p>
                  </div>
                </div>

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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-blue-100 mb-6 text-lg">We're here to help. Contact us anytime.</p>
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
