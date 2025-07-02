"use client"

import Link from 'next/link'
import { Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function TopNavbar() {
  const [dark, setDark] = useState(false)
  const toggleDark = () => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark')
      setDark(!dark)
    }
  }
  const { data: session, status } = useSession()

  return (
    <nav className="w-full flex items-center justify-between px-8 py-3 bg-white/80 dark:bg-neutral-900/80 shadow-sm mb-4 sticky top-0 z-40">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">PNG Convert</span>
        </Link>
      </div>
      {/* Center: Navigation Links */}
      <div className="hidden md:flex gap-6 text-base font-medium">
        <Link href="/features" className="text-slate-700 dark:text-neutral-200 hover:text-blue-600 transition-colors">Features</Link>
        <Link href="/about" className="text-slate-700 dark:text-neutral-200 hover:text-blue-600 transition-colors">How It Works</Link>
        <Link href="/faq" className="text-slate-700 dark:text-neutral-200 hover:text-blue-600 transition-colors">FAQ</Link>
        <Link href="/pricing" className="text-slate-700 dark:text-neutral-200 hover:text-blue-600 transition-colors">Pricing</Link>
      </div>
      {/* Right: Auth/App, and Dark Mode Toggle */}
      <div className="flex items-center gap-4">
        {status === 'loading' ? null : session ? (
          <>
            <Link href="/dashboard">
              <button className="border-2 border-blue-600 text-blue-700 dark:text-blue-400 font-bold px-5 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">Go to App</button>
            </Link>
         
          </>
        ) : (
          <>
            <Link href="/auth/signup" className="hidden md:inline-block">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-full shadow transition-all duration-200 focus:ring-2 focus:ring-blue-300">Sign Up</button>
            </Link>
            <Link href="/auth/signin" className="hidden md:inline-block">
              <button className="border-2 border-blue-600 text-blue-700 dark:text-blue-400 font-bold px-5 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">Sign In</button>
            </Link>
            {/* Mobile: Only Sign Up visible for simplicity */}
            <Link href="/auth/signup" className="md:hidden">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-full shadow transition-all duration-200 focus:ring-2 focus:ring-blue-300">Sign Up</button>
            </Link>
          </>
        )}
        <button
          onClick={toggleDark}
          className="p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 shadow hover:scale-105 transition-all"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
        </button>
      </div>
    </nav>
  )
} 