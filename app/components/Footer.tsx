import Link from 'next/link'
import { Github, Heart, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-white/90 dark:bg-neutral-900/90 border-t border-gray-200 dark:border-neutral-800 mt-12 py-8 px-4 md:ml-72">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Logo and tagline */}
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">PNG Convert</span>
          <span className="ml-3 text-sm text-gray-500 dark:text-gray-400 font-normal hidden sm:inline">Fast, Secure & Powerful Image Conversion</span>
        </div>
        {/* Center: Navigation */}
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors">Features</Link>
          <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors">About</Link>
          <Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors">FAQ</Link>
          <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors">Contact</Link>
          <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors">Privacy</Link>
          <Link href="/terms-of-service" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors">Terms</Link>
        </nav>
        {/* Right: Socials */}
        <div className="flex gap-4 items-center">
          <a href="https://github.com/joaofilipe/file-converter" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="mailto:support@pngconvert.com" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-neutral-800 mt-8 pt-4" />
      <div className="mt-2 text-center text-xs text-gray-400 dark:text-gray-600">
        <span className="block mb-1">&copy; {new Date().getFullYear()} PNG Convert. Made with care for creators everywhere.</span>
        <span className="inline-block">Developed with <Heart className="inline-block align-text-bottom text-pink-500 w-4 h-4 mx-1" /> by <a href="https://x.com/jrmromao" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">J Filipe</a></span>
      </div>
    </footer>
  )
} 