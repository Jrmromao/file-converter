'use server'

import { revalidatePath } from 'next/cache'
import sharp from 'sharp'
import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { SUPPORTED_FORMATS } from '../services/fileConverter'
import { FILTERS } from "../constants/imageFilters"

// File size limits (in bytes)
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_IMAGE_DIMENSION = 8000 // Maximum width or height for images

// Format mappings for Sharp
const SHARP_FORMATS = {
  'jpg': 'jpeg',
  'jpeg': 'jpeg',
  'png': 'png',
  'webp': 'webp',
  'avif': 'avif',
  'svg': 'svg'
} as const

// Default quality settings
const DEFAULT_QUALITY = {
  jpeg: 80,
  png: 90,
  webp: 80,
  avif: 60
}

export interface ConversionResult {
  success: boolean
  error?: string
  data?: string // base64 encoded data
  fileName: string
  progress?: number
  metadata?: {
    width?: number
    height?: number
    format?: string
    size?: number
    originalSize?: number
    compressionRatio?: number
  }
}

export interface ImageOptions {
  quality?: number
  width?: number
  height?: number
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  rotate?: number
  flip?: boolean
  flop?: boolean
  grayscale?: boolean
  blur?: number
  sharpen?: number
  optimize?: boolean
  filter?: keyof typeof FILTERS
  brightness?: number
  contrast?: number
  saturation?: number
  temperature?: number
  tint?: number
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }
  text?: {
    text: string
    x: number
    y: number
    fontSize: number
    color: string
  }
  preserveMetadata?: boolean
  progressive?: boolean
  lossless?: boolean
}

