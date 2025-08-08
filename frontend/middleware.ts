// @ts-nocheck
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')
  const url = request.nextUrl.clone()
  
  // If user is on login page and already authenticated, redirect to home
  if (url.pathname === '/login' && accessToken) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  
  // If user is trying to access protected routes without authentication, redirect to login
  if (!accessToken && url.pathname !== '/login' && !url.pathname.startsWith('/api/auth')) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}