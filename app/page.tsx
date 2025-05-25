"use client"

import React, { useState, useEffect } from "react"
import { Upload, FileText, Download, Loader2, ArrowRight, Zap, Shield, Layers, Image, Settings, RotateCw, FlipHorizontal, FlipVertical, Droplet, Sparkles, Info, Maximize2, Minimize2, X, Moon, Sun, Palette } from "lucide-react"
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


// Helper for consistent styling of slider tracks and thumbs
const sliderColorClass = (color: string) => `[&>span:first-child]:bg-${color}-500 dark:[&>span:first-child]:bg-${color}-600 [&>span:last-child>span]:bg-white dark:[&>span:last-child>span]:bg-neutral-200 [&>span:last-child>span]:border-${color}-500 dark:[&>span:last-child>span]:border-${color}-600`


function DarkModeToggle() {
  useEffect(() => {
    // Set initial mode based on system preference
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
      className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100/70 dark:bg-neutral-800/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-50 border border-neutral-200 dark:border-neutral-700"
      aria-label="Toggle dark mode"
    >
      <Sun className="w-5 h-5 text-yellow-500 dark:hidden" />
      <Moon className="w-5 h-5 text-indigo-400 hidden dark:inline" />
    </button>
  )
}

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

  // Add debounced preview update
  const [previewTimeout, setPreviewTimeout] = useState<NodeJS.Timeout | null>(null)

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileSelect = (file: File) => {
    // Check if file is an image
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

    // Create preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // Get image metadata
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

    // Auto-detect file format
    const extension = file.name.split(".").pop()?.toLowerCase() || ""
    // Check if the format is supported
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
      
      // Add image options
      Object.entries(imageOptions).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const result = await FileConverterService.convertFile(formData)
      
      if (result.success && result.data) {
        setConvertedFile(result.fileName)
        // Create a download URL for the converted file
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

        // Show success message with metadata
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

        // Example for a download conversion
        // gtag('event', 'conversion', {
        //   'send_to': 'AW-CONVERSION_ID/label',
        //   'event_category': 'engagement',
        //   'event_label': 'image_download'
        // });
        trackEvent("conversion", { from: detectedFormat, to: toFormat })
      } else {
        // Show error message
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
    // Simulate file download
    const link = document.createElement("a")
    link.href = "#"
    link.download = convertedFile || "converted-file"
    link.click()

    // Example for a download conversion
    // gtag('event', 'conversion', {
    //   'send_to': 'AW-CONVERSION_ID/label',
    //   'event_category': 'engagement',
    //   'event_label': 'image_download'
    // });
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
      
      // Add image options
      Object.entries(imageOptions).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const result = await FileConverterService.convertFile(formData)
      
      if (result.success && result.data) {
        // Create a preview URL for the converted file
        const binaryString = atob(result.data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: `image/${toFormat}` })
        
        // Cleanup old preview URL before creating new one
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

  // Debounce preview updates
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

  // --- Google Analytics event helper ---
  const trackEvent = (action: string, params: Record<string, any> = {}) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", action, params)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4 font-sans antialiased">
      <DarkModeToggle />
      {/* --- Logo & Brand --- */}
      <div className="w-full flex items-center pl-2 mt-4 mb-8">
        <div className="w-35 h-25 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg mr-2">
          PNG
        </div>
        <span className="text-xl font-extrabold text-slate-800 dark:text-neutral-100 tracking-tight">PNG Convert</span>
      </div>

      {/* --- Top Leaderboard Ad Slot (Responsive, Recommended size: 728x90) --- */}
      <div className="w-full flex justify-center mb-8">
          <GoogleAd
            adClient="ca-pub-1009479093659621"
            adSlot="8774727539"
            style={{ 
              display: "block", 
              width: "100%", 
              maxWidth: "90px", 
              minHeight: 90,
              borderRadius: "0.75rem",
              overflow: "hidden"
            }}
            className="rounded-xl"
          />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 pt-4">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-neutral-50 mb-4 leading-tight">Your Ultimate Image Converter</h1>
          <p className="text-xl text-slate-700 dark:text-neutral-400 max-w-3xl mx-auto">
            Effortlessly convert, resize, and optimize your images with powerful advanced features. Supports PNG, JPG, WebP, AVIF, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Converter */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-6">
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl font-bold text-center text-slate-800 dark:text-neutral-100">Convert Your Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* File Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ease-in-out cursor-pointer group
                    ${isDragOver
                      ? "border-blue-500 bg-blue-50 dark:bg-neutral-800/50"
                      : selectedFile
                        ? "border-emerald-500 bg-emerald-50 dark:bg-neutral-800/50"
                        : "border-neutral-300 dark:border-neutral-700 hover:border-blue-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }
                  `}
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
                        <div className="relative max-h-64 flex justify-center items-center rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 p-2 border border-neutral-200 dark:border-neutral-700">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-contain max-h-60 rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowPreview(true)
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 bg-white/70 dark:bg-neutral-700/70 hover:bg-white dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-100 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
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
                        <p className="font-semibold text-lg text-slate-800 dark:text-neutral-100 truncate">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500 dark:text-neutral-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        {detectedFormat && (
                          <Badge variant="secondary" className="mt-3 text-base px-3 py-1 bg-blue-600 text-white dark:bg-blue-800 dark:text-blue-200 shadow-sm">
                            {detectedFormat.toUpperCase()}
                          </Badge>
                        )}
                        {imageMetadata && (
                          <div className="mt-3 flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-neutral-500 dark:text-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowMetadata(!showMetadata)
                              }}
                            >
                              <Info className="w-4 h-4 mr-1" />
                              {showMetadata ? 'Hide Details' : 'Show Details'}
                            </Button>
                            {showMetadata && (
                              <div className="text-sm text-slate-600 dark:text-neutral-300">
                                {imageMetadata.width} × {imageMetadata.height}px
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-emerald-600 text-white dark:bg-emerald-800 dark:text-emerald-200 text-base px-3 py-1 shadow-sm">
                        Image Selected
                      </Badge>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto transition-transform duration-300 group-hover:scale-110" />
                      <div>
                        <p className="text-xl font-semibold text-slate-700 dark:text-neutral-100">Drop your image here or click to browse</p>
                        <p className="text-md text-slate-500 dark:text-neutral-400 mt-2">Supports PNG, JPG, WebP, and AVIF formats</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Dialog */}
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogContent className="max-w-4xl dark:bg-neutral-900 dark:text-neutral-100 p-6 rounded-xl border border-neutral-800">
                    <DialogHeader>
                      <div className="flex items-center justify-between w-full">
                        <DialogTitle className="font-bold text-xl text-slate-800 dark:text-neutral-100">Image Preview</DialogTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-100 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-600"
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
                      <DialogDescription className="dark:text-neutral-400 text-sm mt-1">
                        {imageMetadata?.width} × {imageMetadata?.height}px • {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
                      </DialogDescription>
                    </DialogHeader>
                    <div className="relative mt-5 max-h-[70vh] overflow-auto flex items-center justify-center">
                      <img
                        src={previewUrl || ""}
                        alt="Preview"
                        className="w-auto h-auto max-w-full max-h-[65vh] object-contain rounded-lg shadow-xl"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Format Selection */}
                <div className="space-y-3">
                  <label className="text-lg font-medium text-slate-700 dark:text-neutral-300">Convert to</label>
                  <Select value={toFormat} onValueChange={setToFormat}>
                    <SelectTrigger className="h-14 text-base bg-neutral-50 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 rounded-lg shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                      <SelectValue placeholder="Select target format" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-neutral-800 dark:text-neutral-100 border border-neutral-700">
                      {fileFormats
                        .filter((format: FileFormat) => format.value !== detectedFormat)
                        .map((format: FileFormat) => (
                          <SelectItem key={format.value} value={format.value} className="dark:text-neutral-100 hover:bg-neutral-700 focus:bg-neutral-700">
                            <div className="flex items-center gap-3">
                               {/* Removed individual format icons here */}
                              <span className="text-base">{format.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Options Toggle */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 px-0"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-md font-semibold">{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
                  </Button>
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-7 p-6 bg-white dark:bg-neutral-850 rounded-xl shadow-inner border border-neutral-200 dark:border-neutral-700">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Quality Slider */}
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-neutral-300 text-sm">Quality: {imageOptions.quality}%</Label>
                        <Slider
                          value={[imageOptions.quality]}
                          onValueChange={(value) => setImageOptions({ ...imageOptions, quality: value[0] })}
                          min={1}
                          max={100}
                          step={1}
                          className={sliderColorClass('blue')}
                        />
                      </div>

                      {/* Rotation Slider */}
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-neutral-300 text-sm">Rotation: {imageOptions.rotate}°</Label>
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

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Width Input */}
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-neutral-300 text-sm">Width (px)</Label>
                        <input
                          type="number"
                          className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md bg-neutral-50 dark:bg-neutral-700 text-slate-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          value={imageOptions.width || ''}
                          onChange={(e) => setImageOptions({ ...imageOptions, width: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="Original width"
                          min={1}
                          max={8000}
                        />
                      </div>

                      {/* Height Input */}
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-neutral-300 text-sm">Height (px)</Label>
                        <input
                          type="number"
                          className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md bg-neutral-50 dark:bg-neutral-700 text-slate-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          value={imageOptions.height || ''}
                          onChange={(e) => setImageOptions({ ...imageOptions, height: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="Original height"
                          min={1}
                          max={8000}
                        />
                      </div>
                    </div>

                    {/* Color Adjustments */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-700 dark:text-neutral-100 text-lg">Color Adjustments</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-neutral-300 text-sm">Brightness: {imageOptions.brightness}%</Label>
                          <Slider
                            value={[imageOptions.brightness]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, brightness: value[0] })}
                            min={-100}
                            max={100}
                            step={1}
                            className={sliderColorClass('purple')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-neutral-300 text-sm">Contrast: {imageOptions.contrast}%</Label>
                          <Slider
                            value={[imageOptions.contrast]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, contrast: value[0] })}
                            min={-100}
                            max={100}
                            step={1}
                            className={sliderColorClass('purple')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-neutral-300 text-sm">Saturation: {imageOptions.saturation}%</Label>
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

                    {/* Filters */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-700 dark:text-neutral-100 text-lg">Filters</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {Object.entries(FILTERS).map(([key, value]) => (
                          <Button
                            key={key}
                            variant={imageOptions.filter === key ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageOptions({ ...imageOptions, filter: key as keyof typeof FILTERS })}
                            className={`w-full text-sm py-2 px-3 transition-colors duration-200
                              ${imageOptions.filter === key
                                ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white shadow-md'
                                : 'border-neutral-300 text-slate-700 dark:border-neutral-600 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-750 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                              }`}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Effects */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-700 dark:text-neutral-100 text-lg">Effects & Optimizations</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-3">
                          <Button
                            variant={imageOptions.grayscale ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageOptions({ ...imageOptions, grayscale: !imageOptions.grayscale })}
                            className={`w-full transition-colors duration-200
                              ${imageOptions.grayscale
                                ? 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white shadow-md'
                                : 'border-neutral-300 text-slate-700 dark:border-neutral-600 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-750 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                              }`}
                          >
                            <Droplet className="w-4 h-4 mr-2" />
                            Grayscale
                          </Button>
                          <Button
                            variant={imageOptions.optimize ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageOptions({ ...imageOptions, optimize: !imageOptions.optimize })}
                            className={`w-full transition-colors duration-200
                              ${imageOptions.optimize
                                ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white shadow-md'
                                : 'border-neutral-300 text-slate-700 dark:border-neutral-600 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-750 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                              }`}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Optimize
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-neutral-300 text-sm">Blur: {imageOptions.blur.toFixed(1)}</Label>
                          <Slider
                            value={[imageOptions.blur]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, blur: value[0] })}
                            min={0}
                            max={10}
                            step={0.1}
                            className={sliderColorClass('teal')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-neutral-300 text-sm">Sharpen: {imageOptions.sharpen.toFixed(1)}</Label>
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
                    </div>

                    {/* Format Specific Options */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-700 dark:text-neutral-100 text-lg">Format Specific Options</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="preserve-metadata"
                            checked={imageOptions.preserveMetadata}
                            onCheckedChange={(checked) => setImageOptions({ ...imageOptions, preserveMetadata: checked })}
                            className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-700"
                          />
                          <Label htmlFor="preserve-metadata" className="text-slate-700 dark:text-neutral-300">Preserve Metadata</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="progressive"
                            checked={imageOptions.progressive}
                            onCheckedChange={(checked) => setImageOptions({ ...imageOptions, progressive: checked })}
                            className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-700"
                          />
                          <Label htmlFor="progressive" className="text-slate-700 dark:text-neutral-300">Progressive Loading</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="lossless"
                            checked={imageOptions.lossless}
                            onCheckedChange={(checked) => setImageOptions({ ...imageOptions, lossless: checked })}
                            className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-700"
                          />
                          <Label htmlFor="lossless" className="text-slate-700 dark:text-neutral-300">Lossless Compression</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Convert Button */}
                <Button
                  onClick={handleConvert}
                  disabled={!canConvert || isConverting}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl text-white dark:from-blue-800 dark:to-indigo-900 dark:hover:from-blue-900 dark:hover:to-indigo-950 rounded-lg"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Processing Image...
                    </>
                  ) : (
                    <>
                      Convert & Optimize
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </>
                  )}
                </Button>

                {/* Conversion Result */}
                {convertedFile && (
                  <Card className="bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-300 dark:from-emerald-950/60 dark:to-green-950/60 dark:border-emerald-800 rounded-xl shadow-lg">
                    <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center dark:bg-emerald-800/80">
                          <Download className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-emerald-800 dark:text-emerald-200">Conversion Complete!</p>
                          <p className="text-sm text-emerald-600 dark:text-emerald-300">{convertedFile}</p>
                        </div>
                      </div>
                      <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white font-semibold py-2 px-5 rounded-md shadow-md">
                        <Download className="w-4 h-4 mr-2" />
                        Download Now
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* --- In-Content Ad Slot (Responsive, Recommended size: 336x280 or 300x250) --- */}
                {/* This ad unit will appear below the conversion result or the main converter card */}
                <GoogleAd
            adClient="ca-pub-1009479093659621"
            adSlot="8774727539"
            style={{ 
              display: "block", 
              width: "100%", 
              maxWidth: "336px", 
              minHeight: 280,
              maxHeight: 280,
              borderRadius: "0.75rem",
              overflow: "hidden"
            }}
            className="rounded-xl"
          />
          

              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Features Card */}
            <Card className="shadow-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-6">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-neutral-100">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900/40">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-neutral-100 text-lg">Blazing Fast Conversion</p>
                    <p className="text-sm text-slate-500 dark:text-neutral-400">Convert images in mere seconds with our optimized engine.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center dark:bg-emerald-900/40">
                    <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-neutral-100 text-lg">Ultimate Data Privacy</p>
                    <p className="text-sm text-slate-500 dark:text-neutral-400">Your files are processed temporarily and never stored. Complete confidentiality.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center dark:bg-purple-900/40">
                    <Layers className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-neutral-100 text-lg">Advanced Image Toolkit</p>
                    <p className="text-sm text-slate-500 dark:text-neutral-400">Access powerful features like resizing, rotation, quality control, and artistic filters.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* --- Sidebar Ad Slot (Responsive, Recommended size: 300x250 or 300x600) --- */}
            <div className="w-full flex justify-center">
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl w-full max-w-xs h-60 flex items-center justify-center text-neutral-500 dark:text-neutral-500 text-sm font-medium border border-neutral-200 dark:border-neutral-700">
                {/* Replace this with your actual Google AdSense responsive ad code */}
                <GoogleAd
            adClient="ca-pub-1009479093659621"
            adSlot="8774727539"
            style={{ 
              display: "block", 
              width: "100%", 
              maxWidth: "600px", 
              minHeight: 300,
              borderRadius: "0.75rem",
              overflow: "hidden"
            }}
            className="rounded-xl"
          />
              </div>
            </div>

  
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 pb-8 text-slate-600 dark:text-neutral-500 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-5 text-md font-medium">
            <a href="/privacy-policy" className="hover:underline text-blue-700 dark:text-blue-400">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:underline text-blue-700 dark:text-blue-400">Terms of Service</a>
            <a href="/contact" className="hover:underline text-blue-700 dark:text-blue-400">Contact Us</a>
            <a href="/about" className="hover:underline text-blue-700 dark:text-blue-400">About</a>
            <a href="/faq" className="hover:underline text-blue-700 dark:text-blue-400">FAQ</a>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} PNG Convert. Convert images with confidence.
          </p>
        </footer>
      </div>
    </div>
  )
}