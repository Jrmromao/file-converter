export const SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'avif'] as const

export class FileConverterService {
  static getSupportedFormats() {
    return SUPPORTED_FORMATS
  }

  static async convertFile(formData: FormData) {
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Conversion failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Conversion error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Conversion failed',
        fileName: 'unknown'
      }
    }
  }
} 