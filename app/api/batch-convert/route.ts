import { NextRequest, NextResponse } from 'next/server'
import { convertFile } from '@/app/actions/fileConverter'
import { UsageTracker } from '@/lib/usage'
import { getPlan, canUseFeature } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Get user/session info
    const userId = request.headers.get('x-user-id')
    const sessionId = request.headers.get('x-session-id') || 'anonymous'
    
    // Check usage limits
    const usageTracker = UsageTracker.getInstance()
    const usageCheck = await usageTracker.canConvert(userId || undefined, sessionId)
    
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Usage limit exceeded. Upgrade to continue batch processing.`,
          upgrade: true,
          plan: usageCheck.plan
        },
        { status: 402 }
      )
    }
    
    // Parse form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const outputFormat = formData.get('outputFormat') as string
    const quality = formData.get('quality') as string
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }
    
    // Check batch processing permission
    const userPlan = getPlan(usageCheck.plan)
    const maxBatchSize = userPlan.limits.batchSize
    
    if (files.length > maxBatchSize) {
      return NextResponse.json(
        {
          success: false,
          error: `Batch limit exceeded. ${userPlan.name} plan allows ${maxBatchSize} files per batch.`,
          upgrade: true,
          plan: usageCheck.plan,
          maxBatchSize
        },
        { status: 402 }
      )
    }
    
    // Check if user has enough conversions remaining
    if (usageCheck.remaining !== -1 && usageCheck.remaining < files.length) {
      return NextResponse.json(
        {
          success: false,
          error: `Not enough conversions remaining. You have ${usageCheck.remaining} conversions left, but trying to convert ${files.length} files.`,
          upgrade: true,
          plan: usageCheck.plan,
          remaining: usageCheck.remaining
        },
        { status: 402 }
      )
    }
    
    // Process files sequentially
    const results = []
    let successCount = 0
    let failCount = 0
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        // Check individual file size limit
        const maxFileSize = userPlan.limits.fileSize * 1024 * 1024
        if (file.size > maxFileSize) {
          results.push({
            fileName: file.name,
            success: false,
            error: `File too large. Maximum size for ${userPlan.name} plan is ${userPlan.limits.fileSize}MB`
          })
          failCount++
          continue
        }
        
        // Create individual form data
        const individualFormData = new FormData()
        individualFormData.append('file', file)
        individualFormData.append('fromFormat', file.name.split('.').pop()?.toLowerCase() || 'png')
        individualFormData.append('toFormat', outputFormat)
        individualFormData.append('quality', quality)
        
        // Convert file
        const result = await convertFile(individualFormData)
        
        if (result.success) {
          // Increment usage for successful conversion
          await usageTracker.incrementUsage(userId || undefined, sessionId)
          successCount++
          
          results.push({
            fileName: file.name,
            success: true,
            data: result.data,
            convertedFileName: result.fileName,
            metadata: result.metadata
          })
        } else {
          failCount++
          results.push({
            fileName: file.name,
            success: false,
            error: result.error || 'Conversion failed'
          })
        }
        
      } catch (error) {
        failCount++
        results.push({
          fileName: file.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    // Get updated usage info
    const updatedUsage = await usageTracker.canConvert(userId || undefined, sessionId)
    
    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: files.length,
        successful: successCount,
        failed: failCount,
        processingTime: Date.now() - startTime
      },
      usage: {
        plan: updatedUsage.plan,
        remaining: updatedUsage.remaining,
        unlimited: updatedUsage.remaining === -1
      }
    })
    
  } catch (error) {
    console.error('Batch conversion error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Batch conversion failed',
        serverProcessed: true
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
