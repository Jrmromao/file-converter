"use client"

import React, { useState, useEffect } from "react"
import { Upload, FileText, Download, Loader2, ArrowRight, Zap, Shield, Layers, Image, Settings, RotateCw, FlipHorizontal, FlipVertical, Droplet, Sparkles, Info, Maximize2, Moon, Sun, Instagram, Share2, Wand2, FileStack, Gauge, Palette, Camera, X, Cookie, Facebook, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FileConverterService, SUPPORTED_FORMATS } from "./services/fileConverter"
import { FILTERS } from "./constants/imageFilters"
import { fileFormats, type FileFormat } from "./components/FileFormats"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { GoogleAd } from "./components/GoogleAd"
import Head from 'next/head'

// Helper for consistent slider styling
const sliderColorClass = (color: string) => `data-[state=checked]:bg-${color}-600 [&>span:first-child]:bg-${color}-500 dark:[&>span:first-child]:bg-${color}-600 [&>span:last-child>span]:bg-white dark:[&>span:last-child>span]:bg-neutral-200 [&>span:last-child>span]:border-${color}-500 dark:[&>span:last-child>span]:border-${color}-600`

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
      className="fixed top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 z-50"
      aria-label="Toggle dark mode"
    >
      <Sun className="w-5 h-5 text-yellow-500 dark:hidden" />
      <Moon className="w-5 h-5 text-indigo-400 hidden dark:inline" />
    </button>
  )
}

const INSTAGRAM_PRESETS = {
  'square': { width: 1080, height: 1080, label: 'Square Post (1:1)' },
  'portrait': { width: 1080, height: 1350, label: 'Portrait Post (4:5)' },
  'landscape': { width: 1080, height: 566, label: 'Landscape Post (1.91:1)' },
  'story': { width: 1080, height: 1920, label: 'Story (9:16)' },
  'carousel': { width: 1080, height: 1080, label: 'Carousel Post (1:1)' },
} as const

type SocialMediaPreset = {
  width: number
  height: number
  label: string
  quality: number
}

type SocialMediaPlatform = {
  [key: string]: SocialMediaPreset
}

const SOCIAL_MEDIA_PRESETS: Record<string, SocialMediaPlatform> = {
  'instagram': {
    'square': { width: 1080, height: 1080, label: 'Square Post (1:1)', quality: 90 },
    'portrait': { width: 1080, height: 1350, label: 'Portrait Post (4:5)', quality: 90 },
    'landscape': { width: 1080, height: 566, label: 'Landscape Post (1.91:1)', quality: 90 },
    'story': { width: 1080, height: 1920, label: 'Story (9:16)', quality: 90 },
    'carousel': { width: 1080, height: 1080, label: 'Carousel Post (1:1)', quality: 90 }
  },
  'facebook': {
    'profile': { width: 170, height: 170, label: 'Profile Picture', quality: 90 },
    'cover': { width: 820, height: 312, label: 'Cover Photo', quality: 90 },
    'post': { width: 1200, height: 630, label: 'Shared Post', quality: 85 },
    'story': { width: 1080, height: 1920, label: 'Story', quality: 85 }
  },
  'twitter': {
    'profile': { width: 400, height: 400, label: 'Profile Picture', quality: 90 },
    'header': { width: 1500, height: 500, label: 'Header Photo', quality: 90 },
    'post': { width: 1200, height: 675, label: 'Post Image', quality: 85 }
  },
  'linkedin': {
    'profile': { width: 400, height: 400, label: 'Profile Picture', quality: 90 },
    'banner': { width: 1584, height: 396, label: 'Banner Image', quality: 90 },
    'post': { width: 1200, height: 627, label: 'Post Image', quality: 85 }
  },
  'pinterest': {
    'pin': { width: 1000, height: 1500, label: 'Pin Image', quality: 85 },
    'board': { width: 600, height: 600, label: 'Board Cover', quality: 90 }
  }
} as const

// Add new optimization types
type OptimizationPreset = {
  name: string
  description: string
  settings: {
    quality: number
    sharpen: number
    contrast: number
    saturation: number
    brightness: number
  }
}

