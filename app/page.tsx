"use client"

import React, { useState, useEffect } from "react"
import { Upload, FileText, Download, Loader2, ArrowRight, Zap, Shield, Layers, Image, Settings, RotateCw, FlipHorizontal, FlipVertical, Droplet, Sparkles, Info, Maximize2, Moon, Sun } from "lucide-react"
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

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

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
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", action, params)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans">
      <DarkModeToggle />
      
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
            PNG
          </div>
          <h1 className="text-2xl font-bold tracking-tight"></h1>
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Convert & Optimize Images</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Transform your images with ease. Convert between PNG, JPG, WebP, AVIF, and more with advanced editing tools.
          </p>
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
                  <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {/* Quality and Rotation */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Quality: {imageOptions.quality}%</Label>
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
                        <Label className="text-sm">Rotation: {imageOptions.rotate}°</Label>
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
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Width (px)</Label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                          value={imageOptions.width || ''}
                          onChange={(e) => setImageOptions({ ...imageOptions, width: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="Original width"
                          min={1}
                          max={8000}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Height (px)</Label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                          value={imageOptions.height || ''}
                          onChange={(e) => setImageOptions({ ...imageOptions, height: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="Original height"
                          min={1}
                          max={8000}
                        />
                      </div>
                    </div>

                    {/* Color Adjustments */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Color Adjustments</h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm">Brightness: {imageOptions.brightness}%</Label>
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
                          <Label className="text-sm">Contrast: {imageOptions.contrast}%</Label>
                          <Slider
                            value={[imageOptions.contrast]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, contrast: value[0] })}
                            min={-100}
                            max={100}
                            step={1}
                            className={sliderColorClass('purple')}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Saturation: {imageOptions.saturation}%</Label>
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
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Filters</h3>
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

                    {/* Effects */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Effects & Optimizations</h3>
                      <div className="grid sm:grid-cols-3 gap-4">
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
                          <Label className="text-sm">Blur: {imageOptions.blur.toFixed(1)}</Label>
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
                          <Label className="text-sm">Sharpen: {imageOptions.sharpen.toFixed(1)}</Label>
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

                    {/* Format Options */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Format Options</h3>
                      <div className="grid sm:grid-cols-3 gap-4">
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Convert images in seconds.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-green-500 dark:text-green-400" />
                  <div>
                    <p className="font-medium">Secure Processing</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Files are processed securely and not stored.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Layers className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                  <div>
                    <p className="font-medium">Advanced Tools</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Resize, rotate, and apply filters.</p>
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
    </div>
  )
}