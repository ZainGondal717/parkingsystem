'use client';

import { Calendar, CreditCard, Shield, Car, Users, Clock } from 'lucide-react';
import ServicesMobile from './ServicesMobile';

export default function Services() {
  const services = [
    {
      icon: Calendar,
      title: 'Daily Parking',
      description: 'Flexible daily parking options for short-term needs',
      features: ['Hourly rates', 'Easy access', 'Secure locations']
    },
    {
      icon: Calendar,
      title: 'Monthly Parking',
      description: 'Cost-effective monthly parking for regular commuters',
      features: ['Fixed monthly rate', 'Reserved spot', '24/7 access']
    },
    {
      icon: Shield,
      title: 'Secure Parking',
      description: 'Monitored and safe parking environments',
      features: ['Security cameras', 'Well-lit areas', 'Regular patrols']
    },
    {
      icon: Car,
      title: 'Multiple Vehicle Types',
      description: 'Parking solutions for cars, motorcycles, and more',
      features: ['Standard parking', 'Compact spots', 'Accessible spaces']
    },
    {
      icon: Users,
      title: 'Landlord Services',
      description: 'Parking management solutions for property owners',
      features: ['Revenue sharing', 'Property management', 'Maintenance']
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock parking access and support',
      features: ['Always open', 'Emergency support', 'Flexible timing']
    }
  ];

  return (
    <>
      {/* Mobile Version - Separate Component */}
      <ServicesMobile />
      
      {/* Desktop Version - Original Implementation */}
      <section className="hidden md:block py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
            DAILY AND MONTHLY PARKING
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            TALK OR TEXT 513-879-5163
          </p>
          <div className="inline-flex items-center bg-blue-900 text-white px-8 py-4 rounded-lg">
            <Calendar className="w-6 h-6 mr-3" />
            <span className="text-lg font-semibold">Flexible Parking Solutions</span>
            </div>
          </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Subtle Shadow Layer */}
              <div className="absolute inset-0 bg-black/8 rounded-lg transform translate-y-1 translate-x-0.5 blur-md group-hover:translate-y-0.5 group-hover:translate-x-0.25 transition-all duration-300"></div>
              
              {/* Main Service Card - Subtle 3D */}
              <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-lg p-6 shadow-md hover:shadow-lg border border-blue-100 transition-all duration-300 overflow-hidden">
                {/* Subtle Top Highlight */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-lg"></div>
                
                {/* Icon Container - Subtle 3D */}
                <div className="relative mb-4 transition-all duration-300 group-hover:scale-105">
                  <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-lg blur-sm"></div>
                  <div className="relative flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm border border-blue-100 mx-auto transition-all duration-300 group-hover:shadow-md group-hover:border-blue-200">
                    <service.icon className="w-8 h-8 text-blue-600 transition-all duration-300 group-hover:scale-105" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3 transition-all duration-300 group-hover:text-blue-800">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 text-center mb-4 transition-all duration-300 group-hover:text-blue-600">
                  {service.description}
                </p>
                
                {/* Features List - Subtle Effects */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600 transition-all duration-300 group-hover:text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-700"></div>
                      <span className="truncate">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Subtle Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-900 text-white rounded-lg p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Ready to Park with Us?
              </h3>
              <p className="text-blue-100 mb-6">
                Join thousands of satisfied customers who trust Detroit Parking LLC for their parking needs. 
                Whether you need daily or monthly parking, we have the perfect solution for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/sign-up"
                  className="inline-flex items-center justify-center bg-white text-blue-900 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Sign Up Now
                </a>
                <a
                  href="tel:513-879-5163"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-900 transition-colors"
                >
                  Call 513-879-5163
                </a>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-2xl font-bold mb-2">****+</h4>
                <p className="text-blue-100 mb-4">Parking Spots Managed</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 rounded p-3">
                    <div className="font-bold">24/7</div>
                    <div className="text-blue-200">Support</div>
                  </div>
                  <div className="bg-white/10 rounded p-3">
                    <div className="font-bold">100%</div>
                    <div className="text-blue-200">Secure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}
