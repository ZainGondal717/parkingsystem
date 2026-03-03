'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Locations() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleComingSoonClick = (locationNumber) => {
    setSelectedLocation(locationNumber);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLocation(null);
  };
  return (
    <>
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Daily and Monthly Parking Info */}
        {/* Mobile View */}
        <div className="md:hidden text-center mb-4" style={{ marginTop: '0' }}>
          <div style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '16px',
            color: 'rgb(0, 0, 0)',
            textAlign: 'center',
            fontWeight: '300',
            letterSpacing: '0.05em',
            lineHeight: '1.4',
            margin: '0 auto',
            display: 'inline-block'
          }}>
            DAILY AND MONTHLY PARKING<br />
            TALK OR TEXT 513-879-5163
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block text-center mb-4" style={{ marginTop: '0' }}>
          <div style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '22px',
            color: 'rgb(0, 0, 0)',
            textAlign: 'center',
            fontWeight: '300',
            letterSpacing: '0.05em',
            lineHeight: '1.4',
            margin: '0 auto',
            display: 'inline-block'
          }}>
            DAILY AND MONTHLY PARKING<br />
            TALK OR TEXT 513-879-5163
          </div>
        </div>
        
        {/* Mobile View - Currently Serving Locations with 3D */}
        <div className="md:hidden text-center mb-8 relative">
          <div className="relative inline-block transform-gpu transition-all duration-500 hover:scale-105">
            {/* 3D background shadow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg opacity-30 blur-lg transform translate-y-2"></div>
            {/* 3D heading container */}
            <div className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200">
              {/* Subtle 3D highlight */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-t-xl"></div>
              
              <h2 className="relative text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-gray-800 bg-clip-text text-transparent transform-gpu">
                CURRENTLY SERVING
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LOCATIONS</span>
              </h2>
              
              {/* Decorative 3D elements */}
              <div className="flex justify-center items-center gap-3 mt-3">
                <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full shadow-md shadow-blue-500/50"></div>
                <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View - Currently Serving Locations */}
        <div className="hidden md:block text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            CURRENTLY SERVING LOCATIONS
          </h2>
        </div>

        {/* Mobile Version - Subtle 3D Grid Layout */}
        <div className="md:hidden px-4 mt-8" style={{ perspective: '800px' }}>
          <div className="grid grid-cols-2 gap-5 max-w-sm mx-auto">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col items-center group transform-gpu transition-all duration-400 hover:scale-105 hover:rotate-2">
                {/* Subtle 3D Circle Shape - Mobile */}
                {item === 1 || item === 2 ? (
                  <a href={item === 1 ? '/lot-a' : 'http://www.wayneparking.com/'} 
                     target={item === 2 ? '_blank' : '_self'}
                     rel={item === 2 ? 'noopener noreferrer' : ''}
                     className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden border-3 border-gray-300 hover:border-blue-500 transition-all duration-400 cursor-pointer relative shadow-lg hover:shadow-xl transform-gpu preserve-3d block">
                    {/* Subtle 3D shadow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                    <div className="absolute -bottom-2 left-2 right-2 h-3 bg-black/15 rounded-full blur-lg transform-gpu translate-z-[-15px]"></div>
                    
                    {/* Subtle rim effect */}
                    <div className="absolute inset-0 rounded-full border border-white/20 shadow-inner"></div>
                    
                    <Image
                      src="/parking image example.jpg"
                      alt={`Location ${item}`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover transition-all duration-400 group-hover:scale-105 transform-gpu"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg transform-gpu translate-z-5">
                        <span className="text-blue-900 font-bold text-[10px] leading-tight">VIEW</span>
                      </div>
                    </div>
                    {/* Subtle highlight effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/25 via-white/10 to-transparent opacity-50 z-5"></div>
                  </a>
                ) : (
                  <button onClick={() => handleComingSoonClick(item)}
                          className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden border-3 border-gray-300 hover:border-red-500 transition-all duration-400 cursor-pointer relative shadow-lg hover:shadow-xl transform-gpu preserve-3d">
                    {/* Subtle 3D shadow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                    <div className="absolute -bottom-2 left-2 right-2 h-3 bg-black/15 rounded-full blur-lg transform-gpu translate-z-[-15px]"></div>
                    
                    {/* Subtle rim effect */}
                    <div className="absolute inset-0 rounded-full border border-white/20 shadow-inner"></div>
                    
                    <Image
                      src="/parking image example.jpg"
                      alt={`Location ${item}`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover transition-all duration-400 group-hover:scale-105 transform-gpu"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg transform-gpu translate-z-5">
                        <span className="text-red-900 font-bold text-[10px] leading-tight">SOON</span>
                      </div>
                    </div>
                    {/* Subtle highlight effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/25 via-white/10 to-transparent opacity-50 z-5"></div>
                  </button>
                )}
                
                {/* Enhanced 3D Tab Below Circle - Mobile */}
                {item === 1 || item === 2 ? (
                  <a href={item === 1 ? '/lot-a' : 'http://www.wayneparking.com/'} 
                     target={item === 2 ? '_blank' : '_self'}
                     rel={item === 2 ? 'noopener noreferrer' : ''}
                     className="bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-lg px-3 py-1.5 text-center hover:from-blue-100 hover:via-blue-50 hover:to-blue-200 transition-all duration-400 cursor-pointer mt-2 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 border border-gray-300 hover:border-blue-400 w-full relative transform-gpu preserve-3d block">
                    {/* Enhanced 3D shadow layers */}
                    <div className="absolute -bottom-1.5 left-1 right-1 h-3 bg-black/15 rounded-full blur-lg transform-gpu translate-z-[-12px]"></div>
                    <div className="absolute -bottom-0.5 left-2 right-2 h-1.5 bg-black/10 rounded-full blur-md transform-gpu translate-z-[-6px]"></div>
                    
                    {/* Enhanced 3D highlights */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-t-lg shadow-inner"></div>
                    <div className="absolute inset-0 rounded-lg border border-white/30 shadow-inner"></div>
                    <div className="absolute inset-0 rounded-lg border border-black/5"></div>
                    
                    {/* Subtle inner shadow for depth */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent via-black/5 to-transparent opacity-50"></div>
                    
                    <span className="text-[11px] font-bold text-gray-800 group-hover:text-blue-900 transition-colors duration-400 block relative z-10 drop-shadow-xs">
                      {item === 1 ? '1102 Adams Toledo' : 'Parent Company'}
                    </span>
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400"></div>
                  </a>
                ) : (
                  <button onClick={() => handleComingSoonClick(item)}
                          className="bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-lg px-3 py-1.5 text-center hover:from-red-100 hover:via-red-50 hover:to-red-200 transition-all duration-400 cursor-pointer mt-2 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 border border-gray-300 hover:border-red-400 w-full relative transform-gpu preserve-3d">
                    {/* Enhanced 3D shadow layers */}
                    <div className="absolute -bottom-1.5 left-1 right-1 h-3 bg-black/15 rounded-full blur-lg transform-gpu translate-z-[-12px]"></div>
                    <div className="absolute -bottom-0.5 left-2 right-2 h-1.5 bg-black/10 rounded-full blur-md transform-gpu translate-z-[-6px]"></div>
                    
                    {/* Enhanced 3D highlights */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-t-lg shadow-inner"></div>
                    <div className="absolute inset-0 rounded-lg border border-white/30 shadow-inner"></div>
                    <div className="absolute inset-0 rounded-lg border border-black/5"></div>
                    
                    {/* Subtle inner shadow for depth */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent via-black/5 to-transparent opacity-50"></div>
                    
                    <span className="text-[11px] font-bold text-red-600 group-hover:text-red-700 transition-colors duration-400 block relative z-10 drop-shadow-xs">
                      Coming Soon
                    </span>
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400"></div>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Version - Horizontal line */}
        <div className="hidden md:flex justify-center items-start gap-10 mt-12" style={{ width: '100%', maxWidth: 'none' }}>
          <div className="flex justify-center items-start gap-10" style={{ width: '1400px' }}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col items-center flex-shrink-0 group">
                {/* Circle Shape */}
                {item === 1 || item === 2 ? (
                  <a href={item === 1 ? '/lot-a' : 'http://www.wayneparking.com/'} 
                     target={item === 2 ? '_blank' : '_self'}
                     rel={item === 2 ? 'noopener noreferrer' : ''}
                     className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden border-4 border-gray-300 hover:border-blue-500 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 relative block">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src="/parking image example.jpg"
                      alt={`Location ${item}`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <span className="text-blue-900 font-bold text-sm">VIEW DETAILS</span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <button onClick={() => handleComingSoonClick(item)}
                          className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden border-4 border-gray-300 hover:border-red-500 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src="/parking image example.jpg"
                      alt={`Location ${item}`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <span className="text-red-900 font-bold text-sm">COMING SOON</span>
                      </div>
                    </div>
                  </button>
                )}
                {/* Tab Below Circle */}
                {item === 1 || item === 2 ? (
                  <a href={item === 1 ? '/lot-a' : 'http://www.wayneparking.com/'} 
                     target={item === 2 ? '_blank' : '_self'}
                     rel={item === 2 ? 'noopener noreferrer' : ''}
                     className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl px-6 py-3 text-center hover:from-blue-100 hover:to-blue-200 transition-all duration-300 cursor-pointer mt-4 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 border border-gray-300 hover:border-blue-400 block">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-blue-900 transition-colors duration-300">
                      {item === 1 ? '1102 Adams Toledo' : 'Parent Company'}
                    </span>
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </a>
                ) : (
                  <button onClick={() => handleComingSoonClick(item)}
                          className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl px-6 py-3 text-center hover:from-red-100 hover:to-red-200 transition-all duration-300 cursor-pointer mt-4 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 border border-gray-300 hover:border-red-400 w-full">
                    <span className="text-sm font-bold text-red-600 group-hover:text-red-700 transition-colors duration-300">
                      Coming Soon
                    </span>
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Coming Soon Popup Modal */}
    {showModal && (
      <>
        {/* Mobile View - Compact Modal */}
        <div className="md:hidden fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-sm transform transition-all duration-300 scale-100 mx-auto">
            {/* Mobile Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl px-4 py-3">
              <h3 className="text-lg font-bold text-white text-center">
                Coming Soon
              </h3>
            </div>
            
            {/* Mobile Modal Content */}
            <div className="px-4 py-4">
              <div className="text-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  Location {selectedLocation}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  This premium parking location is coming soon! We're working hard to bring you another convenient parking solution.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">What to Expect:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Secure parking facilities</li>
                  <li>• Competitive rates</li>
                  <li>• Easy online booking</li>
                  <li>• 24/7 support</li>
                </ul>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">
                  Stay tuned for updates!
                </p>
                <button 
                  onClick={closeModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition-colors duration-200 w-full"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View - Full Modal */}
        <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            {/* Desktop Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-6 py-4">
              <h3 className="text-xl font-bold text-white text-center">
                Coming Soon Parking Location
              </h3>
            </div>
            
            {/* Desktop Modal Content */}
            <div className="px-6 py-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-gray-700 text-lg font-medium mb-2">
                  Location {selectedLocation}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We're excited to announce that this premium parking location will be available soon! 
                  Our team is working hard to bring you another convenient parking solution with the same 
                  quality and service you expect from Detroit Parking LLC.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">What to Expect:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Secure, well-lit parking facilities</li>
                  <li>• Competitive daily and monthly rates</li>
                  <li>• Easy online booking and payment</li>
                  <li>• 24/7 customer support</li>
                </ul>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Stay tuned for updates on our grand opening!
                </p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={closeModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    Got it!
                  </button>
                  <button 
                    onClick={closeModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}
