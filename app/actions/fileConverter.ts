'use server'

import sharp from 'sharp'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import crypto from 'crypto'
import { FILTERS } from '../constants/imageFilters'
import { SOCIAL_MEDIA_PRESETS } from '../constants/socialMediaPresets'

// Security constants
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_DIMENSION = 8000 // Max width/height
const ALLOWED_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'avif'] as const
const MAX_PROCESSING_TIME = 25000 // 25 seconds

// Secure temp file handling
function createSecureTempPath(extension: string): string {
  const randomName = crypto.randomBytes(16).toString('hex')
  return join(tmpdir(), `convert_${randomName}.${extension}`)
}

async function validateImageBuffer(buffer: Buffer): Promise<{ isValid: boolean; error?: string; metadata?: any }> {
  try {
    const metadata = await sharp(buffer).metadata()
    
    if (!metadata.format || !metadata.width || !metadata.height) {
      return { isValid: false, error: 'Invalid image file' }
    }
    
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      return { 
        isValid: false, 
        error: `Image dimensions too large. Maximum ${MAX_DIMENSION}x${MAX_DIMENSION}px` 
      }
    }
    
    if (!ALLOWED_FORMATS.includes(metadata.format as any)) {
      return { isValid: false, error: 'Unsupported image format' }
    }
    
    return { isValid: true, metadata }
    
  } catch (error) {
    return { isValid: false, error: 'Corrupted or invalid image file' }
  }
}

export interface ConversionResult {
  success: boolean
  error?: string
  data?: string // base64 encoded
  fileName: string
  metadata?: {
    width?: number
    height?: number
    format?: string
    size?: number
    originalSize?: number
    compressionRatio?: number
  }
}

