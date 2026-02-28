'use client';

import { Calendar, CreditCard, Shield, Car, Users, Clock, Phone, ArrowRight, CheckCircle } from 'lucide-react';

export default function ServicesMobile() {
  const services = [
    {
      icon: Calendar,
      title: 'Daily Parking',
      description: 'Flexible daily parking options for short-term needs',
      features: ['Hourly rates', 'Easy access', 'Secure locations'],
      popular: true
    },
    {
      icon: Calendar,
      title: 'Monthly Parking',
      description: 'Cost-effective monthly parking for regular commuters',
      features: ['Fixed monthly rate', 'Reserved spot', '24/7 access'],
      popular: false
    },
    {
      icon: Shield,
      title: 'Secure Parking',
      description: 'Monitored and safe parking environments',
      features: ['Security cameras', 'Well-lit areas', 'Regular patrols'],
      popular: false
    },
    {
      icon: Car,
      title: 'Multiple Vehicle Types',
      description: 'Parking solutions for cars, motorcycles, and more',
      features: ['Standard parking', 'Compact spots', 'Accessible spaces'],
      popular: false
    },
    {
      icon: Users,
      title: 'Landlord Services',
      description: 'Parking management solutions for property owners',
      features: ['Revenue sharing', 'Property management', 'Maintenance'],
      popular: false
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock parking access and support',
      features: ['Always open', 'Emergency support', 'Flexible timing'],
      popular: false
    }
  ];

  // Removed color function - using blue/white theme

  return (
    <div className="md:hidden">
      {/* Header Section - Mobile Only */}
      <div className="bg-gray-50 px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            DAILY AND MONTHLY
            <br />
            PARKING
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            TALK OR TEXT 513-879-5163
          </p>
          
          <div className="inline-flex items-center bg-blue-900 text-white px-6 py-3 rounded-lg">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="font-semibold">Flexible Parking Solutions</span>
          </div>
          
          <p className="text-gray-600 text-sm mt-4">
            Flexible parking solutions for your needs
          </p>
        </div>
      </div>

      {/* Services Grid - Mobile Optimized with 3D Effects */}
      <div className="px-4 py-6 bg-white">
        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <div
                key={index}
                className={`relative group transform-gpu transition-all duration-300 active:scale-95`}
                style={{ perspective: '1000px' }}
              >
                {/* 3D Shadow Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-2xl transform translate-y-2 translate-x-1 blur-lg group-hover:translate-y-1 group-hover:translate-x-0.5 transition-all duration-300"></div>
                
                {/* Main Card - Blue/White Theme */}
                <div className={`relative bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-200 overflow-hidden`}>
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <CheckCircle className="w-3 h-3" />
                        POPULAR
                      </div>
                    </div>
                  )}
                  
                  {/* Card Content */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* 3D Icon Container */}
                      <div className="relative transform-gpu transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <div className="absolute inset-0 bg-blue-600 opacity-20 rounded-lg blur-md transform scale-110"></div>
                        <div className="relative flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-md border-2 border-blue-100 transform-gpu transition-all duration-300 group-hover:shadow-lg group-hover:border-blue-200">
                          <Icon className="w-7 h-7 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {service.title}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {service.description}
                        </p>
                        
                        {/* Features List */}
                        <div className="space-y-2">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 flex-shrink-0 transform-gpu transition-all duration-300 group-hover:scale-150"></div>
                              <span className="truncate">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* 3D Hover Effect Bottom Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section - Mobile Optimized with 3D Effects */}
      <div className="px-4 py-6 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="max-w-md mx-auto text-center">
          <div className="relative">
            {/* 3D Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl transform-gpu"></div>
            
            {/* Main CTA Card */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl transform-gpu transition-all duration-300 hover:scale-[1.02]">
              {/* 3D Header */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-t-2xl h-8"></div>
                <h2 className="relative text-xl font-bold text-white mb-3">
                  Ready to Park with Us?
                </h2>
              </div>
              
              <p className="text-blue-100 text-sm mb-5 leading-relaxed">
                Join thousands of satisfied customers who trust Detroit Parking LLC for their parking needs.
              </p>
              
              {/* 3D Buttons */}
              <div className="space-y-3">
                <a
                  href="/sign-up"
                  className="relative group flex items-center justify-center w-full bg-gradient-to-r from-white to-blue-50 text-blue-900 px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
                >
                  {/* Button 3D Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    Sign Up Now
                    <ArrowRight className="w-4 h-4 ml-2 transform-gpu transition-all duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
                
                <a
                  href="tel:513-879-5163"
                  className="relative group flex items-center justify-center w-full border-2 border-white text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:bg-white hover:text-blue-900 transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
                >
                  {/* Button 3D Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    <Phone className="w-4 h-4 mr-2 transform-gpu transition-all duration-300 group-hover:scale-110" />
                    Call 513-879-5163
                  </span>
                </a>
              </div>
              
              {/* 3D Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { label: '****+', sublabel: 'Spots', delay: '0' },
                  { label: '24/7', sublabel: 'Support', delay: '100' },
                  { label: '100%', sublabel: 'Secure', delay: '200' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="relative group transform-gpu transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${stat.delay}ms` }}
                  >
                    {/* 3D Shadow */}
                    <div className="absolute inset-0 bg-black/20 rounded-lg blur-md transform translate-y-1 group-hover:translate-y-0.5 transition-all duration-300"></div>
                    
                    {/* Stat Card */}
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 transform-gpu transition-all duration-300 hover:bg-white/20">
                      <div className="text-lg font-bold text-white transform-gpu transition-all duration-300 group-hover:scale-110">
                        {stat.label}
                      </div>
                      <div className="text-xs text-blue-200">
                        {stat.sublabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
