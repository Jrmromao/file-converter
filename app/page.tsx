"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

function DarkModeToggle() {
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
      aria-label="Toggle dark mode"
    >
      <div className="relative w-4 h-4">
        <Sun className="absolute inset-0 w-4 h-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 w-4 h-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      </div>
    </button>
  )
}

export default function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [userPlan, setUserPlan] = useState('free')
  const [usageRemaining, setUsageRemaining] = useState(5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-2xl">
                PNG
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Image Converter
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                {userPlan === 'free' ? `Free: ${usageRemaining}/5 today` : `${userPlan} Plan`}
              </div>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Upgrade
              </Button>
              <DarkModeToggle />
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Convert & Optimize Images for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Social Media
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transform your images for Instagram, Facebook, Twitter, LinkedIn, and Pinterest. 
            Professional-grade tools with AI-powered optimization.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              Upload Image
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105">
              Batch Process
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105">
              Creative Tools
            </Button>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 p-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Image Converter
          </h2>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-12 text-center transition-all duration-300 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/20 hover:from-blue-50/50 hover:to-indigo-50/40 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/20">
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <span className="text-white text-3xl">📁</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Upload your image</h3>
                <p className="text-gray-500 dark:text-gray-400">Drag & drop or click to select • PNG, JPG, WebP, AVIF</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Maximum file size: {userPlan === 'free' ? '10MB' : userPlan === 'pro' ? '50MB' : '200MB'}
                </p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                Choose File
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