const OPTIMIZATION_PRESETS: Record<string, OptimizationPreset> = {
  'web': {
    name: 'Web Optimization',
    description: 'Optimized for fast loading on websites',
    settings: {
      quality: 80,
      sharpen: 0.5,
      contrast: 5,
      saturation: 0,
      brightness: 0
    }
  },
  'print': {
    name: 'Print Quality',
    description: 'High quality for printing',
    settings: {
      quality: 100,
      sharpen: 1,
      contrast: 10,
      saturation: 5,
      brightness: 0
    }
  },
  'mobile': {
    name: 'Mobile Optimization',
    description: 'Optimized for mobile devices',
    settings: {
      quality: 85,
      sharpen: 0.3,
      contrast: 3,
      saturation: 0,
      brightness: 0
    }
  },
  'ai_enhance': {
    name: 'AI Enhancement',
    description: 'AI-powered image enhancement',
    settings: {
      quality: 90,
      sharpen: 0.8,
      contrast: 8,
      saturation: 5,
      brightness: 2
    }
  }
} as const

export default function FileConverter() {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [detectedFormat, setDetectedFormat] = useState<string>("")
  const [toFormat, setToFormat] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const [convertedFile, setConvertedFile] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showMetadata, setShowMetadata] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [imageMetadata, setImageMetadata] = useState<{
    width?: number
    height?: number
    format?: string
    size?: number
  } | null>(null)
  const [imageOptions, setImageOptions] = useState({
    quality: 80,
    width: undefined as number | undefined,
    height: undefined as number | undefined,
    rotate: 0,
    flip: false,
    flop: false,
    grayscale: false,
    blur: 0,
    sharpen: 0,
    optimize: false,
    filter: 'none' as keyof typeof FILTERS,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    preserveMetadata: false,
    progressive: false,
    lossless: false
  })
  const [instagramPreset, setInstagramPreset] = useState<keyof typeof INSTAGRAM_PRESETS | 'custom'>('custom')
  const [socialMediaPlatform, setSocialMediaPlatform] = useState<keyof typeof SOCIAL_MEDIA_PRESETS | 'custom'>('custom')
  const [socialMediaType, setSocialMediaType] = useState<string>('')
  const [selectedOptimization, setSelectedOptimization] = useState<string>('custom')
  const [batchMode, setBatchMode] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)
  const [showCookieConsent, setShowCookieConsent] = useState(false)
  const [cookieConsent, setCookieConsent] = useState<'accepted' | 'denied' | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    // Check for existing cookie consent
    const savedConsent = localStorage.getItem('cookieConsent')
    if (savedConsent) {
      setCookieConsent(savedConsent as 'accepted' | 'denied')
    } else {
      setShowCookieConsent(true)
    }
  }, [])

  const handleCookieConsent = (accepted: boolean) => {
    const consent = accepted ? 'accepted' : 'denied'
    setCookieConsent(consent)
    localStorage.setItem('cookieConsent', consent)
    setShowCookieConsent(false)

    // Update Google Analytics based on consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      if (accepted) {
        // Enable Google Analytics
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'granted'
        })
      } else {
        // Disable Google Analytics
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'denied'
        })
      }
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, JPEG, WebP, or AVIF)",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      return
    }

    setSelectedFile(file)
    setConvertedFile(null)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    const img = new window.Image()
    img.onload = () => {
      setImageMetadata({
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type.split('/')[1],
        size: file.size
      })
    }
    img.src = url

    const extension = file.name.split(".").pop()?.toLowerCase() || ""
    if (SUPPORTED_FORMATS.includes(extension as any)) {
      setDetectedFormat(extension)
    } else {
      setDetectedFormat("")
      toast({
        variant: "destructive",
        title: "Unsupported format",
        description: "Please use PNG, JPG, JPEG, WebP, or AVIF formats",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
    trackEvent("file_selected", { file_type: file.type })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleConvert = async () => {
    if (!selectedFile || !detectedFormat || !toFormat) return

    setIsConverting(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('fromFormat', detectedFormat)
      formData.append('toFormat', toFormat)
      
      Object.entries(imageOptions).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const result = await FileConverterService.convertFile(formData)
      
      if (result.success && result.data) {
        setConvertedFile(result.fileName)
        const binaryString = atob(result.data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: `image/${toFormat}` })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = result.fileName
        link.click()
        URL.revokeObjectURL(url)

        if (result.metadata) {
          const compressionInfo = result.metadata.compressionRatio 
            ? ` (${result.metadata.compressionRatio.toFixed(1)}% smaller)`
            : ''
          const sizeInfo = result.metadata.size 
            ? ` (${(result.metadata.size / 1024 / 1024).toFixed(2)}MB)`
            : ''
          toast({
            title: "Conversion successful!",
            description: `Your image has been converted${compressionInfo}${sizeInfo}`,
            action: <ToastAction altText="Download">Download</ToastAction>,
          })
        }

        trackEvent("conversion", { from: detectedFormat, to: toFormat })
      } else {
        toast({
          variant: "destructive",
          title: "Conversion failed",
          description: result.error || 'An error occurred during conversion',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (error) {
      console.error("Conversion failed:", error)
      toast({
        variant: "destructive",
        title: "Conversion failed",
        description: "An error occurred during conversion. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = "#"
    link.download = convertedFile || "converted-file"
    link.click()
  }

  const canConvert = selectedFile && detectedFormat && toFormat && detectedFormat !== toFormat

  const updatePreview = async () => {
    if (!selectedFile || !detectedFormat || !toFormat) return

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('fromFormat', detectedFormat)
      formData.append('toFormat', toFormat)
      formData.append('isPreview', 'true')
      
      Object.entries(imageOptions).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const result = await FileConverterService.convertFile(formData)
      
      if (result.success && result.data) {
        const binaryString = atob(result.data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: `image/${toFormat}` })
        
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
        
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
      }
    } catch (error) {
      console.error("Preview update failed:", error)
    }
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (selectedFile && detectedFormat && toFormat) {
      timeoutId = setTimeout(updatePreview, 300)
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [imageOptions, selectedFile, detectedFormat, toFormat])

  const trackEvent = (action: string, params: Record<string, any> = {}) => {
    if (cookieConsent === 'accepted' && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", action, params)
    }
  }

  const handleInstagramPreset = (preset: keyof typeof INSTAGRAM_PRESETS | 'custom') => {
    setInstagramPreset(preset)
    if (preset !== 'custom') {
      const dimensions = INSTAGRAM_PRESETS[preset]
      setImageOptions({
        ...imageOptions,
        width: dimensions.width,
        height: dimensions.height
      })
    }
  }

  const handleSocialMediaPreset = (platform: keyof typeof SOCIAL_MEDIA_PRESETS | 'custom', type: string) => {
    setSocialMediaPlatform(platform)
    setSocialMediaType(type)
    if (platform !== 'custom') {
      const preset = SOCIAL_MEDIA_PRESETS[platform][type as keyof typeof SOCIAL_MEDIA_PRESETS[typeof platform]]
      setImageOptions({
        ...imageOptions,
        width: preset.width,
        height: preset.height,
        quality: preset.quality,
        optimize: true,
        progressive: true
      })
    }
  }

  // Add new handler for optimization presets
  const handleOptimizationPreset = (preset: string) => {
    setSelectedOptimization(preset)
    if (preset !== 'custom' && OPTIMIZATION_PRESETS[preset]) {
      const settings = OPTIMIZATION_PRESETS[preset].settings
      setImageOptions({
        ...imageOptions,
        quality: settings.quality,
        sharpen: settings.sharpen,
        contrast: settings.contrast,
        saturation: settings.saturation,
        brightness: settings.brightness,
        optimize: true
      })
    }
  }

  // Add batch processing handler
  const handleBatchProcessing = async (files: File[]) => {
    setBatchMode(true)
    setProcessingProgress(0)
    const total = files.length

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // Process each file
      // ... existing conversion logic ...
      setProcessingProgress(((i + 1) / total) * 100)
    }

    setBatchMode(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans">
      <Head>
        <title>Image Converter & Optimizer | Convert, Resize & Optimize for Social Media</title>
        <meta name="description" content="Free online image converter and optimizer. Convert between PNG, JPG, WebP, AVIF formats. Optimize images for Instagram, Facebook, Twitter, LinkedIn, and Pinterest. Resize, compress, and enhance your images with advanced editing tools." />
        <meta name="keywords" content="image converter, image optimizer, social media image optimizer, Instagram image converter, Facebook image optimizer, Twitter image resizer, LinkedIn image converter, Pinterest image optimizer, WebP converter, AVIF converter, image compression, image resizing, photo editor" />
      </Head>

      <DarkModeToggle />
      
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-2xl mb-3">
              PNG
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <span className="inline-block bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-xs mb-3">
              Social Media Ready
            </span>
            <span className="uppercase tracking-widest text-sm text-green-600 font-semibold mb-3 block">
              Free Online Tool
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              Convert, <span className="text-blue-600 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Optimize</span> & Resize Images
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              Transform your images for <span className="font-semibold text-blue-600">Instagram</span>, <span className="font-semibold text-blue-700">Facebook</span>, <span className="font-semibold text-sky-400">Twitter</span>, <span className="font-semibold text-blue-800">LinkedIn</span>, <span className="font-semibold text-red-500">Pinterest</span>, and more. Perfect for social media posts, stories, and profiles.
            </p>
            <div className="flex justify-center md:justify-start gap-3 mt-4">
              <Instagram className="w-6 h-6 text-pink-500" />
              <Facebook className="w-6 h-6 text-blue-700" /> {/* Facebook */}
              <Twitter className="w-6 h-6 text-sky-400" /> {/* Twitter */}
              <Linkedin className="w-6 h-6 text-blue-800" /> {/* LinkedIn */}
              <Share2 className="w-6 h-6 text-red-500" /> {/* Pinterest */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Converter Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Image Converter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                    ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 
                      selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 
                      'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                  />
                  {selectedFile ? (
                    <div className="space-y-4">
                      {previewUrl && (
                        <div className="relative max-h-64 overflow-hidden rounded-lg">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-contain max-h-60 w-full rounded-lg"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowPreview(true)
                            }}
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-lg truncate">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        {detectedFormat && (
                          <Badge className="mt-2 bg-blue-600 dark:bg-blue-700">{detectedFormat.toUpperCase()}</Badge>
                        )}
                        {imageMetadata && (
                          <div className="mt-2 flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowMetadata(!showMetadata)
                              }}
                            >
                              <Info className="w-4 h-4 mr-1" />
                              {showMetadata ? 'Hide Details' : 'Show Details'}
                            </Button>
                            {showMetadata && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {imageMetadata.width} × {imageMetadata.height}px
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto" />
                      <p className="text-lg font-medium">Drop or click to upload image</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, WebP, AVIF supported</p>
                    </div>
                  )}
                </div>

                {/* Preview Dialog */}
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogContent className="max-w-4xl bg-white dark:bg-gray-800">
                    <DialogHeader>
                      <div className="flex justify-between items-center">
                        <DialogTitle>Image Preview</DialogTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a")
                            link.href = previewUrl || ""
                            link.download = selectedFile?.name || "image"
                            link.click()
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <DialogDescription>
                        {imageMetadata?.width} × {imageMetadata?.height}px • {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 max-h-[70vh] overflow-auto">
                      <img
                        src={previewUrl || ""}
                        alt="Preview"
                        className="max-w-full max-h-[65vh] object-contain rounded-lg"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Format Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Convert to</Label>
                  <Select value={toFormat} onValueChange={setToFormat}>
                    <SelectTrigger className="h-12 bg-white dark:bg-gray-700">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700">
                      {fileFormats
                        .filter((format: FileFormat) => format.value !== detectedFormat)
                        .map((format: FileFormat) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Options */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Settings className="w-4 h-4" />
                  {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                </Button>

                {showAdvanced && (
                  <div className="space-y-8 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-md">
                    {/* Quality and Rotation */}
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Quality: <span className="text-blue-600">{imageOptions.quality}%</span></Label>
                        <Slider
                          value={[imageOptions.quality]}
                          onValueChange={(value) => setImageOptions({ ...imageOptions, quality: value[0] })}
                          min={1}
                          max={100}
                          step={1}
                          className="accent-blue-500"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Rotation: <span className="text-blue-600">{imageOptions.rotate}°</span></Label>
                        <Slider
                          value={[imageOptions.rotate]}
                          onValueChange={(value) => setImageOptions({ ...imageOptions, rotate: value[0] })}
                          min={0}
                          max={360}
                          step={90}
                          className="accent-blue-500"
                        />
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Maximize2 className="w-5 h-5 text-blue-500" />Dimensions</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm">Width (px)</Label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
                            value={imageOptions.width || ''}
                            onChange={(e) => {
                              setInstagramPreset('custom')
                              setImageOptions({ ...imageOptions, width: e.target.value ? parseInt(e.target.value) : undefined })
                            }}
                            placeholder="Original width"
                            min={1}
                            max={8000}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Height (px)</Label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
                            value={imageOptions.height || ''}
                            onChange={(e) => {
                              setInstagramPreset('custom')
                              setImageOptions({ ...imageOptions, height: e.target.value ? parseInt(e.target.value) : undefined })
                            }}
                            placeholder="Original height"
                            min={1}
                            max={8000}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Color Adjustments */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Palette className="w-5 h-5 text-purple-500" />Color Adjustments</h3>
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-sm">Brightness: <span className="text-purple-600">{imageOptions.brightness}%</span></Label>
                          <Slider
                            value={[imageOptions.brightness]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, brightness: value[0] })}
                            min={-100}
                            max={100}
                            step={1}
                            className="accent-purple-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Contrast: <span className="text-purple-600">{imageOptions.contrast}%</span></Label>
                          <Slider
                            value={[imageOptions.contrast]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, contrast: value[0] })}
                            min={-100}
                            max={100}
                            step={1}
                            className="accent-purple-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Saturation: <span className="text-purple-600">{imageOptions.saturation}%</span></Label>
                          <Slider
                            value={[imageOptions.saturation]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, saturation: value[0] })}
                            min={-100}
                            max={100}
                            step={1}
                            className="accent-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-yellow-500" />Filters</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {Object.entries(FILTERS).map(([key]) => (
                          <Button
                            key={key}
                            variant={imageOptions.filter === key ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageOptions({ ...imageOptions, filter: key as keyof typeof FILTERS })}
                            className={imageOptions.filter === key ? 'bg-blue-600 dark:bg-blue-700' : ''}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Effects & Optimizations */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-teal-500" />Effects & Optimizations</h3>
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Button
                            variant={imageOptions.grayscale ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageOptions({ ...imageOptions, grayscale: !imageOptions.grayscale })}
                            className={imageOptions.grayscale ? 'bg-blue-600 dark:bg-blue-700' : ''}
                          >
                            <Droplet className="w-4 h-4 mr-2" />
                            Grayscale
                          </Button>
                          <Button
                            variant={imageOptions.optimize ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageOptions({ ...imageOptions, optimize: !imageOptions.optimize })}
                            className={imageOptions.optimize ? 'bg-blue-600 dark:bg-blue-700' : ''}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Optimize
                          </Button>
                        </div>
                        <div>
                          <Label className="text-sm">Blur: <span className="text-teal-600">{imageOptions.blur.toFixed(1)}</span></Label>
                          <Slider
                            value={[imageOptions.blur]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, blur: value[0] })}
                            min={0}
                            max={10}
                            step={0.1}
                            className="accent-teal-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Sharpen: <span className="text-teal-600">{imageOptions.sharpen.toFixed(1)}</span></Label>
                          <Slider
                            value={[imageOptions.sharpen]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, sharpen: value[0] })}
                            min={0}
                            max={10}
                            step={0.1}
                            className="accent-teal-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Format Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Settings className="w-5 h-5 text-blue-500" />Format Options</h3>
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-2">
                          <Switch
                            id="preserve-metadata"
                            checked={imageOptions.preserveMetadata}
                            onCheckedChange={(checked) => setImageOptions({ ...imageOptions, preserveMetadata: checked })}
                          />
                          <Label htmlFor="preserve-metadata">Preserve Metadata</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="progressive"
                            checked={imageOptions.progressive}
                            onCheckedChange={(checked) => setImageOptions({ ...imageOptions, progressive: checked })}
                          />
                          <Label htmlFor="progressive">Progressive Loading</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="lossless"
                            checked={imageOptions.lossless}
                            onCheckedChange={(checked) => setImageOptions({ ...imageOptions, lossless: checked })}
                          />
                          <Label htmlFor="lossless">Lossless Compression</Label>
                        </div>
                      </div>
                    </div>

                    {/* Social Media Optimization */}
                    <div className="space-y-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Share2 className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold">Social Media Optimization</h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium">Platform</Label>
                          <Select 
                            value={socialMediaPlatform} 
                            onValueChange={(value) => {
                              setSocialMediaPlatform(value as keyof typeof SOCIAL_MEDIA_PRESETS | 'custom')
                              setSocialMediaType('')
                            }}
                          >
                            <SelectTrigger className="h-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-700">
                              <SelectItem value="custom">Custom</SelectItem>
                              <SelectItem value="instagram">
                                <div className="flex items-center gap-2">
                                  <Instagram className="w-4 h-4" />
                                  Instagram
                                </div>
                              </SelectItem>
                              {Object.keys(SOCIAL_MEDIA_PRESETS)
                                .filter(platform => platform !== 'instagram')
                                .map((platform) => (
                                  <SelectItem key={platform} value={platform}>
                                    <div className="flex items-center gap-2">
                                      {platform === 'facebook' ? <Share2 className="w-4 h-4" /> :
                                       platform === 'twitter' ? <Share2 className="w-4 h-4" /> :
                                       platform === 'linkedin' ? <Share2 className="w-4 h-4" /> :
                                       platform === 'pinterest' ? <Share2 className="w-4 h-4" /> :
                                       <Share2 className="w-4 h-4" />}
                                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                    </div>
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {socialMediaPlatform && socialMediaPlatform !== 'custom' && (
                          <div>
                            <Label className="text-sm font-medium">Type</Label>
                            <Select 
                              value={socialMediaType} 
                              onValueChange={(value) => handleSocialMediaPreset(socialMediaPlatform, value)}
                            >
                              <SelectTrigger className="h-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-700">
                                {Object.entries(SOCIAL_MEDIA_PRESETS[socialMediaPlatform]).map(([type, preset]) => (
                                  <SelectItem key={type} value={type}>
                                    {preset.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {socialMediaPlatform && socialMediaPlatform !== 'custom' && socialMediaType && (
                        <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-lg mt-2">
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="font-medium">Optimization Tips</p>
                              <ul className="text-sm text-gray-700 dark:text-gray-200 mt-1 space-y-1">
                                <li>• Image quality optimized for {socialMediaPlatform}</li>
                                <li>• Progressive loading enabled for faster display</li>
                                <li>• Automatic compression applied</li>
                                <li>• Dimensions set to recommended size</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Convert Button */}
                <Button
                  onClick={handleConvert}
                  disabled={!canConvert || isConverting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      Convert Image
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Conversion Result */}
                {convertedFile && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium">Conversion Complete!</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{convertedFile}</p>
                      </div>
                    </div>
                    <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  <div>
                    <p className="font-medium">Fast Conversion</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Convert images in seconds with high quality.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Share2 className="w-6 h-6 text-green-500 dark:text-green-400" />
                  <div>
                    <p className="font-medium">Social Media Ready</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Optimize for Instagram, Facebook, Twitter, LinkedIn & Pinterest with perfect dimensions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                  <div>
                    <p className="font-medium">Secure Processing</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Files are processed securely and not stored.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Layers className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <p className="font-medium">Advanced Tools</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Resize, rotate, apply filters, and enhance quality.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                  <div>
                    <p className="font-medium">Smart Optimization</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatic compression and quality optimization.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wand2 className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                  <div>
                    <p className="font-medium">AI Enhancement</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Smart image enhancement and optimization.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileStack className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <p className="font-medium">Batch Processing</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Convert and optimize multiple images at once.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <GoogleAd
              adClient="ca-pub-1009479093659621"
              adSlot="8774727539"
              style={{ display: "block", width: "100%", maxWidth: "300px", minHeight: "250px", borderRadius: "0.75rem", overflow: "hidden" }}
              className="rounded-xl"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a>
          <a href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact Us</a>
          <a href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About</a>
          <a href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400">FAQ</a>
        </div>
        <p>© {new Date().getFullYear()} Image Converter. All rights reserved.</p>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50" style={{boxShadow: '0 -2px 8px rgba(0,0,0,0.04)'}}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2 min-w-0">
              <span className="truncate">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. Please read our
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline ml-1">Privacy Policy</a>
                for more information.
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                className="text-gray-700 dark:text-gray-200 hover:underline px-2 py-1 h-auto focus-visible:ring-2 focus-visible:ring-green-600"
                onClick={() => setShowCookieConsent(false)}
                aria-label="Manage cookie preferences"
              >
                Manage preferences
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600 px-4 py-2 h-auto focus-visible:ring-2 focus-visible:ring-green-600"
                onClick={() => handleCookieConsent(false)}
                aria-label="Decline all cookies"
              >
                Decline all
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 h-auto font-semibold shadow focus-visible:ring-2 focus-visible:ring-green-600"
                onClick={() => handleCookieConsent(true)}
                aria-label="Accept all cookies"
              >
                Accept all
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Dialog */}
      <Dialog open={!showCookieConsent && cookieConsent === null} onOpenChange={setShowCookieConsent}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              Cookie Settings
            </DialogTitle>
            <DialogDescription>
              We use cookies to improve your experience on our website. You can choose which cookies to accept.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics Cookies</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help us understand how visitors interact with our website
                </p>
              </div>
              <Switch
                id="analytics-cookies"
                checked={cookieConsent === 'accepted'}
                onCheckedChange={(checked) => handleCookieConsent(checked)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleCookieConsent(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Decline All
              </Button>
              <Button
                onClick={() => handleCookieConsent(true)}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              >
                Accept All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}