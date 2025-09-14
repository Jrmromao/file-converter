import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Security headers for all responses
  const response = NextResponse.next()
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self';"
  )

  // API-specific security for conversion endpoint
  if (request.nextUrl.pathname === '/api/convert') {
    // Only allow POST requests
    if (request.method !== 'POST') {
      return new NextResponse('Method not allowed', { status: 405 })
    }
    
    // Check Content-Type
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return new NextResponse('Invalid content type', { status: 400 })
    }
    
    // Add processing headers
    response.headers.set('X-Processing-Server', 'true')
  }
  
  return response
}

export const config = {
  matcher: [
    '/api/convert',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
