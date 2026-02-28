'use client';

import { Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about-us' },
      { name: 'Contact Us', href: '/contact-us' },
      { name: 'Sign Up/ Sign In', href: '/sign-up' },
    ],
    locations: [
      { name: 'LOT A', href: '/lot-a' },
      { name: 'LOT B', href: '/lot-b' },
      { name: 'LOT C', href: '/lot-c' },
    ],
    legal: [
      { name: 'Terms & Conditions', href: '/terms-conditions' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Refund Policy', href: '/refund-policy' },
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-blue-300">
              DETROIT PARKING LLC
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  1102 Adams St., Toledo, OH 43604
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
                <a 
                  href="tel:513-879-5163" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  TEL: 513-879-5163
                </a>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner for secure and convenient parking solutions in Ohio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">
              Locations
            </h4>
            <ul className="space-y-2">
              {footerLinks.locations.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`text-gray-300 hover:text-white transition-colors ${
                      link.name === 'LOT B' || link.name === 'LOT C' ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    {link.name}
                    {link.name === 'LOT B' || link.name === 'LOT C' ? ' (Coming Soon)' : ''}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Parent Company Link */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 mb-2">Parent Company</p>
              <a
                href="http://www.wayneparking.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Wayne Parking</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Detroit Parking LLC. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Managing **** parking spots across Ohio
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Daily & Monthly Parking</span>
              <span>•</span>
              <a href="tel:513-879-5163" className="hover:text-white transition-colors">
                Call: 513-879-5163
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
