'use client';

import { ArrowLeft, Mail, Phone, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 mb-6 hover:text-emerald-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <RotateCcw className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Refund Policy</h1>
          </div>
          <p className="text-emerald-100 text-lg">Simple, hassle-free refunds</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Message */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-600 p-6 rounded-lg mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mistakes happen.</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We understand that plans change. Whether it's a change of plans, no spots available, or any other reason, we're here to make things right.
          </p>
        </div>

        {/* How to Get a Refund Section */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 border border-gray-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-full flex items-center justify-center font-bold text-xl">
              ✓
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">How to Get a Full Refund</h2>
              <p className="text-gray-600 mt-1">Refund eligibility and timeframe</p>
            </div>
          </div>

          <div className="ml-16 space-y-6">
            {/* Refund Window */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Refund Window</h3>
              </div>
              <p className="text-gray-700 mt-2">You can request a full refund in two ways:</p>
              <ul className="mt-4 space-y-2 ml-2">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></span>
                  <span className="text-gray-700"><span className="font-semibold">Before session starts:</span> Contact us up to the minute before your parking session begins</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></span>
                  <span className="text-gray-700"><span className="font-semibold">After session starts:</span> Within 10 minutes of your session start</span>
                </li>
              </ul>
              <p className="text-gray-600 mt-4 text-sm italic">Act quickly to ensure your refund is processed!</p>
            </div>

            {/* How to Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                How to Request a Refund
              </h3>
              <p className="text-gray-700 mb-4">Send an email to our Detroit Parking support team:</p>
              <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-center">
                <a 
                  href="mailto:detroitparkingllc@gmail.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  detroitparkingllc@gmail.com
                </a>
              </div>
              <p className="text-gray-600 text-sm mt-3">
                Include your booking reference number or parking session details for quick processing.
              </p>
            </div>
          </div>
        </div>

        {/* Key Points Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Full Refund */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900">Full Refund</h3>
            </div>
            <p className="text-gray-700">
              You're eligible for a complete refund if you request it within the specified timeframe. No questions asked.
            </p>
          </div>

          {/* Quick Processing */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900">Quick Processing</h3>
            </div>
            <p className="text-gray-700">
              Refunds are processed promptly once we receive your request. Check your account or email for confirmation.
            </p>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg mb-12">
          <h3 className="font-bold text-gray-900 mb-3">Important Note</h3>
          <p className="text-gray-700">
            Refund eligibility is determined by the time of your request relative to your parking session. Please make sure to contact us as soon as you know you won't need your spot to ensure you're within the refund window.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions About Our Refund Policy?</h2>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6 border border-emerald-200">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Email Support</p>
                  <a 
                    href="mailto:detroitparkingllc@gmail.com"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    detroitparkingllc@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Phone Support</p>
                  <a 
                    href="tel:+15138795163"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    +1 (513) 879-5163
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-12 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">No Sweat. We've Got You.</h2>
          <p className="text-emerald-100 mb-6 text-lg">Our refund policy is designed with you in mind.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15138795163"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
            <a
              href="mailto:detroitparkingllc@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Support
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
