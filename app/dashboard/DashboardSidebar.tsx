"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Star, Pencil, Clock, Settings, Box, Cloud, CheckCircle, BarChart2, CreditCard, FileText, Mail, BookOpen, LogOut } from 'lucide-react';
import { SignOutButton } from './signout-button';

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
  if (email) {
    return email[0]?.toUpperCase() || '?';
  }
  return '?';
}

const navLinks = [
  { label: 'Overview', href: '/dashboard', icon: <Clock className="w-5 h-5" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  { divider: true },
  { label: 'Usage', href: '/dashboard/usage', icon: <BarChart2 className="w-5 h-5" /> },
  { label: 'Billing & Invoices', href: '/dashboard/billing', icon: <CreditCard className="w-5 h-5" /> },
  { divider: true },
  { label: 'Docs', href: '/docs', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Contact Us', href: '/contact', icon: <Mail className="w-5 h-5" /> },
];

export default function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;
  const isPro = (user as any)?.isPro;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-[calc(100vh-4rem)] fixed left-0 top-16 z-30 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 px-6 py-8 shadow-lg pt-8">
        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow">
              {getInitials(user?.name, user?.email)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-base font-semibold text-gray-900 dark:text-white">
                {user?.name || user?.email}
                <span className="sr-only">Edit profile</span>
                <Pencil className="w-4 h-4 ml-1 text-gray-400 hover:text-blue-500 cursor-pointer" />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isPro && (
                  <>
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="sr-only">Pro</span>
                  </>
                )}
                <span>{isPro ? 'Pro' : 'Free'} &middot; {user?.email}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          {navLinks.map((item, idx) =>
            item.divider ? (
              <hr key={idx} className="my-3 border-gray-200 dark:border-zinc-800" />
            ) : (
              <Link
                key={item.href || idx}
                href={item.href || '#'}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors
                  ${pathname === item.href
                    ? 'bg-gray-200 dark:bg-zinc-800 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'}
                `}
              >
                {item.icon}
                {item.label}
                {pathname === item.href && (
                  <span className="ml-auto text-xs bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded">Overview</span>
                )}
              </Link>
            )
          )}
        </nav>
        {/* Sidebar Footer */}
        <footer className="mt-auto pt-8">
          <hr className="mb-4 border-gray-200 dark:border-zinc-800" />
          <SignOutButton>
            <span className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </span>
          </SignOutButton>
        </footer>
      </aside>
      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 md:p-10 pt-8">{children}</main>
    </div>
  );
} 