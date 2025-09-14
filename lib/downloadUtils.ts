export interface DownloadOptions {
  filename?: string
  mimeType?: string
  quality?: number
}

export class DownloadManager {
  private static instance: DownloadManager
  
  static getInstance(): DownloadManager {
    if (!DownloadManager.instance) {
      DownloadManager.instance = new DownloadManager()
    }
    return DownloadManager.instance
  }

  /**
   * Download a base64 encoded image
   */
  downloadBase64Image(
    base64Data: string, 
    format: string, 
    originalFilename: string,
    options: DownloadOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Validate inputs
        if (!base64Data || !format || !originalFilename) {
          throw new Error('Missing required parameters for download')
        }

        // Clean base64 data (remove data URL prefix if present)
        const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '')
        
        // Validate base64 format
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
          throw new Error('Invalid base64 data format')
        }

        // Convert base64 to binary
        const binaryString = atob(cleanBase64)
        const bytes = new Uint8Array(binaryString.length)
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }

        // Determine MIME type
        const mimeType = options.mimeType || this.getMimeType(format)
        
        // Generate filename
        const filename = options.filename || this.generateFilename(originalFilename, format)
        
        // Create blob
        const blob = new Blob([bytes], { type: mimeType })
        
        // Validate blob size
        if (blob.size === 0) {
          throw new Error('Generated file is empty')
        }

        // Create download
        this.triggerDownload(blob, filename)
        
        resolve(true)
        
      } catch (error) {
        console.error('Download failed:', error)
        reject(error instanceof Error ? error : new Error('Download failed'))
      }
    })
  }

  /**
   * Download multiple files as a ZIP (future enhancement)
   */
  async downloadMultipleFiles(files: Array<{
    data: string
    format: string
    filename: string
  }>): Promise<boolean> {
    // For now, download files individually
    // TODO: Implement ZIP creation for batch downloads
    try {
      for (const file of files) {
        await this.downloadBase64Image(file.data, file.format, file.filename)
        // Add small delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return true
    } catch (error) {
      console.error('Batch download failed:', error)
      return false
    }
  }

  /**
   * Trigger the actual download
   */
  private triggerDownload(blob: Blob, filename: string): void {
    // Check if we can use the modern download API
    if ('showSaveFilePicker' in window) {
      this.modernDownload(blob, filename)
    } else {
      this.legacyDownload(blob, filename)
    }
  }

  /**
   * Modern download using File System Access API (Chrome 86+)
   */
  private async modernDownload(blob: Blob, filename: string): Promise<void> {
    try {
      // @ts-ignore - File System Access API
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Images',
          accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif']
          }
        }]
      })
      
      const writable = await fileHandle.createWritable()
      await writable.write(blob)
      await writable.close()
      
    } catch (error) {
      // Fall back to legacy method if user cancels or API fails
      this.legacyDownload(blob, filename)
    }
  }

  /**
   * Legacy download using anchor element
   */
  private legacyDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    // Set download attributes
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    // Add to DOM, click, and cleanup
    document.body.appendChild(link)
    link.click()
    
    // Cleanup after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(url)
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
    }, 1000)
  }

  /**
   * Get MIME type for image format
   */
  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'webp': 'image/webp',
      'avif': 'image/avif',
      'svg': 'image/svg+xml'
    }
    
    return mimeTypes[format.toLowerCase()] || 'image/png'
  }

  /**
   * Generate appropriate filename
   */
  private generateFilename(originalFilename: string, newFormat: string): string {
    // Remove extension from original filename
    const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '')
    
    // Add new extension
    return `${nameWithoutExt}.${newFormat}`
  }

  /**
   * Validate if download is supported
   */
  isDownloadSupported(): boolean {
    return typeof document !== 'undefined' && 
           typeof URL !== 'undefined' && 
           typeof Blob !== 'undefined'
  }

  /**
   * Get download capabilities
   */
  getCapabilities(): {
    modernAPI: boolean
    legacyAPI: boolean
    batchDownload: boolean
  } {
    return {
      modernAPI: 'showSaveFilePicker' in window,
      legacyAPI: this.isDownloadSupported(),
      batchDownload: true // We support sequential downloads
    }
  }
}
