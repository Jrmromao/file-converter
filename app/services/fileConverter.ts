export const SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'avif'] as const

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg', 
  'image/jpg',
  'image/webp',
  'image/avif'
]

export class FileConverterService {
  static getSupportedFormats() {
    return SUPPORTED_FORMATS
  }

  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file exists
    if (!file) {
      return { isValid: false, error: 'No file selected' }
    }

    // Check file size
    if (file.size === 0) {
      return { isValid: false, error: 'File is empty' }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Only PNG, JPG, WebP, and AVIF images are supported' 
      }
    }

    // Check file extension
    const extension = file.name.toLowerCase().split('.').pop()
    if (!extension || !SUPPORTED_FORMATS.includes(extension as any)) {
      return { 
        isValid: false, 
        error: 'Invalid file extension' 
      }
    }

    return { isValid: true }
  }

  static async convertFile(formData: FormData) {
    try {
      // Client-side validation
      const file = formData.get('file') as File
      const validation = this.validateFile(file)
      
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          fileName: file?.name || 'unknown'
        }
      }

      // Add security headers and make request
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type - let browser set it with boundary
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      // Handle different response types
      if (response.status === 429) {
        const error = await response.json()
        return {
          success: false,
          error: 'Too many requests. Please wait before trying again.',
          fileName: file.name
        }
      }

      if (response.status === 408) {
        return {
          success: false,
          error: 'Processing timed out. Please try with a smaller file.',
          fileName: file.name
        }
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Server error: ${response.status}`)
      }

      const result = await response.json()
      
      // Validate server response
      if (!result.serverProcessed) {
        throw new Error('Invalid server response')
      }

      return result

    } catch (error) {
      console.error('Conversion service error:', error)
      
      const file = formData.get('file') as File
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
        fileName: file?.name || 'unknown'
      }
    }
  }
}
