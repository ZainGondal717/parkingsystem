"use client";
import { LayoutDashboard, Users, UserCircle, Settings, LogOut, Image as ImageIcon, MapPin, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simple client-side guard (Mocking auth for this demonstration)
  useEffect(() => {
    const isLoginPath = pathname === "/admin/login";
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!isAdmin && !isLoginPath) {
      router.push("/admin/login");
    } else {
      setIsReady(true);
    }
  }, [pathname, router]);

  // If it's the login page, don't show the sidebar/layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Prevent flicker before redirect
  if (!isReady) return null;

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Parking Lots", href: "/admin/lots", icon: MapPin },
    { label: "Book Page Banner", href: "/admin/lot-a-slider", icon: ImageIcon },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 text-center relative">
          <Link href="/admin" className="inline-flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Area
            </h2>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${pathname === item.href
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none"
                : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700/50 hover:text-blue-600"
                }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all font-bold group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="shrink-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 text-center">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Area
            </h2>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${pathname === item.href
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none"
                : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700/50 hover:text-blue-600"
                }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all font-bold group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 md:h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
            >
              <Menu className="w-6 h-6" />
              <span className="text-base font-bold text-gray-800 dark:text-white">Menu</span>
            </button>
          </div>
          <div className="flex items-center ml-auto gap-3 md:gap-4">
            <Link href="/admin/settings" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
              <Settings className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-800 sm:bg-gray-50 sm:dark:bg-gray-700/50 p-1 sm:pl-3 sm:pr-4 sm:py-2 rounded-full sm:rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm transition-all hover:border-blue-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-700 shrink-0">
                <UserCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-col hidden sm:flex">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-tighter leading-none">Admin</span>
                <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200">Zain</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 dark:bg-gray-900 p-4 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