export async function convertFile(formData: FormData): Promise<ConversionResult> {
  let tempInputPath: string | null = null
  const startTime = Date.now()
  
  try {
    // Extract and validate inputs
    const file = formData.get('file') as File
    const fromFormat = (formData.get('fromFormat') as string)?.toLowerCase()
    const toFormat = (formData.get('toFormat') as string)?.toLowerCase()
    const quality = Math.min(100, Math.max(1, parseInt(formData.get('quality') as string) || 80))
    
    // Advanced options
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined
    const fit = (formData.get('fit') as string) || 'inside'
    const rotate = formData.get('rotate') ? parseInt(formData.get('rotate') as string) : undefined
    const flip = formData.get('flip') === 'true'
    const flop = formData.get('flop') === 'true'
    const grayscale = formData.get('grayscale') === 'true'
    const blur = formData.get('blur') ? parseFloat(formData.get('blur') as string) : undefined
    const sharpen = formData.get('sharpen') ? parseFloat(formData.get('sharpen') as string) : undefined
    const brightness = formData.get('brightness') ? parseFloat(formData.get('brightness') as string) : undefined
    const contrast = formData.get('contrast') ? parseFloat(formData.get('contrast') as string) : undefined
    const saturation = formData.get('saturation') ? parseFloat(formData.get('saturation') as string) : undefined
    const filter = (formData.get('filter') as string) || 'none'
    const progressive = formData.get('progressive') === 'true'
    const lossless = formData.get('lossless') === 'true'
    const preserveMetadata = formData.get('preserveMetadata') === 'true'
    
    // Social media preset
    const socialPlatform = formData.get('socialPlatform') as string
    const socialPreset = formData.get('socialPreset') as string
    
    if (!file || !fromFormat || !toFormat) {
      return {
        success: false,
        error: 'Missing required parameters',
        fileName: file?.name || 'unknown'
      }
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        fileName: file.name
      }
    }
    
    // Convert file to buffer
    const inputBuffer = Buffer.from(await file.arrayBuffer())
    
    // Validate image
    const validation = await validateImageBuffer(inputBuffer)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || 'Invalid image',
        fileName: file.name
      }
    }
    
    // Create secure temp file for processing
    tempInputPath = createSecureTempPath(fromFormat)
    await writeFile(tempInputPath, inputBuffer)
    
    // Set up Sharp processing with timeout
    const processImage = async (): Promise<Buffer> => {
      let sharpInstance = sharp(tempInputPath!)
        .timeout({ seconds: Math.floor(MAX_PROCESSING_TIME / 1000) })
      
      // Apply social media preset if specified
      let targetWidth = width
      let targetHeight = height
      let targetQuality = quality
      
      if (socialPlatform && socialPreset && SOCIAL_MEDIA_PRESETS[socialPlatform]?.[socialPreset]) {
        const preset = SOCIAL_MEDIA_PRESETS[socialPlatform][socialPreset]
        targetWidth = preset.width
        targetHeight = preset.height
        targetQuality = preset.quality
      }
      
      // Apply transformations
      if (rotate) {
        sharpInstance = sharpInstance.rotate(rotate)
      }
      
      if (flip) {
        sharpInstance = sharpInstance.flip()
      }
      
      if (flop) {
        sharpInstance = sharpInstance.flop()
      }
      
      // Apply resizing
      if (targetWidth || targetHeight) {
        sharpInstance = sharpInstance.resize({
          width: targetWidth,
          height: targetHeight,
          fit: fit as any,
          withoutEnlargement: true
        })
      }
      
      // Apply filters
      if (filter && filter !== 'none' && FILTERS[filter]) {
        const filterConfig = FILTERS[filter].sharpConfig
        
        if (filterConfig.modulate) {
          sharpInstance = sharpInstance.modulate(filterConfig.modulate)
        }
        
        if (filterConfig.tint) {
          sharpInstance = sharpInstance.tint(filterConfig.tint)
        }
        
        if (filterConfig.gamma) {
          sharpInstance = sharpInstance.gamma(filterConfig.gamma)
        }
        
        if (filterConfig.linear) {
          sharpInstance = sharpInstance.linear(filterConfig.linear.a, filterConfig.linear.b)
        }
      }
      
      // Apply manual adjustments (override filter if specified)
      if (brightness !== undefined || contrast !== undefined || saturation !== undefined) {
        const modulateOptions: any = {}
        
        if (brightness !== undefined) {
          modulateOptions.brightness = (brightness / 100) + 1
        }
        if (saturation !== undefined) {
          modulateOptions.saturation = (saturation / 100) + 1
        }
        if (contrast !== undefined) {
          modulateOptions.lightness = (contrast / 100) + 1
        }
        
        if (Object.keys(modulateOptions).length > 0) {
          sharpInstance = sharpInstance.modulate(modulateOptions)
        }
      }
      
      if (grayscale) {
        sharpInstance = sharpInstance.grayscale()
      }
      
      if (blur) {
        sharpInstance = sharpInstance.blur(blur)
      }
      
      if (sharpen) {
        sharpInstance = sharpInstance.sharpen(sharpen)
      }
      
      // Apply format-specific conversion
      switch (toFormat) {
        case 'jpg':
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ 
            quality: targetQuality,
            mozjpeg: true,
            progressive: progressive
          })
          break
          
        case 'png':
          sharpInstance = sharpInstance.png({ 
            compressionLevel: 9,
            progressive: progressive,
            palette: !preserveMetadata
          })
          break
          
        case 'webp':
          sharpInstance = sharpInstance.webp({ 
            quality: targetQuality,
            lossless: lossless,
            effort: 6
          })
          break
          
        case 'avif':
          sharpInstance = sharpInstance.avif({ 
            quality: targetQuality,
            lossless: lossless,
            speed: 5
          })
          break
          
        default:
          throw new Error(`Unsupported output format: ${toFormat}`)
      }
      
      // Remove metadata if not preserving
      if (!preserveMetadata) {
        sharpInstance = sharpInstance.withMetadata(false)
      }
      
      return await sharpInstance.toBuffer()
    }
    
    // Process with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Image processing timeout')), MAX_PROCESSING_TIME)
    })
    
    const outputBuffer = await Promise.race([processImage(), timeoutPromise])
    
    // Get output metadata
    const outputMetadata = await sharp(outputBuffer).metadata()
    
    // Calculate compression ratio
    const originalSize = inputBuffer.length
    const newSize = outputBuffer.length
    const compressionRatio = originalSize > 0 ? ((originalSize - newSize) / originalSize) * 100 : 0
    
    // Validate output
    if (!outputBuffer || outputBuffer.length === 0) {
      throw new Error('Conversion produced empty result')
    }
    
    if (outputBuffer.length > MAX_FILE_SIZE) {
      throw new Error('Converted file exceeds size limit')
    }
    
    return {
      success: true,
      data: outputBuffer.toString('base64'),
      fileName: `${file.name.split('.')[0]}.${toFormat}`,
      metadata: {
        width: outputMetadata.width,
        height: outputMetadata.height,
        format: outputMetadata.format,
        size: newSize,
        originalSize,
        compressionRatio: Math.round(compressionRatio * 100) / 100
      }
    }
    
  } catch (error) {
    console.error('Server conversion error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fileName: (formData.get('file') as File)?.name || 'unknown',
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    })
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed',
      fileName: (formData.get('file') as File)?.name || 'unknown'
    }
    
  } finally {
    // Cleanup: Always remove temp files
    if (tempInputPath) {
      try {
        await unlink(tempInputPath)
      } catch (cleanupError) {
        console.error('Temp file cleanup failed:', cleanupError)
      }
    }
  }
}
