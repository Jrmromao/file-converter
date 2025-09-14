"use client"

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileStack, Download, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { FileConverterService } from '../services/fileConverter'

interface BatchFile {
  id: string
  file: File
  status: 'pending' | 'processing' | 'completed' | 'error'
  result?: any
  error?: string
  progress?: number
}

interface BatchProcessorProps {
  onClose: () => void
}

export default function BatchProcessor({ onClose }: BatchProcessorProps) {
  const [files, setFiles] = useState<BatchFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [outputFormat, setOutputFormat] = useState('jpg')
  const [quality, setQuality] = useState(80)
  const { toast } = useToast()

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    if (selectedFiles.length === 0) return
    
    // Check plan limits
    const userPlan = 'free' // TODO: Get from user context
    const planLimits = {
      free: 1,
      pro: 10,
      business: 100
    }
    
    const maxFiles = planLimits[userPlan as keyof typeof planLimits]
    
    if (selectedFiles.length > maxFiles) {
      toast({
        title: "File limit exceeded",
        description: `${userPlan} plan allows ${maxFiles} files. Upgrade for batch processing.`,
        variant: "destructive"
      })
      return
    }

    const newFiles: BatchFile[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending'
    }))

    setFiles(prev => [...prev, ...newFiles])
  }, [toast])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const processFiles = async () => {
    if (files.length === 0) return

    // Check plan limits before processing
    const userPlan = 'free' // TODO: Get from user context
    const planLimits = {
      free: { batchSize: 1, conversions: 5 },
      pro: { batchSize: 10, conversions: 500 },
      business: { batchSize: 100, conversions: -1 }
    }
    
    const currentPlan = planLimits[userPlan as keyof typeof planLimits]
    
    if (files.length > currentPlan.batchSize) {
      toast({
        title: "Batch limit exceeded",
        description: `${userPlan} plan allows ${currentPlan.batchSize} files per batch. Upgrade for more.`,
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    
    try {
      // Prepare form data for batch API
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file.file)
      })
      formData.append('outputFormat', outputFormat)
      formData.append('quality', quality.toString())

      // Call batch conversion API
      const response = await fetch('/api/batch-convert', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 402) {
          // Payment required - show upgrade modal
          toast({
            title: "Upgrade Required",
            description: result.error,
            variant: "destructive"
          })
          return
        }
        throw new Error(result.error || 'Batch conversion failed')
      }

      // Update file statuses based on results
      if (result.success && result.results) {
        setFiles(prev => prev.map(file => {
          const apiResult = result.results.find((r: any) => r.fileName === file.file.name)
          if (apiResult) {
            return {
              ...file,
              status: apiResult.success ? 'completed' : 'error',
              result: apiResult.success ? {
                data: apiResult.data,
                fileName: apiResult.convertedFileName,
                metadata: apiResult.metadata
              } : undefined,
              error: apiResult.success ? undefined : apiResult.error
            }
          }
          return file
        }))

        toast({
          title: "Batch processing completed",
          description: `${result.summary.successful} files converted successfully, ${result.summary.failed} failed`
        })
      }

    } catch (error) {
      toast({
        title: "Batch processing failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadAll = async () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.result?.data)
    
    if (completedFiles.length === 0) {
      toast({
        title: "No files to download",
        description: "No completed conversions available",
        variant: "destructive"
      })
      return
    }

    try {
      // Import download utility
      const { DownloadManager } = await import('@/lib/downloadUtils')
      const downloadManager = DownloadManager.getInstance()

      // Prepare files for batch download
      const downloadFiles = completedFiles.map(file => ({
        data: file.result.data,
        format: outputFormat,
        filename: file.result.fileName || `converted_${file.file.name}`
      }))

      // Download all files
      const success = await downloadManager.downloadMultipleFiles(downloadFiles)

      if (success) {
        toast({
          title: "Downloads started",
          description: `Downloading ${completedFiles.length} converted files`
        })
      } else {
        throw new Error('Batch download failed')
      }

    } catch (error) {
      console.error('Batch download failed:', error)
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download files",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: BatchFile['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 rounded-full bg-gray-300" />
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: BatchFile['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700">Processing</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
    }
  }

  const completedCount = files.filter(f => f.status === 'completed').length
  const errorCount = files.filter(f => f.status === 'error').length
  const processingCount = files.filter(f => f.status === 'processing').length

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileStack className="w-6 h-6 text-blue-600" />
            <CardTitle>Batch Image Processor</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          {/* Plan Limits Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700 dark:text-blue-300">
                Free Plan: 1 file per batch • Pro: 10 files • Business: 100 files
              </span>
              <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto">
                Upgrade
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isProcessing}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum {files.length >= 1 ? '1 file (Free plan)' : '10 files'} at once
              </p>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-2">Format</label>
              <Select value={outputFormat} onValueChange={setOutputFormat} disabled={isProcessing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="avif">AVIF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium mb-2">Quality</label>
              <Select value={quality.toString()} onValueChange={(v) => setQuality(parseInt(v))} disabled={isProcessing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60%</SelectItem>
                  <SelectItem value="80">80%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Files ({files.length})</h3>
              <div className="flex gap-2">
                <Button
                  onClick={processFiles}
                  disabled={isProcessing || files.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileStack className="w-4 h-4 mr-2" />
                      Process All
                    </>
                  )}
                </Button>
                {completedCount > 0 && (
                  <Button onClick={downloadAll} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download All ({completedCount})
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Summary */}
            {isProcessing && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">
                    {completedCount + errorCount} / {files.length}
                  </span>
                </div>
                <Progress value={((completedCount + errorCount) / files.length) * 100} />
              </div>
            )}

            {/* File List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getStatusIcon(file.status)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{file.file.name}</span>
                      {getStatusBadge(file.status)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    {file.status === 'processing' && file.progress !== undefined && (
                      <Progress value={file.progress} className="mt-1 h-1" />
                    )}
                    {file.error && (
                      <div className="text-xs text-red-600 mt-1">{file.error}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && file.result?.data && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const { DownloadManager } = await import('@/lib/downloadUtils')
                            const downloadManager = DownloadManager.getInstance()
                            
                            await downloadManager.downloadBase64Image(
                              file.result.data,
                              outputFormat,
                              file.result.fileName || `converted_${file.file.name}`
                            )
                            
                            toast({
                              title: "Download started",
                              description: file.result.fileName || file.file.name
                            })
                          } catch (error) {
                            toast({
                              title: "Download failed",
                              description: error instanceof Error ? error.message : "Failed to download",
                              variant: "destructive"
                            })
                          }
                        }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
                    {!isProcessing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            {(completedCount > 0 || errorCount > 0) && (
              <div className="flex gap-4 text-sm">
                {completedCount > 0 && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {completedCount} completed
                  </div>
                )}
                {errorCount > 0 && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errorCount} failed
                  </div>
                )}
                {processingCount > 0 && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {processingCount} processing
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {files.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileStack className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Select multiple images to start batch processing</p>
            <p className="text-sm mt-1">Maximum 10 files at once</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
