'use client';

import Image from 'next/image';
import { Menu, X, Phone, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'BOOK PARKING', href: '/book-parking' },
    { name: 'LOT B', href: '/lot-b' },
    { name: 'LOT C', href: '/lot-c' },
    { name: 'LANDLORDS', href: '/landlords' },
    { name: 'ABOUT US', href: '/about-us' },
    { name: 'SIGN UP/ SIGN IN', href: '/sign-up' },
    { name: 'CONTACT US', href: '/contact-us' },
  ];

  const checkActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between h-28">
        {/* Logo - Desktop */}
        <div className="flex items-center flex-shrink-0" style={{ marginLeft: '200px' }}>
          <Link href="/" className="block">
            <Image
              src="/logo.png"
              alt="Detroit Parking LLC"
              width={180}
              height={40}
              className="h-10 w-auto hover:opacity-80 transition-opacity"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex space-x-8" style={{ marginRight: '100px' }}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-lg font-medium transition-colors ${checkActive(item.href)
                ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Admin Login Icon */}
        <div className="flex items-center" style={{ marginRight: '50px' }}>
          <Link
            href="/admin/login"
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 group relative"
            title="Admin Login"
          >
            <Shield className="w-6 h-6" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Admin Portal
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo - Mobile */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/logo.png"
                alt="Detroit Parking LLC"
                width={140}
                height={30}
                className="h-8 w-auto hover:opacity-80 transition-opacity"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Admin Icon */}
            <Link
              href="/admin/login"
              className="p-2 text-gray-600 hover:text-blue-600 rounded-md"
            >
              <Shield className="w-6 h-6" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium transition-colors ${checkActive(item.href)
                  ? 'text-gray-900 bg-gray-50 border-l-4 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
