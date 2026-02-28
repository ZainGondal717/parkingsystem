'use client';

import { Phone, Mail, MapPin, Clock, Building, Send, AlertCircle } from 'lucide-react';

export default function ContactMobile() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Main Office',
      details: ['1102 Adams St., Toledo, OH 43604'],
      action: null,
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['513-879-5163'],
      action: 'tel:513-879-5163',
      color: 'green'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@detroitparking.com'],
      action: 'mailto:info@detroitparking.com',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['24/7 Availability', 'Always Open'],
      action: null,
      color: 'orange'
    }
  ];

  const getColorClasses = (color) => {
    // Use consistent blue/white theme like services section
    return {
      bg: 'bg-gradient-to-br from-white to-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-100',
      accent: 'bg-blue-600'
    };
  };

  return (
    <div className="md:hidden">
      {/* Header Section - Mobile */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            CONTACT DETROIT
            <br />
            PARKING LLC
          </h1>
          
          <p className="text-gray-600 text-sm">
            We're here to help with all your parking needs
          </p>
        </div>
      </div>

      {/* Contact Cards - Mobile Optimized with 3D Effects */}
      <div className="px-4 py-6 bg-white">
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          {contactInfo.map((item, index) => {
            const colors = getColorClasses(item.color);
            const Icon = item.icon;
            
            return (
              <div
                key={index}
                className="relative group transform-gpu transition-all duration-300 active:scale-95"
                style={{ perspective: '1000px' }}
              >
                {/* 3D Shadow Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-2xl transform translate-y-2 translate-x-1 blur-lg group-hover:translate-y-1 group-hover:translate-x-0.5 transition-all duration-300"></div>
                
                {/* Main Contact Card */}
                <div className={`relative ${colors.bg} rounded-2xl border-2 ${colors.border} hover:bg-gradient-to-br hover:from-white hover:to-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden`}>
                  {/* 3D Top Highlight */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-t-2xl"></div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      {/* 3D Icon Container */}
                      <div className="relative transform-gpu transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <div className={`absolute inset-0 ${colors.accent} opacity-20 rounded-lg blur-md transform scale-110`}></div>
                        <div className={`relative flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-md border-2 ${colors.border} transform-gpu transition-all duration-300 group-hover:shadow-lg`}>
                          <Icon className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        
                        <div className="space-y-1">
                          {item.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="text-sm text-gray-700">
                              {item.action ? (
                                <a
                                  href={item.action}
                                  className={`${colors.icon} hover:underline transition-colors block transform-gpu transition-all duration-300 hover:scale-105`}
                                >
                                  {detail}
                                </a>
                              ) : (
                                detail
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* 3D Bottom Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Contact Form - Mobile */}
      <div className="px-4 py-6 bg-gray-50">
        <div className="max-w-sm mx-auto">
          <div className="relative">
            {/* 3D Shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-2xl transform translate-y-2 translate-x-1 blur-lg"></div>
            
            {/* Form Container */}
            <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Quick Contact
                </h3>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform-gpu hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information - Mobile */}
      <div className="px-4 py-6 bg-white">
        <div className="max-w-sm mx-auto space-y-4">
          {/* Parent Company Card */}
          <div className="relative group transform-gpu transition-all duration-300 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-2xl transform translate-y-2 translate-x-1 blur-lg group-hover:translate-y-1 group-hover:translate-x-0.5 transition-all duration-300"></div>
            
            <div className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <Building className="w-5 h-5" />
                <h3 className="text-lg font-bold">
                  Parent Company
                </h3>
              </div>
              
              <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                Detroit Parking LLC is part of a larger network of parking solutions 
                dedicated to providing excellent service across multiple locations.
              </p>
              
              <a
                href="http://www.wayneparking.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 transform-gpu hover:scale-105 active:scale-95"
              >
                <Building className="w-4 h-4 mr-2" />
                Visit Wayne Parking
              </a>
            </div>
          </div>

          {/* Emergency Support Card */}
          <div className="relative group transform-gpu transition-all duration-300 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-2xl transform translate-y-2 translate-x-1 blur-lg group-hover:translate-y-1 group-hover:translate-x-0.5 transition-all duration-300"></div>
            
            <div className="relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl border border-red-100 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Emergency Support
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Need immediate assistance? Our support team is available 24/7 to help 
                with any parking emergencies or urgent inquiries.
              </p>
              
              <a
                href="tel:513-879-5163"
                className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 transform-gpu hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency: 513-879-5163
              </a>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                Available 24/7 for urgent matters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
