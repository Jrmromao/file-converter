"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"

export default function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [userPlan, setUserPlan] = useState('free')
  const [usageRemaining, setUsageRemaining] = useState(5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80">
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
              <Button size="sm">Upgrade</Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            Convert & Optimize Images for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Social Media
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Transform your images for Instagram, Facebook, Twitter, LinkedIn, and Pinterest. 
            Professional-grade tools with AI-powered optimization.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4">
              Upload Image
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4">
              Batch Process
            </Button>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Image Converter</h2>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl">📁</span>
              </div>
              <h3 className="text-xl font-bold">Upload your image</h3>
              <p className="text-gray-500">Drag & drop or click to select • PNG, JPG, WebP, AVIF</p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Choose File
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
