import { NextRequest, NextResponse } from 'next/server'
import { convertFile } from '@/app/actions/fileConverter'
import { headers } from 'next/headers'
import { UsageTracker } from '@/lib/usage'
import { getPlan, canUseFeature } from '@/lib/pricing'

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
  const extension = file.name.toLowerCase().split('.').pop()
  if (!extension || !ALLOWED_FORMATS.includes(extension)) {
    return false
  }
  
  const allowedMimeTypes = [
    'image/png',
    'image/jpeg', 
    'image/jpg',
    'image/webp',
    'image/avif'
  ]
  
  return allowedMimeTypes.includes(file.type)
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
          fileName: 'unknown',
          upgrade: true
        },
        { status: 429 }
      )
    }
    
    // Get user/session info
    const userId = request.headers.get('x-user-id') // From auth
    const sessionId = request.headers.get('x-session-id') || 'anonymous'
    
    // Check usage limits
    const usageTracker = UsageTracker.getInstance()
    const usageCheck = await usageTracker.canConvert(userId || undefined, sessionId)
    
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Usage limit exceeded. You have ${usageCheck.remaining} conversions remaining on the ${usageCheck.plan} plan.`,
          fileName: 'unknown',
          upgrade: true,
          plan: usageCheck.plan,
          remaining: usageCheck.remaining
        },
        { status: 402 } // Payment Required
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
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No file provided',
          fileName: 'unknown'
        },
        { status: 400 }
      )
    }
    
    // Check file size limits based on plan
    const userPlan = getPlan(usageCheck.plan)
    const maxFileSize = userPlan.limits.fileSize * 1024 * 1024 // Convert MB to bytes
    
    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size for ${userPlan.name} plan is ${userPlan.limits.fileSize}MB`,
          fileName: file.name,
          upgrade: true,
          plan: usageCheck.plan
        },
        { status: 413 }
      )
    }
    
    // Validate file type
    if (!validateFileType(file)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type. Only PNG, JPG, WebP, and AVIF are allowed',
          fileName: file.name
        },
        { status: 400 }
      )
    }
    
    // Check creative effects permission
    const creativeEffect = formData.get('creativeEffect') as string
    if (creativeEffect && creativeEffect !== 'none' && !canUseFeature(usageCheck.plan, 'creativeEffects')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creative effects require Pro plan or higher',
          fileName: file.name,
          upgrade: true,
          plan: usageCheck.plan
        },
        { status: 402 }
      )
    }
    
    // Process file with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Processing timeout')), MAX_PROCESSING_TIME)
    })
    
    const conversionPromise = convertFile(formData)
    const result = await Promise.race([conversionPromise, timeoutPromise])
    
    if (typeof result === 'object' && result !== null && 'success' in result) {
      // Increment usage on successful conversion
      if (result.success) {
        await usageTracker.incrementUsage(userId || undefined, sessionId)
        
        // Add watermark for free users
        if (usageCheck.plan === 'free' && !canUseFeature(usageCheck.plan, 'watermarkRemoval')) {
          // Note: Watermark would be added during processing
          // For now, we'll add a flag to indicate watermarked output
          (result as any).watermarked = true
        }
      }
      
      // Add usage info to response
      const updatedUsage = await usageTracker.canConvert(userId || undefined, sessionId)
      
      return NextResponse.json({
        ...result,
        processingTime: Date.now() - startTime,
        serverProcessed: true,
        usage: {
          plan: updatedUsage.plan,
          remaining: updatedUsage.remaining,
          unlimited: updatedUsage.remaining === -1
        }
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
    
    const isTimeout = error instanceof Error && error.message === 'Processing timeout'
    const errorMessage = isTimeout 
      ? 'File processing timed out. Please try with a smaller file or upgrade for faster processing.'
      : 'Internal server error during conversion'
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        fileName: 'unknown',
        serverProcessed: true,
        upgrade: isTimeout
      },
      { status: isTimeout ? 408 : 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
