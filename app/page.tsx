"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Download, Loader2, ArrowRight, Zap, Shield, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const fileFormats = [
  { value: "pdf", label: "PDF", icon: "📄" },
  { value: "docx", label: "DOCX", icon: "📝" },
  { value: "png", label: "PNG", icon: "🖼️" },
  { value: "jpg", label: "JPG", icon: "📸" },
  { value: "txt", label: "TXT", icon: "📋" },
  { value: "xlsx", label: "XLSX", icon: "📊" },
  { value: "pptx", label: "PPTX", icon: "📊" },
  { value: "csv", label: "CSV", icon: "📈" },
]

export default function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fromFormat, setFromFormat] = useState("")
  const [toFormat, setToFormat] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const [convertedFile, setConvertedFile] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setConvertedFile(null)

    // Auto-detect file format
    const extension = file.name.split(".").pop()?.toLowerCase()
    const detectedFormat = fileFormats.find((format) => format.value === extension)
    if (detectedFormat) {
      setFromFormat(detectedFormat.value)
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
    if (!selectedFile || !fromFormat || !toFormat) return

    setIsConverting(true)

    // Simulate conversion process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate converted file
    const convertedFileName = selectedFile.name.replace(/\.[^/.]+$/, `.${toFormat}`)
    setConvertedFile(convertedFileName)
    setIsConverting(false)
  }

  const handleDownload = () => {
    // Simulate file download
    const link = document.createElement("a")
    link.href = "#"
    link.download = convertedFile || "converted-file"
    link.click()
  }

  const canConvert = selectedFile && fromFormat && toFormat && fromFormat !== toFormat

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">File Converter Pro</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Convert your files between different formats quickly and easily. Support for documents, images, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Converter */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center text-slate-800">Convert Your Files</CardTitle>
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
                    accept=".pdf,.docx,.png,.jpg,.jpeg,.txt,.xlsx,.pptx,.csv"
                  />

                  {selectedFile ? (
                    <div className="space-y-3">
                      <FileText className="w-12 h-12 text-green-500 mx-auto" />
                      <div>
                        <p className="font-semibold text-slate-800">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        File Selected
                      </Badge>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-slate-700">Drop your file here or click to browse</p>
                        <p className="text-sm text-slate-500">Supports PDF, DOCX, PNG, JPG, TXT, XLSX, PPTX, CSV</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Format Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Convert from</label>
                    <Select value={fromFormat} onValueChange={setFromFormat}>
                      <SelectTrigger className="h-12 bg-white border-slate-200">
                        <SelectValue placeholder="Select source format" />
                      </SelectTrigger>
                      <SelectContent>
                        {fileFormats.map((format) => (
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Convert to</label>
                    <Select value={toFormat} onValueChange={setToFormat}>
                      <SelectTrigger className="h-12 bg-white border-slate-200">
                        <SelectValue placeholder="Select target format" />
                      </SelectTrigger>
                      <SelectContent>
                        {fileFormats.map((format) => (
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
                </div>

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
                      Convert File
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

            {/* AdSense Banner */}
            <Card className="mt-6 shadow-lg border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg p-8 text-center">
                  <p className="text-sm text-slate-500 mb-2">Advertisement</p>
                  <div className="bg-white rounded border-2 border-dashed border-slate-300 p-8">
                    <p className="text-slate-400 font-medium">Google AdSense</p>
                    <p className="text-xs text-slate-400">728 x 90</p>
                  </div>
                </div>
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
                    <p className="text-sm text-slate-500">Convert files in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Secure Processing</p>
                    <p className="text-sm text-slate-500">Your files are safe with us</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Layers className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Multiple Formats</p>
                    <p className="text-sm text-slate-500">Support for popular formats</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AdSense Sidebar */}
            <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="bg-gradient-to-b from-slate-100 to-slate-200 rounded-lg p-6 text-center">
                  <p className="text-xs text-slate-500 mb-3">Advertisement</p>
                  <div className="bg-white rounded border-2 border-dashed border-slate-300 p-6">
                    <p className="text-slate-400 font-medium text-sm">Google AdSense</p>
                    <p className="text-xs text-slate-400">300 x 250</p>
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
                      <span className="mr-1">{format.icon}</span>
                      {format.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-8">
          <p className="text-slate-500">© 2024 File Converter Pro. Convert files with confidence.</p>
        </footer>
      </div>
    </div>
  )
}
