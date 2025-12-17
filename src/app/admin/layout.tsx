'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome,
  HiUser,
  HiCollection,
  HiBriefcase,
  HiAcademicCap,
  HiLightningBolt,
  HiCog,
  HiLogout,
  HiMenu,
  HiX,
  HiExternalLink,
} from 'react-icons/hi';
import { useCMSStore } from '@/store/cms-store';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: HiHome },
  { href: '/admin/profile', label: 'Profile', icon: HiUser },
  { href: '/admin/projects', label: 'Projects', icon: HiCollection },
  { href: '/admin/experiences', label: 'Experiences', icon: HiBriefcase },
  { href: '/admin/education', label: 'Education', icon: HiAcademicCap },
  { href: '/admin/skills', label: 'Skills', icon: HiLightningBolt },
  { href: '/admin/certificates', label: 'Certificates', icon: HiAcademicCap },
  { href: '/admin/settings', label: 'Settings', icon: HiCog },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useCMSStore();

  // Use layout effect for synchronous mount detection
  if (typeof window !== 'undefined' && !mounted) {
    // This runs during render, not in effect - safe pattern for hydration
    Promise.resolve().then(() => setMounted(true));
  }

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [mounted, isAuthenticated, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // Show nothing while checking auth
  if (!mounted) return null;

  // Login page doesn't need layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-white"
      >
        {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 z-40 transition-transform duration-300
          ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <span className="text-xl font-bold text-white">CMS Admin</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
          >
            <HiExternalLink size={20} />
            <span>View Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <HiLogout size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