export async function convertFile(
  formData: FormData,
  isPreview: boolean = false
): Promise<ConversionResult> {
  let inputPath: string | null = null
  let outputPath: string | null = null

  try {
    const file = formData.get('file') as File
    const fromFormat = formData.get('fromFormat') as string
    const toFormat = formData.get('toFormat') as string
    const quality = formData.get('quality') ? parseInt(formData.get('quality') as string) : undefined
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined
    const fit = formData.get('fit') as ImageOptions['fit'] || 'inside'
    const rotate = formData.get('rotate') ? parseInt(formData.get('rotate') as string) : undefined
    const flip = formData.get('flip') === 'true'
    const flop = formData.get('flop') === 'true'
    const grayscale = formData.get('grayscale') === 'true'
    const blur = formData.get('blur') ? parseFloat(formData.get('blur') as string) : undefined
    const sharpen = formData.get('sharpen') ? parseFloat(formData.get('sharpen') as string) : undefined
    const optimize = formData.get('optimize') === 'true'
    const filter = formData.get('filter') as keyof typeof FILTERS
    const brightness = formData.get('brightness') ? parseFloat(formData.get('brightness') as string) : undefined
    const contrast = formData.get('contrast') ? parseFloat(formData.get('contrast') as string) : undefined
    const saturation = formData.get('saturation') ? parseFloat(formData.get('saturation') as string) : undefined
    const temperature = formData.get('temperature') ? parseFloat(formData.get('temperature') as string) : undefined
    const tint = formData.get('tint') ? parseFloat(formData.get('tint') as string) : undefined
    const preserveMetadata = formData.get('preserveMetadata') === 'true'
    const progressive = formData.get('progressive') === 'true'
    const lossless = formData.get('lossless') === 'true'

    // For preview, we'll use a lower quality and skip some optimizations
    const isPreviewMode = isPreview || formData.get('isPreview') === 'true'

    if (!file || !fromFormat) {
      return {
        success: false,
        error: 'Missing required fields: file and fromFormat are required',
        fileName: file?.name || 'unknown'
      }
    }

    // For preview mode, if no toFormat is specified, use the same as fromFormat
    const targetFormat = toFormat || fromFormat

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        fileName: file.name
      }
    }

    // Validate formats
    if (!SUPPORTED_FORMATS.includes(fromFormat.toLowerCase() as typeof SUPPORTED_FORMATS[number]) || 
        !SUPPORTED_FORMATS.includes(targetFormat.toLowerCase() as typeof SUPPORTED_FORMATS[number])) {
      return {
        success: false,
        error: `Unsupported image format. Supported formats are: ${SUPPORTED_FORMATS.join(', ')}`,
        fileName: file.name
      }
    }

    // Create temporary files
    const tempDir = tmpdir()
    const timestamp = Date.now()
    inputPath = join(tempDir, `${timestamp}-${file.name}`)
    outputPath = join(tempDir, `${timestamp}-${file.name.split('.')[0]}.${targetFormat}`)

    // Write uploaded file to temp directory
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(inputPath, buffer)

    try {
      // Get the correct Sharp format identifier
      const sharpFormat = SHARP_FORMATS[targetFormat.toLowerCase() as keyof typeof SHARP_FORMATS]
      if (!sharpFormat) {
        throw new Error(`Unsupported image format: ${targetFormat}`)
      }

      // Create Sharp instance
      let sharpInstance = sharp(buffer)

      // Get image metadata
      const metadata = await sharpInstance.metadata()

      // Validate image format
      if (!metadata.format || !SUPPORTED_FORMATS.includes(metadata.format as typeof SUPPORTED_FORMATS[number])) {
        throw new Error('Input file contains unsupported image format')
      }

      // Validate image dimensions
      if (metadata.width && metadata.width > MAX_IMAGE_DIMENSION) {
        throw new Error(`Image width (${metadata.width}px) exceeds maximum allowed dimension of ${MAX_IMAGE_DIMENSION}px`)
      }
      if (metadata.height && metadata.height > MAX_IMAGE_DIMENSION) {
        throw new Error(`Image height (${metadata.height}px) exceeds maximum allowed dimension of ${MAX_IMAGE_DIMENSION}px`)
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
      if (grayscale) {
        sharpInstance = sharpInstance.grayscale()
      }
      if (blur) {
        sharpInstance = sharpInstance.blur(blur)
      }
      if (sharpen) {
        sharpInstance = sharpInstance.sharpen(sharpen)
      }

      // Apply color adjustments
      if (brightness || contrast || saturation) {
        const modulateOptions: {
          brightness?: number
          saturation?: number
          lightness?: number
        } = {}

        if (brightness !== undefined) {
          modulateOptions.brightness = brightness / 100 + 1
        }
        if (saturation !== undefined) {
          modulateOptions.saturation = saturation / 100 + 1
        }
        if (contrast !== undefined) {
          modulateOptions.lightness = contrast / 100 + 1
        }

        // Only call modulate if we have at least one valid option
        if (Object.keys(modulateOptions).length > 0) {
          sharpInstance = sharpInstance.modulate(modulateOptions)
        }
      }

      // Apply filters
      if (filter && filter !== 'none') {
        switch (filter) {
          case 'sepia':
            sharpInstance = sharpInstance.modulate({ saturation: 0.5 }).tint('#FFE4C4')
            break
          case 'vintage':
            sharpInstance = sharpInstance.modulate({ brightness: 1.1, saturation: 0.8 }).tint('#E6D5AC')
            break
          case 'cool':
            sharpInstance = sharpInstance.modulate({ saturation: 1.2 }).tint('#B3E0FF')
            break
          case 'warm':
            sharpInstance = sharpInstance.modulate({ saturation: 1.2 }).tint('#FFE4B3')
            break
          case 'dramatic':
            sharpInstance = sharpInstance.modulate({ 
              brightness: 0.9, 
              saturation: 1.1,
              lightness: 1.2 
            })
            break
        }
      }

      // Apply resizing if dimensions are provided
      if (width || height) {
        sharpInstance = sharpInstance.resize({
          width: width,
          height: height,
          fit: fit,
          withoutEnlargement: true
        })
      }

      // Apply format-specific optimizations
      if (optimize) {
        switch (targetFormat) {
          case 'svg':
            // For SVG, we'll just pass through the file as is
            // since SVG is already a vector format and doesn't need optimization
            sharpInstance = sharpInstance
            break
          case 'jpeg':
            sharpInstance = sharpInstance.jpeg({
              quality: quality || 80,
              progressive: progressive || false,
              chromaSubsampling: '4:4:4',
              mozjpeg: true,
              trellisQuantisation: true,
              overshootDeringing: true,
              optimizeScans: true,
              // Social media specific optimizations
              ...(formData.get('socialMediaPlatform') === 'instagram' && {
                quality: 92,
                chromaSubsampling: '4:4:4'
              }),
              ...(formData.get('socialMediaPlatform') === 'facebook' && {
                quality: 85,
                chromaSubsampling: '4:2:0'
              }),
              ...(formData.get('socialMediaPlatform') === 'twitter' && {
                quality: 90,
                chromaSubsampling: '4:2:0'
              })
            })
            break
          case 'png':
            sharpInstance = sharpInstance.png({
              compressionLevel: 9,
              effort: 10,
              palette: true,
              colors: 256,
              dither: 1.0,
              progressive: progressive || false,
              // Social media specific optimizations
              ...(formData.get('socialMediaPlatform') === 'instagram' && {
                compressionLevel: 8,
                effort: 9
              }),
              ...(formData.get('socialMediaPlatform') === 'facebook' && {
                compressionLevel: 7,
                effort: 8
              }),
              ...(formData.get('socialMediaPlatform') === 'twitter' && {
                compressionLevel: 8,
                effort: 9
              })
            })
            break
          case 'webp':
            sharpInstance = sharpInstance.webp({
              quality: quality || 80,
              lossless: lossless || false,
              nearLossless: false,
              smartSubsample: true,
              effort: 6,
              // Social media specific optimizations
              ...(formData.get('socialMediaPlatform') === 'instagram' && {
                quality: 90,
                effort: 5
              }),
              ...(formData.get('socialMediaPlatform') === 'facebook' && {
                quality: 85,
                effort: 4
              }),
              ...(formData.get('socialMediaPlatform') === 'twitter' && {
                quality: 88,
                effort: 5
              })
            })
            break
          case 'avif':
            sharpInstance = sharpInstance.avif({
              quality: quality || 80,
              lossless: lossless || false,
              speed: 5,
              chromaSubsampling: '4:2:0',
              // Social media specific optimizations
              ...(formData.get('socialMediaPlatform') === 'instagram' && {
                quality: 90,
                speed: 4
              }),
              ...(formData.get('socialMediaPlatform') === 'facebook' && {
                quality: 85,
                speed: 5
              }),
              ...(formData.get('socialMediaPlatform') === 'twitter' && {
                quality: 88,
                speed: 4
              })
            })
            break
        }
      } else {
        // Apply basic format settings even when optimize is false
        switch (targetFormat) {
          case 'svg':
            // For SVG, we'll just pass through the file as is
            sharpInstance = sharpInstance
            break
          case 'jpeg':
            sharpInstance = sharpInstance.jpeg({
              quality: quality || 80,
              progressive: progressive || false
            })
            break
          case 'png':
            sharpInstance = sharpInstance.png({
              progressive: progressive || false
            })
            break
          case 'webp':
            sharpInstance = sharpInstance.webp({
              quality: quality || 80,
              lossless: lossless || false
            })
            break
          case 'avif':
            sharpInstance = sharpInstance.avif({
              quality: quality || 80,
              lossless: lossless || false
            })
            break
        }
      }

      // Process the image
      const outputBuffer = await sharpInstance.toBuffer()
      const outputMetadata = await sharpInstance.metadata()

      // Calculate compression ratio
      const originalSize = buffer.length
      const newSize = outputBuffer.length
      const compressionRatio = originalSize > 0 ? (1 - (newSize / originalSize)) * 100 : 0

      return {
        success: true,
        data: outputBuffer.toString('base64'),
        fileName: `${file.name.split('.')[0]}.${targetFormat}`,
        progress: 100,
        metadata: {
          width: outputMetadata.width,
          height: outputMetadata.height,
          format: outputMetadata.format,
          size: newSize,
          originalSize: originalSize,
          compressionRatio: compressionRatio
        }
      }
    } catch (error) {
      console.error('Image processing error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process image',
        fileName: file.name
      }
    }
  } catch (error) {
    console.error('File conversion error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed',
      fileName: 'unknown'
    }
  } finally {
    // Clean up temporary files
    try {
      if (inputPath) await unlink(inputPath).catch(() => {})
      if (outputPath) await unlink(outputPath).catch(() => {})
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError)
    }
  }
} 