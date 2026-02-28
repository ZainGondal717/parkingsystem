"use client";
import { LayoutDashboard, Users, UserCircle, Settings, LogOut, Image as ImageIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
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
        <header className="h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 z-10">
          <div className="flex items-center md:hidden">
            <LayoutDashboard className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin</h2>
          </div>
          <div className="flex items-center ml-auto gap-4">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 pl-3 pr-4 py-2 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm transition-all hover:border-blue-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-700">
                <UserCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter leading-none">Admin</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Zain</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 dark:bg-gray-900 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
