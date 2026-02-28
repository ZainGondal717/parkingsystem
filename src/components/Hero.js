'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/home image  front.avif"
          alt="Detroit Parking Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
        {/* Mobile View */}
        <div className="md:hidden text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {/* Main Title - Mobile */}
          <h1 className="text-2xl font-normal mb-1 text-white leading-tight" style={{ 
            fontFamily: 'Playfair Display, serif', 
            letterSpacing: '0.05em',
            color: 'rgb(255, 255, 255)',
            marginBottom: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            transform: 'scale(1.05)'
          }}>
            DETROIT PARKING LLC<br />
          </h1>
          
          {/* Location Badge - Mobile */}
          <div className="text-xl font-normal mb-1 mt-4" style={{ 
            fontFamily: 'Times New Roman, serif', 
            letterSpacing: '0.15em',
            color: 'rgb(248, 217, 0)',
            textTransform: 'uppercase',
            margin: '0',
            transform: 'scale(1.08)'
          }}>
            OHIO
          </div>
          
          {/* Parking Spots Count - Mobile */}
          <div className="text-lg mb-1 text-white leading-tight mx-auto" style={{ 
            fontFamily: 'Montserrat, sans-serif', 
            letterSpacing: '0em',
            color: 'rgb(255, 255, 255)',
            maxWidth: '100%',
            marginTop: '40px',
            marginBottom: '0px',
            transform: 'scale(1.04)',
            display: 'block',
            textAlign: 'center',
            fontWeight: '100'
          }}>
            MANAGING **** PARKING SPOTS
          </div>
          
          {/* Tagline - Mobile */}
          <p className="text-base mb-0 text-white leading-tight mx-auto" style={{ 
            fontFamily: 'Montserrat, sans-serif', 
            letterSpacing: '0em',
            color: 'rgb(255, 255, 255)',
            maxWidth: '100%',
            marginTop: '0px',
            marginBottom: '0px',
            transform: 'scale(1.03)',
            display: 'block',
            textAlign: 'center',
            fontWeight: '100'
          }}>
            Your Space. Your City. Your Trust.
          </p>
        </div>

        {/* Desktop View - Unchanged */}
        <div className="hidden md:block text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-normal mb-1 text-white leading-tight" style={{ 
            fontFamily: 'Playfair Display, serif', 
            letterSpacing: '0.05em',
            color: 'rgb(255, 255, 255)',
            marginBottom: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            transform: 'scale(1.05)'
          }}>
            DETROIT PARKING   LLC<br />
          </h1>
          
          {/* Location Badge */}
          <div className="text-5xl md:text-7xl font-normal mb-1 mt-4" style={{ 
            fontFamily: 'Times New Roman, serif', 
            letterSpacing: '0.15em',
            color: 'rgb(248, 217, 0)',
            textTransform: 'uppercase',
            margin: '0',
            transform: 'scale(1.08)'
          }}>
            OHIO
          </div>
          
          {/* Parking Spots Count */}
          <div className="text-3xl md:text-4xl mb-1 text-white leading-tight mx-auto" style={{ 
            fontFamily: 'Montserrat, sans-serif', 
            letterSpacing: '0em',
            color: 'rgb(255, 255, 255)',
            maxWidth: '800px',
            marginTop: '40px',
            marginBottom: '0px',
            transform: 'scale(1.04)',
            display: 'block',
            textAlign: 'center',
            fontWeight: '100'
          }}>
            MANAGING **** PARKING SPOTS
          </div>
          
          {/* Tagline */}
          <p className="text-3xl md:text-4xl mb-0 text-white leading-tight mx-auto" style={{ 
            fontFamily: 'Montserrat, sans-serif', 
            letterSpacing: '0em',
            color: 'rgb(255, 255, 255)',
            maxWidth: '800px',
            marginTop: '0px',
            marginBottom: '0px',
            transform: 'scale(1.03)',
            display: 'block',
            textAlign: 'center',
            fontWeight: '100'
          }}>
            Your Space. Your City. Your Trust.
          </p>
        </div>
      </div>
    </section>
  );
}
