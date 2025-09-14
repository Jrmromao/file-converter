import { NextRequest, NextResponse } from 'next/server'
import { convertFile } from '@/app/actions/fileConverter'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await convertFile(formData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Conversion failed',
        fileName: 'unknown'
      },
      { status: 500 }
    )
  }
}
