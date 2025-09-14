import { NextRequest, NextResponse } from 'next/server'
import { convertFile } from '@/app/actions/fileConverter'
import { headers } from 'next/headers'

// Security constants
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB hard limit
const ALLOWED_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'avif']
const RATE_LIMIT_PER_IP = 10 // requests per minute
const MAX_PROCESSING_TIME = 30000 // 30 seconds

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  return `rate_limit:${ip}`
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  
  const current = rateLimitMap.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= RATE_LIMIT_PER_IP) {
    return false
  }
  
  current.count++
  return true
}

function validateFileType(file: File): boolean {
  // Check file extension
  const extension = file.name.toLowerCase().split('.').pop()
  if (!extension || !ALLOWED_FORMATS.includes(extension)) {
    return false
  }
  
  // Basic MIME type check
  const allowedMimeTypes = [
    'image/png',
    'image/jpeg', 
    'image/jpg',
    'image/webp',
    'image/avif'
  ]
  
  return allowedMimeTypes.includes(file.type)
}

function validateFormData(formData: FormData): { 
  isValid: boolean
  error?: string
  file?: File
  fromFormat?: string
  toFormat?: string
} {
  const file = formData.get('file') as File
  const fromFormat = formData.get('fromFormat') as string
  const toFormat = formData.get('toFormat') as string
  
  // Check if file exists
  if (!file || !(file instanceof File)) {
    return { isValid: false, error: 'No file provided' }
  }
  
  // Check file size
  if (file.size === 0) {
    return { isValid: false, error: 'Empty file provided' }
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` }
  }
  
  // Validate file type
  if (!validateFileType(file)) {
    return { isValid: false, error: 'Invalid file type. Only PNG, JPG, WebP, and AVIF are allowed' }
  }
  
  // Validate formats
  if (!fromFormat || !ALLOWED_FORMATS.includes(fromFormat.toLowerCase())) {
    return { isValid: false, error: 'Invalid source format' }
  }
  
  if (!toFormat || !ALLOWED_FORMATS.includes(toFormat.toLowerCase())) {
    return { isValid: false, error: 'Invalid target format' }
  }
  
  return { 
    isValid: true, 
    file, 
    fromFormat: fromFormat.toLowerCase(), 
    toFormat: toFormat.toLowerCase() 
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          fileName: 'unknown'
        },
        { status: 429 }
      )
    }
    
    // Validate Content-Type
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid content type. Expected multipart/form-data',
          fileName: 'unknown'
        },
        { status: 400 }
      )
    }
    
    // Parse and validate form data
    const formData = await request.formData()
    const validation = validateFormData(formData)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          fileName: validation.file?.name || 'unknown'
        },
        { status: 400 }
      )
    }
    
    // Set processing timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Processing timeout')), MAX_PROCESSING_TIME)
    })
    
    // Process file with timeout
    const conversionPromise = convertFile(formData)
    const result = await Promise.race([conversionPromise, timeoutPromise])
    
    // Add processing metrics
    const processingTime = Date.now() - startTime
    
    if (typeof result === 'object' && result !== null && 'success' in result) {
      return NextResponse.json({
        ...result,
        processingTime,
        serverProcessed: true
      })
    }
    
    throw new Error('Invalid conversion result')
    
  } catch (error) {
    console.error('Conversion API error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    })
    
    // Don't expose internal errors to client
    const isTimeout = error instanceof Error && error.message === 'Processing timeout'
    const errorMessage = isTimeout 
      ? 'File processing timed out. Please try with a smaller file.'
      : 'Internal server error during conversion'
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        fileName: 'unknown',
        serverProcessed: true
      },
      { status: isTimeout ? 408 : 500 }
    )
  }
}

// Prevent GET requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
