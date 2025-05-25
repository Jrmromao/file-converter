"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, FileText, Download, Loader2, ArrowRight, Zap, Shield, Layers, Image, Settings, RotateCw, FlipHorizontal, FlipVertical, Droplet, Sparkles, Info, Maximize2, Minimize2, X } from "lucide-react"
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
  const [isFullscreen, setIsFullscreen] = useState(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* --- Top Banner Ad Placeholder --- */}
      <div className="w-full flex justify-center mb-4">
        <div className="bg-gray-200 rounded-lg w-full max-w-4xl h-16 flex items-center justify-center text-gray-500 font-semibold">
          [Ad Banner Placeholder]
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8"> 
          <h1 className="text-4xl font-bold text-slate-800 mb-3">Image Converter Pro</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Convert and optimize your images with advanced features. Support for PNG, JPG, WebP, and AVIF formats.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Converter */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center text-slate-800">Convert Your Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    isDragOver
                      ? "border-blue-400 bg-blue-50"
                      : selectedFile
                        ? "border-green-400 bg-green-50"
                        : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
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
                    <div className="space-y-3">
                      {previewUrl && (
                        <div className="relative">
                          <div className="relative max-h-48 flex justify-center items-center">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="object-contain rounded-lg cursor-pointer mx-auto max-w-[350px] max-h-[220px]"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowPreview(true)
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-slate-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowPreview(true)
                              }}
                            >
                              <Maximize2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        {detectedFormat && (
                          <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700">
                            {detectedFormat.toUpperCase()}
                          </Badge>
                        )}
                        {imageMetadata && (
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-slate-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowMetadata(!showMetadata)
                              }}
                            >
                              <Info className="w-4 h-4 mr-1" />
                              {showMetadata ? 'Hide Details' : 'Show Details'}
                            </Button>
                            {showMetadata && (
                              <div className="text-sm text-slate-600">
                                {imageMetadata.width} × {imageMetadata.height}px
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Image Selected
                      </Badge>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-slate-700">Drop your image here or click to browse</p>
                        <p className="text-sm text-slate-500">Supports PNG, JPG, WebP, and AVIF formats</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Dialog */}
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <div className="flex items-center justify-between w-full">
                        <DialogTitle className="font-bold text-lg">Image Preview</DialogTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
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
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPreview(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button> */}
                        </div>
                      </div>
                      <DialogDescription>
                        {imageMetadata?.width} × {imageMetadata?.height}px • {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
                     
                     
                      </DialogDescription>
                    </DialogHeader>
                    <div className="relative mt-4 max-h-[60vh] overflow-auto">
                      <img
                        src={previewUrl || ""}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                        style={{ maxHeight: '60vh' }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Format Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Convert to</label>
                  <Select value={toFormat} onValueChange={setToFormat}>
                    <SelectTrigger className="h-12 bg-white border-slate-200">
                      <SelectValue placeholder="Select target format" />
                    </SelectTrigger>
                    <SelectContent>
                      {fileFormats
                        .filter((format: FileFormat) => format.value !== detectedFormat)
                        .map((format: FileFormat) => (
                          <SelectItem key={format.value} value={format.value}>
                            <div className="flex items-center gap-2">
                              <span>{format.icon}</span>
                              <span>{format.label}</span>
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
                    className="flex items-center gap-2"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <Settings className="w-4 h-4" />
                    Advanced Options
                  </Button>
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-6 p-4 bg-slate-50 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Quality Slider */}
                      <div className="space-y-2">
                        <Label>Quality: {imageOptions.quality}%</Label>
                        <Slider
                          value={[imageOptions.quality]}
                          onValueChange={(value) => setImageOptions({ ...imageOptions, quality: value[0] })}
                          min={1}
                          max={100}
                          step={1}
                        />
                      </div>

                      {/* Rotation Slider */}
                      <div className="space-y-2">
                        <Label>Rotation: {imageOptions.rotate}°</Label>
                        <Slider
                          value={[imageOptions.rotate]}
                          onValueChange={(value) => setImageOptions({ ...imageOptions, rotate: value[0] })}
                          min={0}
                          max={360}
                          step={90}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Width Input */}
                      <div className="space-y-2">
                        <Label>Width (px)</Label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          value={imageOptions.width || ''}
                          onChange={(e) => setImageOptions({ ...imageOptions, width: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="Original width"
                          min={1}
                          max={8000}
                        />
                      </div>

                      {/* Height Input */}
                      <div className="space-y-2">
                        <Label>Height (px)</Label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
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
                      <h3 className="font-medium text-slate-700">Color Adjustments</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Brightness: {imageOptions.brightness}%</Label>
                          <Slider
                            value={[imageOptions.brightness]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, brightness: value[0] })}
                            min={-100}
                            max={100}
                            step={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Lightness: {imageOptions.contrast}%</Label>
                          <Slider
                            value={[imageOptions.contrast]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, contrast: value[0] })}
                            min={-100}
                            max={100}
                            step={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Saturation: {imageOptions.saturation}%</Label>
                          <Slider
                            value={[imageOptions.saturation]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, saturation: value[0] })}
                            min={-100}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-slate-700">Filters</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(FILTERS).map(([key, value]) => (
                          <Button
                            key={key}
                            variant={imageOptions.filter === key ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageOptions({ ...imageOptions, filter: key as keyof typeof FILTERS })}
                            className="w-full"
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Effects */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-slate-700">Effects</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex gap-4">
                          <Button
                            variant={imageOptions.grayscale ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageOptions({ ...imageOptions, grayscale: !imageOptions.grayscale })}
                          >
                            <Droplet className="w-4 h-4 mr-2" />
                            Grayscale
                          </Button>
                          <Button
                            variant={imageOptions.optimize ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageOptions({ ...imageOptions, optimize: !imageOptions.optimize })}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Optimize
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Blur: {imageOptions.blur}</Label>
                          <Slider
                            value={[imageOptions.blur]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, blur: value[0] })}
                            min={0}
                            max={10}
                            step={0.1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Sharpen: {imageOptions.sharpen}</Label>
                          <Slider
                            value={[imageOptions.sharpen]}
                            onValueChange={(value) => setImageOptions({ ...imageOptions, sharpen: value[0] })}
                            min={0}
                            max={10}
                            step={0.1}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-slate-700">Advanced Options</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="preserve-metadata"
                            checked={imageOptions.preserveMetadata}
                            onCheckedChange={(checked) => setImageOptions({ ...imageOptions, preserveMetadata: checked })}
                          />
                          <Label htmlFor="preserve-metadata">Preserve Metadata</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="progressive"
                            checked={imageOptions.progressive}
                            onCheckedChange={(checked) => setImageOptions({ ...imageOptions, progressive: checked })}
                          />
                          <Label htmlFor="progressive">Progressive Loading</Label>
                        </div>
                        <div className="flex items-center space-x-2">
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
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Download className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-800">Conversion Complete!</p>
                            <p className="text-sm text-green-600">{convertedFile}</p>
                          </div>
                        </div>
                        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Fast Conversion</p>
                    <p className="text-sm text-slate-500">Convert images in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Secure Processing</p>
                    <p className="text-sm text-slate-500">Your images are safe with us</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Layers className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Advanced Features</p>
                    <p className="text-sm text-slate-500">Resize, rotate, and optimize</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported Formats */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {fileFormats.map((format) => (
                    <Badge
                      key={format.value}
                      variant="secondary"
                      className="justify-center py-2 bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      {format.icon}
                      <span className="ml-1">{format.label}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-8">
          <p className="text-slate-500">© 2024 Image Converter Pro. Convert images with confidence.</p>
        </footer>
      </div>
    </div>
  )
}
