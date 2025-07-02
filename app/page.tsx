"use client"

import React, { useState, useEffect, useRef } from "react"
import { Upload, FileText, Download, Loader2, ArrowRight, Zap, Shield, Layers, Image, Settings, RotateCw, FlipHorizontal, FlipVertical, Droplet, Sparkles, Info, Maximize2, Moon, Sun, Instagram, Share2, Wand2, FileStack, Gauge, Palette, Camera, X, Cookie, Facebook, Twitter, Linkedin, Github, Globe, Printer, Smartphone, Bell, Calendar } from "lucide-react"
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
import { GoogleAdClient } from "@/components/GoogleAdClient"
import Head from 'next/head'
import { motion } from "framer-motion"
import { subscribeToUpdates } from './actions/subscribe'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
// import { GoogleAd } from './components/GoogleAd'

// Helper for consistent slider styling
const sliderColorClass = (color: string, darkColor?: string) =>
  `data-[state=checked]:bg-${color}-600 [&>span:first-child]:bg-${color}-500 dark:[&>span:first-child]:bg-${darkColor || color}-600 [&>span:last-child>span]:bg-white dark:[&>span:last-child>span]:bg-neutral-200 [&>span:last-child>span]:border-${color}-500 dark:[&>span:last-child>span]:border-${darkColor || color}-600`

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

// Add SVG pattern and illustration components
const HeroPattern = () => (
  <svg className="absolute inset-0 w-full h-full z-0" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e7ef" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
)

