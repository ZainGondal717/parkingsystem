'use client';

import { Phone, Mail, MapPin, Clock, Building } from 'lucide-react';
import ContactMobile from './ContactMobile';

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Main Office',
      details: ['1102 Adams St., Toledo, OH 43604'],
      action: null
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['513-879-5163'],
      action: 'tel:513-879-5163'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@detroitparking.com'],
      action: 'mailto:info@detroitparking.com'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['24/7 Availability', 'Always Open'],
      action: null
    }
  ];

  return (
    <>
      {/* Mobile Version - Separate Component */}
      <ContactMobile />
      
      {/* Desktop Version - Original Implementation */}
      <section className="hidden md:block py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            CONTACT DETROIT PARKING LLC
          </h2>
          <p className="text-xl text-gray-600">
            We're here to help with all your parking needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 mx-auto">
                <item.icon className="w-8 h-8 text-blue-900" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>
              
              <div className="space-y-1">
                {item.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-gray-600">
                    {item.action ? (
                      <a
                        href={item.action}
                        className="hover:text-blue-900 transition-colors"
                      >
                        {detail}
                      </a>
                    ) : (
                      detail
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Quick Contact Form */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Contact
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Information */}
          <div>
            <div className="bg-blue-900 text-white rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">
                Parent Company
              </h3>
              <p className="text-blue-100 mb-4">
                Detroit Parking LLC is part of a larger network of parking solutions 
                dedicated to providing excellent service across multiple locations.
              </p>
              <a
                href="http://www.wayneparking.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-blue-900 px-4 py-2 rounded font-medium hover:bg-blue-50 transition-colors"
              >
                <Building className="w-4 h-4 mr-2" />
                Visit Wayne Parking
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Emergency Support
              </h3>
              <p className="text-gray-600 mb-6">
                Need immediate assistance? Our support team is available 24/7 to help 
                with any parking emergencies or urgent inquiries.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:513-879-5163"
                  className="flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency: 513-879-5163
                </a>
                <p className="text-sm text-gray-500 text-center">
                  Available 24/7 for urgent matters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