const HeroIllustration = () => (
  <svg className="absolute right-0 top-0 w-64 h-64 md:w-[420px] md:h-[420px] z-10 pointer-events-none parallax-hero" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="210" cy="210" r="180" fill="url(#paint0_radial)" fillOpacity="0.18" />
    <ellipse cx="120" cy="320" rx="60" ry="18" fill="#a5b4fc" fillOpacity="0.12" />
    <ellipse cx="320" cy="120" rx="40" ry="12" fill="#818cf8" fillOpacity="0.10" />
    <defs>
      <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(210 210) scale(180)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#818cf8" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

export default function FileConverter() {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [detectedFormat, setDetectedFormat] = useState<string>("")
  const [toFormat, setToFormat] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const [convertedFile, setConvertedFile] = useState<string | null>(null)
  const [convertedFileData, setConvertedFileData] = useState<string | null>(null)
  const [convertedFileType, setConvertedFileType] = useState<string | null>(null)
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
    temperature: 0,
    tint: 0,
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
  const [mode, setMode] = useState<'convert' | 'optimize'>('convert')
  const uploadAreaRef = useRef<HTMLDivElement>(null)

  // Add new state for advanced cookie preferences
  const [showCookieSettings, setShowCookieSettings] = useState(false)
  const [analyticsConsent, setAnalyticsConsent] = useState(cookieConsent === 'accepted')
  const [adsConsent, setAdsConsent] = useState(cookieConsent === 'accepted')

  // 1. Add a loading state and error state for preview
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)

  // Add new state for Coming Soon modal
  const [showComingSoon, setShowComingSoon] = useState(false)

  // Add new state for subscription
  const [email, setEmail] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // Add new state for subscription dialog
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false)

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

  const handleConvert = async (optimize: boolean = false) => {
    if (!selectedFile || !detectedFormat) return

    // In optimize mode, use detectedFormat if toFormat is not set
    const targetFormat = optimize ? (toFormat || detectedFormat) : toFormat

    // If in convert mode and no toFormat, return
    if (!optimize && !toFormat) return

    setIsConverting(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('fromFormat', detectedFormat)
      formData.append('toFormat', targetFormat)
      formData.append('optimize', optimize.toString())
      
      // Always pass quality and other optimization parameters
      formData.append('quality', imageOptions.quality.toString())
      formData.append('progressive', imageOptions.progressive.toString())
      formData.append('preserveMetadata', imageOptions.preserveMetadata.toString())
      formData.append('lossless', imageOptions.lossless.toString())
      
      // Pass other image options
      Object.entries(imageOptions).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      // Pass social media platform if selected
      if (socialMediaPlatform !== 'custom') {
        formData.append('socialMediaPlatform', socialMediaPlatform)
        formData.append('socialMediaType', socialMediaType)
      }

      const result = await FileConverterService.convertFile(formData)
      
      if (result.success && result.data) {
        setConvertedFile(result.fileName)
        setConvertedFileData(result.data)
        setConvertedFileType(targetFormat)
        // Convert base64 to Uint8Array
        const binaryString = atob(result.data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        // Use the correct MIME type
        const mimeType = `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`
        const blob = new Blob([bytes], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = result.fileName
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          URL.revokeObjectURL(url)
          document.body.removeChild(link)
        }, 1000)

        if (result.metadata) {
          const compressionInfo = result.metadata.compressionRatio 
            ? ` (${result.metadata.compressionRatio.toFixed(1)}% smaller)`
            : ''
          const sizeInfo = result.metadata.size 
            ? ` (${(result.metadata.size / 1024 / 1024).toFixed(2)}MB)`
            : ''
          toast({
            title: optimize ? "Optimization successful!" : "Conversion successful!",
            description: `Your image has been ${optimize ? 'optimized' : 'converted'}${compressionInfo}${sizeInfo}`,
            action: <ToastAction altText="Download">Download</ToastAction>,
          })
        }

        trackEvent(optimize ? "optimization" : "conversion", { from: detectedFormat, to: targetFormat })
      } else {
        toast({
          variant: "destructive",
          title: optimize ? "Optimization failed" : "Conversion failed",
          description: result.error || `An error occurred during ${optimize ? 'optimization' : 'conversion'}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (error) {
      console.error(optimize ? "Optimization failed:" : "Conversion failed:", error)
      toast({
        variant: "destructive",
        title: optimize ? "Optimization failed" : "Conversion failed",
        description: `An error occurred during ${optimize ? 'optimization' : 'conversion'}. Please try again.`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!convertedFileData || !convertedFileType || !convertedFile) return
    const binaryString = atob(convertedFileData)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const mimeType = `image/${convertedFileType === 'jpg' ? 'jpeg' : convertedFileType}`
    const blob = new Blob([bytes], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = convertedFile
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      URL.revokeObjectURL(url)
      document.body.removeChild(link)
    }, 1000)
  }

  const canConvert = selectedFile && detectedFormat && toFormat && detectedFormat !== toFormat

  const updatePreview = async () => {
    if (!selectedFile || !detectedFormat) return

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('fromFormat', detectedFormat)
      // For preview, we'll use the same format as input
      formData.append('toFormat', toFormat || detectedFormat)
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
        const blob = new Blob([bytes], { type: `image/${toFormat || detectedFormat}` })
        
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
    if (selectedFile && detectedFormat) {
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
        progressive: true,
        // Add platform-specific optimizations
        sharpen: platform === 'instagram' ? 0.5 : 0.3, // Instagram needs slightly sharper images
        contrast: platform === 'facebook' ? 5 : 3, // Facebook needs slightly more contrast
        saturation: platform === 'twitter' ? 5 : 0, // Twitter images look better with more saturation
        brightness: 0,
        preserveMetadata: true, // Keep metadata for social media
        lossless: false // Use lossy compression for better file size
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

  // 2. Update the Preview button logic to always trigger updatePreview before opening dialog
  const handleShowPreview = async () => {
    if (!selectedFile || !detectedFormat || !toFormat) return
    setIsPreviewLoading(true)
    setPreviewError(null)
    try {
      await updatePreview()
      setShowPreview(true)
    } catch (err) {
      setPreviewError("Failed to generate preview. Please try again.")
      setShowPreview(false)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  // Add subscription handler
  const handleSubscribe = async () => {
    if (!email) {
      setSubscriptionStatus({
        type: 'error',
        message: 'Please enter your email address.'
      })
      return
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setSubscriptionStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      })
      return
    }

    setIsSubscribing(true)
    const result = await subscribeToUpdates(email, selectedInterests)
    
    if (result.success) {
      setSubscriptionStatus({
        type: 'success',
        message: result.message || 'Successfully subscribed to updates!'
      })
      setEmail('')
      setSelectedInterests([])
    } else {
      setSubscriptionStatus({
        type: 'error',
        message: result.error || 'Failed to subscribe. Please try again.'
      })
    }
    setIsSubscribing(false)
  }

  // Animation variants for fade-in
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  }

  // Parallax effect for hero illustration
  React.useEffect(() => {
    const handleScroll = () => {
      const el = document.querySelector('.parallax-hero')
      if (el) {
        const scrollY = window.scrollY
        el.setAttribute('style', `transform: translateY(${scrollY * 0.08}px)`)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
        <Head>
          <title>Image Converter & Optimizer | Convert, Resize & Optimize for Social Media</title>
          <meta name="description" content="Free online image converter and optimizer. Convert between PNG, JPG, WebP, AVIF formats. Optimize images for Instagram, Facebook, Twitter, LinkedIn, and Pinterest. Resize, compress, and enhance your images with advanced editing tools." />
          <meta name="keywords" content="image converter, image optimizer, social media image optimizer, Instagram image converter, Facebook image optimizer, Twitter image resizer, LinkedIn image converter, Pinterest image optimizer, WebP converter, AVIF converter, image compression, image resizing, photo editor" />
        {/* Open Graph & Twitter Card */}
        <meta property="og:title" content="Image Converter & Optimizer | Convert, Resize & Optimize for Social Media" />
        <meta property="og:description" content="Free online image converter and optimizer. Convert between PNG, JPG, WebP, AVIF formats. Optimize images for Instagram, Facebook, Twitter, LinkedIn, and Pinterest." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pngconvert.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Image Converter & Optimizer | Convert, Resize & Optimize for Social Media" />
        <meta name="twitter:description" content="Free online image converter and optimizer. Convert between PNG, JPG, WebP, AVIF formats. Optimize images for Instagram, Facebook, Twitter, LinkedIn, and Pinterest." />
        <meta name="twitter:image" content="/twitter-image.png" />
        </Head>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans overflow-x-hidden">
        {/* SVG Pattern Background */}
        <HeroPattern />
        <main className="relative z-10">
        {/* Hero Section */}
        <motion.section
            aria-label="Hero"
            className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 min-h-[60vh]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            {/* Left: Main Content */}
            <div className="flex-1 flex flex-col items-center md:items-start justify-center z-10">
              {/* Auth Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-200 focus:ring-4 focus:ring-blue-300">
                  <Upload className="w-5 h-5 mr-2" />
                  Start Converting Free
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-700 dark:text-blue-400 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 focus:ring-4 focus:ring-blue-200">
                  <FileStack className="w-5 h-5 mr-2" />
                  Batch Process
                </Button>
              </div>
            
              <div className="bg-white/80 dark:bg-neutral-900/60 border border-white/10 dark:border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-14 max-w-5xl min-w-[380px] sm:min-w-[520px] md:min-w-[800px] lg:min-w-[900px] w-full mx-auto text-center md:text-left">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-xl">
                  Convert & Optimize Images for{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-move">Social Media</span>
                </h1>
                <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-xl mb-6 font-medium mx-auto md:mx-0">
                  Transform your images for Instagram, Facebook, Twitter, LinkedIn, and Pinterest. Perfect for posts, stories, and profiles.
                </p>
                <p className="text-lg text-blue-700 dark:text-blue-300 mb-10 font-semibold">No sign-up required. 100% privacy. Start converting in seconds!</p>
              <div className="flex justify-center md:justify-start gap-4 mt-8">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span className="text-sm">Instagram</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Facebook</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Twitter className="w-5 h-5 text-sky-400" />
                  <span className="text-sm">Twitter</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                  <span className="text-sm">LinkedIn</span>
                </div>
              </div>
            </div>
          </div>
            {/* Right: SVG Illustration (desktop), below on mobile */}
            <div className="flex-1 flex items-center justify-center w-full md:w-auto mt-12 md:mt-0">
              <HeroIllustration />
            </div>
        </motion.section>

          {/* Divider */}
          <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 my-12" />

          {/* Feature Highlights Section */}
          <motion.section
            aria-label="Features"
            className="max-w-5xl mx-auto px-4 py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-extrabold text-center mb-12 tracking-tight">Why Choose PNG Convert?</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-transform hover:scale-105 group">
                <Zap className="w-12 h-12 text-blue-600 mb-3 group-hover:scale-125 group-hover:text-blue-400 transition-all duration-300 animate-bounce-slow" />
                <h3 className="font-semibold text-xl mb-2">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base">Convert and optimize images in seconds with our high-performance cloud engine.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-transform hover:scale-105 group">
                <Shield className="w-12 h-12 text-green-600 mb-3 group-hover:scale-125 group-hover:text-green-400 transition-all duration-300 animate-bounce-slow" />
                <h3 className="font-semibold text-xl mb-2">Secure & Private</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base">Your files are processed securely and deleted after conversion. We value your privacy.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-transform hover:scale-105 group">
                <Sparkles className="w-12 h-12 text-purple-600 mb-3 group-hover:scale-125 group-hover:text-purple-400 transition-all duration-300 animate-bounce-slow" />
                <h3 className="font-semibold text-xl mb-2">AI-Powered</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base">Enhance your images with smart AI filters and optimizations for every platform.</p>
              </div>
            </div>
          </motion.section>

          {/* Divider */}
          <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 my-12" />

          {/* Testimonials Section */}
          <motion.section
            aria-label="Testimonials"
            className="max-w-4xl mx-auto px-4 py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-extrabold text-center mb-12 tracking-tight">What Our Users Say</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <blockquote className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Alex avatar" className="w-14 h-14 rounded-full mb-3 border-2 border-blue-500 shadow" />
                <p className="text-lg font-medium mb-2">"PNG Convert is a game changer for my social media workflow. So easy and fast!"</p>
                <footer className="text-sm text-gray-500">— Alex, Social Media Manager</footer>
              </blockquote>
              <blockquote className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Priya avatar" className="w-14 h-14 rounded-full mb-3 border-2 border-purple-500 shadow" />
                <p className="text-lg font-medium mb-2">"I love the privacy-first approach. My images are never stored. Highly recommended!"</p>
                <footer className="text-sm text-gray-500">— Priya, Designer</footer>
              </blockquote>
            </div>
          </motion.section>

          {/* Divider */}
          <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 my-12" />

          {/* FAQ Section */}
          <motion.section
            aria-label="FAQ"
            className="max-w-3xl mx-auto px-4 py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            <div className="bg-white/90 dark:bg-neutral-900/90 rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-extrabold text-center mb-12 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Is PNG Convert free to use?</h3>
                  <p className="text-gray-600 dark:text-gray-300">Yes! All basic features are free and always will be. Pro features are available for power users.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Do you store my images?</h3>
                  <p className="text-gray-600 dark:text-gray-300">No. Your images are processed securely and deleted after conversion.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">What formats are supported?</h3>
                  <p className="text-gray-600 dark:text-gray-300">PNG, JPG, JPEG, WebP, and AVIF. More formats coming soon!</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Can I use it on mobile?</h3>
                  <p className="text-gray-600 dark:text-gray-300">Absolutely! PNG Convert is fully responsive and works great on any device.</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Divider */}
          <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 my-12" />

          {/* Newsletter Signup Section */}
          <motion.section
            aria-label="Newsletter"
            className="max-w-xl mx-auto px-4 py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-2xl font-extrabold text-center mb-6 tracking-tight">Stay Updated</h2>
            <p className="text-center text-blue-700 dark:text-blue-300 mb-8 text-lg font-semibold">Join 1,000+ creators getting free tips & feature updates. No spam, ever.</p>
            <form className="flex flex-col sm:flex-row gap-4 items-center justify-center" onSubmit={e => { e.preventDefault(); handleSubscribe(); }}>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full sm:w-auto rounded-full px-6 py-3 text-base focus:ring-4 focus:ring-blue-200"
                required
                aria-label="Email address"
              />
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full text-base font-bold shadow-lg transition-all duration-200 focus:ring-4 focus:ring-blue-300">
                Subscribe Free
              </Button>
            </form>
            {subscriptionStatus.type && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                subscriptionStatus.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              }`}>
                {subscriptionStatus.message}
              </div>
            )}
          </motion.section>

          {/* Divider */}
          <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 my-12" />

          {/* Main Content (Converter, etc.) */}
          <section aria-label="Image Converter" className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Converter Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-2"
            >
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-semibold">Image Converter</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {showAdvanced ? 'Hide Options' : 'Show Options'}
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={handleShowPreview}
                        disabled={isPreviewLoading || !selectedFile || !toFormat}
                      >
                        <Maximize2 className="w-4 h-4 mr-2" />
                        {isPreviewLoading ? 'Loading...' : 'Preview'}
                      </Button> */}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Mode Selection */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 mb-2">
                      <button
                        className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                          mode === 'convert'
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setMode('convert')}
                        type="button"
                        aria-pressed={mode === 'convert'}
                      >
                        <FileText className="w-4 h-4 mr-2 inline" />
                        Convert
                      </button>
                      <button
                        className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                          mode === 'optimize'
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setMode('optimize')}
                        type="button"
                        aria-pressed={mode === 'optimize'}
                      >
                        <Sparkles className="w-4 h-4 mr-2 inline" />
                        Optimize
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                      {mode === 'convert'
                        ? 'Convert your image to a new format and optimize it for web or social media.'
                        : 'Optimize your image for web or social media without changing its format.'}
                    </p>
                  </div>

                  {/* File Upload Area */}
                  <motion.div
                    ref={uploadAreaRef}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                      ${isDragOver 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-[1.02]' 
                        : selectedFile 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
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
                          <div className="relative max-h-64 overflow-hidden rounded-lg group">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="object-contain max-h-60 w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowPreview(true)
                                }}
                              >
                                <Maximize2 className="w-4 h-4 mr-2" />
                                View Full Size
                              </Button>
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-lg truncate">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {detectedFormat && (
                            <Badge className="mt-2 bg-blue-600 dark:bg-blue-700">
                              {detectedFormat.toUpperCase()}
                            </Badge>
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
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">Drop your image here</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            or click to browse files
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Supports PNG, JPG, WebP, AVIF
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* Format Selection */}
                  {mode === 'convert' && (
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
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded text-xs font-bold">
                                    {format.value.toUpperCase()}
                                  </span>
                                  {format.label}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {showAdvanced && (
                      <div className="space-y-8 p-6 bg-white/80 dark:bg-neutral-900/60 border border-white/10 dark:border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-14 max-w-4xl min-w-[380px] sm:min-w-[520px] md:min-w-[640px] w-full mx-auto text-center md:text-left">
                      {/* Quick Presets */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-purple-500" />
                            Quick Presets
                          </h3>
                          <Select value={selectedOptimization} onValueChange={handleOptimizationPreset}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select preset" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="custom">Custom</SelectItem>
                              {Object.entries(OPTIMIZATION_PRESETS).map(([key, preset]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    {key === 'web' ? <Globe className="w-4 h-4" /> :
                                     key === 'print' ? <Printer className="w-4 h-4" /> :
                                     key === 'mobile' ? <Smartphone className="w-4 h-4" /> :
                                     key === 'ai_enhance' ? <Sparkles className="w-4 h-4" /> :
                                     <Settings className="w-4 h-4" />}
                                    {preset.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {selectedOptimization !== 'custom' && (
                          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              {OPTIMIZATION_PRESETS[selectedOptimization].description}
                            </p>
                          </div>
                        )}
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
                                    <Instagram className="w-4 h-4 text-pink-500" />
                                    Instagram
                                  </div>
                                </SelectItem>
                                <SelectItem value="facebook">
                                  <div className="flex items-center gap-2">
                                    <Facebook className="w-4 h-4 text-blue-600" />
                                    Facebook
                                  </div>
                                </SelectItem>
                                <SelectItem value="twitter">
                                  <div className="flex items-center gap-2">
                                    <Twitter className="w-4 h-4 text-sky-400" />
                                    Twitter
                                  </div>
                                </SelectItem>
                                <SelectItem value="linkedin">
                                  <div className="flex items-center gap-2">
                                    <Linkedin className="w-4 h-4 text-blue-700" />
                                    LinkedIn
                                  </div>
                                </SelectItem>
                                <SelectItem value="pinterest">
                                  <div className="flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-red-500" />
                                    Pinterest
                                  </div>
                                </SelectItem>
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
                                      <div className="flex items-center gap-3">
                                        <span className="min-w-[64px] px-2 h-7 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded text-xs font-bold text-gray-700 dark:text-gray-200">
                                          {preset.width}×{preset.height}
                                        </span>
                                        <span className="whitespace-nowrap">{preset.label}</span>
                                      </div>
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

                      {/* Image Adjustments */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Palette className="w-5 h-5 text-purple-500" />
                          Image Adjustments
                        </h3>
                        
                        {/* Quality and Rotation */}
                        <div className="grid sm:grid-cols-2 gap-8">
                          <div>
                            <Label className="text-sm font-semibold mb-2 block">
                              Quality: <span className="text-blue-600">{imageOptions.quality}%</span>
                            </Label>
                            <Slider
                              value={[imageOptions.quality]}
                              onValueChange={(value) => setImageOptions({ ...imageOptions, quality: value[0] })}
                              min={1}
                              max={100}
                              step={1}
                              className={sliderColorClass('blue')}
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-2 block">
                              Rotation: <span className="text-blue-600">{imageOptions.rotate}°</span>
                            </Label>
                            <Slider
                              value={[imageOptions.rotate]}
                              onValueChange={(value) => setImageOptions({ ...imageOptions, rotate: value[0] })}
                              min={0}
                              max={360}
                              step={90}
                              className={sliderColorClass('blue')}
                            />
                          </div>
                        </div>

                        {/* Dimensions */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">Dimensions</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (imageMetadata) {
                                  setImageOptions({
                                    ...imageOptions,
                                    width: imageMetadata.width,
                                    height: imageMetadata.height
                                  })
                                }
                              }}
                            >
                              <RotateCw className="w-4 h-4 mr-2" />
                              Reset to Original
                            </Button>
                          </div>
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
                          <h4 className="text-sm font-semibold">Color Adjustments</h4>
                          <div className="grid sm:grid-cols-3 gap-6">
                            <div>
                              <Label className="text-sm">
                                Brightness: <span className="text-purple-600">{imageOptions.brightness}%</span>
                              </Label>
                              <Slider
                                value={[imageOptions.brightness]}
                                onValueChange={(value) => setImageOptions({ ...imageOptions, brightness: value[0] })}
                                min={-100}
                                max={100}
                                step={1}
                                className={sliderColorClass('purple')}
                              />
                            </div>
                            <div>
                              <Label className="text-sm">
                                Contrast: <span className="text-purple-600">{imageOptions.contrast}%</span>
                              </Label>
                              <Slider
                                value={[imageOptions.contrast]}
                                onValueChange={(value) => setImageOptions({ ...imageOptions, contrast: value[0] })}
                                min={-100}
                                max={100}
                                step={1}
                                className={sliderColorClass('purple', 'blue')}
                              />
                            </div>
                            <div>
                              <Label className="text-sm">
                                Saturation: <span className="text-purple-600">{imageOptions.saturation}%</span>
                              </Label>
                              <Slider
                                value={[imageOptions.saturation]}
                                onValueChange={(value) => setImageOptions({ ...imageOptions, saturation: value[0] })}
                                min={-100}
                                max={100}
                                step={1}
                                className={sliderColorClass('purple')}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Effects */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold">Effects</h4>
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-sm">
                                Blur: <span className="text-teal-600">{imageOptions.blur.toFixed(1)}</span>
                              </Label>
                              <Slider
                                value={[imageOptions.blur]}
                                onValueChange={(value) => setImageOptions({ ...imageOptions, blur: value[0] })}
                                min={0}
                                max={10}
                                step={0.1}
                                className={sliderColorClass('teal')}
                              />
                            </div>
                            <div>
                              <Label className="text-sm">
                                Sharpen: <span className="text-teal-600">{imageOptions.sharpen.toFixed(1)}</span>
                              </Label>
                              <Slider
                                value={[imageOptions.sharpen]}
                                onValueChange={(value) => setImageOptions({ ...imageOptions, sharpen: value[0] })}
                                min={0}
                                max={10}
                                step={0.1}
                                className={sliderColorClass('teal')}
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant={imageOptions.grayscale ? "default" : "outline"}
                              size="sm"
                              onClick={() => setImageOptions({ ...imageOptions, grayscale: !imageOptions.grayscale })}
                              className={
                                imageOptions.grayscale
                                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                                  : 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
                              }
                            >
                              <Droplet className="w-4 h-4 mr-2" />
                              Grayscale
                            </Button>
                            <Button
                              variant={imageOptions.optimize ? "default" : "outline"}
                              size="sm"
                              onClick={() => setImageOptions({ ...imageOptions, optimize: !imageOptions.optimize })}
                              className={
                                imageOptions.optimize
                                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                                  : 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
                              }
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Optimize
                            </Button>
                          </div>
                        </div>

                        {/* New Creative Tools Section */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Wand2 className="w-4 h-4 text-purple-500" />
                            Creative Tools
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              Auto-Enhance
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <Layers className="w-4 h-4 mr-2" />
                              Remove Background
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <FileStack className="w-4 h-4 mr-2" />
                              Collage Maker
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <Palette className="w-4 h-4 mr-2" />
                              Color Grading
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <Droplet className="w-4 h-4 mr-2" />
                              Double Exposure
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <Maximize2 className="w-4 h-4 mr-2" />
                              Tilt-Shift
                            </Button>
                          </div>
                        </div>

                        {/* New Color Tools Section */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Palette className="w-4 h-4 text-purple-500" />
                            Color Tools
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-sm">
                                Temperature: <span className="text-purple-600">{imageOptions.temperature || 0}°K</span>
                              </Label>
                              <Slider
                                value={[imageOptions.temperature || 0]}
                                onValueChange={(value) => setImageOptions({ ...imageOptions, temperature: value[0] })}
                                min={-100}
                                max={100}
                                step={1}
                                className={sliderColorClass('purple')}
                              />
                            </div>
                            <div>
                              <Label className="text-sm">
                                Tint: <span className="text-purple-600">{imageOptions.tint || 0}%</span>
                              </Label>
                              <Slider
                                value={[imageOptions.tint || 0]}
                                onValueChange={(value) => setImageOptions({ ...imageOptions, tint: value[0] })}
                                min={-100}
                                max={100}
                                step={1}
                                className={sliderColorClass('purple')}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              Split Toning
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              Color Balance
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              Selective Color
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              Extract Palette
                            </Button>
                          </div>
                        </div>

                        {/* New Export Options Section */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Download className="w-4 h-4 text-purple-500" />
                            Export Options
                          </h4>
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
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <FileStack className="w-4 h-4 mr-2" />
                              Batch Export
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <Info className="w-4 h-4 mr-2" />
                              Edit Metadata
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Preset
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowComingSoon(true)}
                              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Multiple Formats
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Convert Button */}
                  <Button
                    onClick={() => mode === 'convert' ? handleConvert() : handleConvert(true)}
                    disabled={
                      isConverting ||
                      !selectedFile ||
                      !detectedFormat ||
                      (mode === 'convert' && (!toFormat || detectedFormat === toFormat))
                    }
                    className={`w-full h-12 transition-all duration-200 ${
                      isConverting
                        ? 'bg-blue-600/80'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {mode === 'convert' ? 'Converting...' : 'Optimizing...'}
                      </>
                    ) : (
                      <>
                        {mode === 'convert' ? (
                          <>
                            <FileText className="w-5 h-5 mr-2" />
                            Convert Image
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Optimize Image
                          </>
                        )}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Conversion Result */}
                  {convertedFile && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                          <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">Conversion Complete!</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{convertedFile}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleDownload} 
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar (Desktop Only) */}
            <div className="space-y-6 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="sticky top-24 mb-4"
              >
                {/* <div className="w-[300px] mx-auto mb-4">
                  <GoogleAdClient
                    adClient="ca-pub-1009479093659621"
                    adSlot="8774727539"
                    style={{ display: "block", width: 300, height: 250, borderRadius: "0.75rem", overflow: "hidden" }}
                    className="rounded-xl"
                    format="rectangle"
                  />
                </div> */}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
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
              </motion.div>

              {/* <div className="w-[300px] mx-auto mb-4">
                  <GoogleAdClient
                    adClient="ca-pub-1009479093659621"
                    adSlot="8774727539"
                    style={{ display: "block", width: 300, height: 250, borderRadius: "0.75rem", overflow: "hidden" }}
                    className="rounded-xl"
                    format="rectangle"
                  />
                </div> */}
            </div>
          </div>
          </section>

          {/* Divider */}
          <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 my-12" />

        {/* Cookie Consent Banner */}
        {showCookieConsent && !showCookieSettings && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Cookie consent dialog"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 items-start">
              <div className="flex items-center gap-3">
                <Cookie className="w-6 h-6 text-yellow-500" aria-hidden="true" />
                <span className="font-semibold text-lg">We Value Your Privacy</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                We use cookies to enhance your experience, serve personalized content and ads, and analyze our traffic. You can accept all, decline all, or manage your preferences. Read our
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">Privacy Policy</a> for more information.
              </p>
              <div className="flex flex-wrap gap-2 w-full justify-end">
                <Button
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-200 hover:underline px-2 py-1 h-auto focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => setShowCookieSettings(true)}
                  aria-label="Manage cookie preferences"
                >
                  Manage Preferences
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 px-4 py-2 h-auto focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => { handleCookieConsent(false); setAnalyticsConsent(false); setAdsConsent(false); }}
                  aria-label="Decline all cookies"
                >
                  Decline All
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 h-auto font-semibold shadow focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => { handleCookieConsent(true); setAnalyticsConsent(true); setAdsConsent(true); }}
                  aria-label="Accept all cookies"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {showCookieConsent && showCookieSettings && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Cookie preferences dialog"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 items-start">
              <div className="flex items-center gap-3 mb-2">
                <Cookie className="w-6 h-6 text-yellow-500" aria-hidden="true" />
                <span className="font-semibold text-lg">Cookie Preferences</span>
              </div>
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Necessary Cookies</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Required for basic site functionality. Always enabled.</p>
                  </div>
                  <Switch checked disabled id="necessary-cookies" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Analytics Cookies</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Help us understand how visitors interact with our website.</p>
                  </div>
                  <Switch
                    id="analytics-cookies"
                    checked={analyticsConsent}
                    onCheckedChange={setAnalyticsConsent}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Personalization & Ads Cookies</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Used to show you personalized content and ads.</p>
                  </div>
                  <Switch
                    id="ads-cookies"
                    checked={adsConsent}
                    onCheckedChange={setAdsConsent}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full justify-end mt-2">
                <Button
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-200 hover:underline px-2 py-1 h-auto focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => setShowCookieSettings(false)}
                  aria-label="Back to summary"
                >
                  Back
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 px-4 py-2 h-auto focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => { handleCookieConsent(false); setShowCookieSettings(false); setAnalyticsConsent(false); setAdsConsent(false); }}
                  aria-label="Decline all cookies"
                >
                  Decline All
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 h-auto font-semibold shadow focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => {
                    // Save preferences
                    handleCookieConsent(analyticsConsent || adsConsent)
                    setShowCookieSettings(false)
                  }}
                  aria-label="Save cookie preferences"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Add a Dialog/modal for the preview image at the end of the main content */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
              <DialogDescription>
                This is a preview of your image with the current settings.
              </DialogDescription>
            </DialogHeader>
            {isPreviewLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : previewError ? (
              <div className="text-red-600 text-center py-8">{previewError}</div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-[60vh] mx-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="text-gray-500 text-center py-8">No preview available.</div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add the Coming Soon modal at the end of the main content */}
        <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Upcoming Features
              </DialogTitle>
              <DialogDescription className="text-base">
                A focused roadmap of features we're developing to enhance your image editing experience.
              </DialogDescription>
            </DialogHeader>
            
            {/* Feature sections */}
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-blue-600" />
                  Core Enhancements
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Smart Auto-Enhance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Basic Background Removal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Simple Object Removal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Image Upscaling
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  Color & Effects
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    Basic Color Grading
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    Filter Presets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    HDR Effect
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    Vintage Effects
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileStack className="w-4 h-4 text-teal-600" />
                  Workflow Tools
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                    Batch Processing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                    Save & Load Presets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                    Basic Metadata Editor
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                    Export to Multiple Formats
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-xl">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-slate-600" />
                  Social & Sharing
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                    Social Media Presets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                    Share Settings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                    Quick Export
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                    Watermark Tool
                  </li>
                </ul>
              </div>
            </div>

            {/* Development Timeline */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-xl">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                Development Timeline
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Phase 1 (Next 2 Months)</p>
                  <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Core Enhancements</li>
                    <li>• Basic Color Tools</li>
                    <li>• Simple Batch Processing</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Phase 2 (3-4 Months)</p>
                  <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Advanced Effects</li>
                    <li>• Social Media Features</li>
                    <li>• Workflow Improvements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Info className="w-4 h-4" />
                <span>Follow our development progress</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowComingSoon(false)}
                  className="border-2"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowComingSoon(false)
                    setShowSubscriptionDialog(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Get Updates
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add new Subscription Dialog */}
        <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Stay Updated
              </DialogTitle>
              <DialogDescription>
                Subscribe to receive updates about new features and improvements.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setSubscriptionStatus({ type: null, message: '' })
                  }}
                  className="mt-1"
                  disabled={isSubscribing}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Interests</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="core"
                      checked={selectedInterests.includes('core')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedInterests([...selectedInterests, 'core'])
                        } else {
                          setSelectedInterests(selectedInterests.filter(i => i !== 'core'))
                        }
                      }}
                      disabled={isSubscribing}
                    />
                    <Label htmlFor="core" className="text-sm">Core Features</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="effects"
                      checked={selectedInterests.includes('effects')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedInterests([...selectedInterests, 'effects'])
                        } else {
                          setSelectedInterests(selectedInterests.filter(i => i !== 'effects'))
                        }
                      }}
                      disabled={isSubscribing}
                    />
                    <Label htmlFor="effects" className="text-sm">Effects & Filters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="workflow"
                      checked={selectedInterests.includes('workflow')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedInterests([...selectedInterests, 'workflow'])
                        } else {
                          setSelectedInterests(selectedInterests.filter(i => i !== 'workflow'))
                        }
                      }}
                      disabled={isSubscribing}
                    />
                    <Label htmlFor="workflow" className="text-sm">Workflow Tools</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="social"
                      checked={selectedInterests.includes('social')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedInterests([...selectedInterests, 'social'])
                        } else {
                          setSelectedInterests(selectedInterests.filter(i => i !== 'social'))
                        }
                      }}
                      disabled={isSubscribing}
                    />
                    <Label htmlFor="social" className="text-sm">Social Features</Label>
                  </div>
                </div>
              </div>

              {subscriptionStatus.type && (
                <div className={`p-3 rounded-lg ${
                  subscriptionStatus.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}>
                  {subscriptionStatus.message}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSubscriptionDialog(false)
                    setEmail('')
                    setSelectedInterests([])
                    setSubscriptionStatus({ type: null, message: '' })
                  }}
                  className="border-2"
                  disabled={isSubscribing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubscribe}
                  disabled={isSubscribing || !email}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </main>
      </div>
    </>
  )
}