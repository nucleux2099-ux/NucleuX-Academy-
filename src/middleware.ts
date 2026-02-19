import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth/callback',
  // Marketing/public pages
  '/campus',
  '/pricing',
  '/about',
  '/faq',
  '/contact',
  '/atom',
  '/rooms',
  // Misc public
  '/landing',
  '/demo',
  '/terms',
  '/privacy',
  '/offline',
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/signup']

// Routes that should redirect authenticated users to dashboard (landing pages)
const landingRoutes = ['/', '/landing']

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if current path is an auth route (login/signup)
  const isAuthRoute = authRoutes.some(route => pathname === route)

  // Check if current path is a landing route
  const isLandingRoute = landingRoutes.some(route => pathname === route)

  // If user is authenticated and on landing page or auth routes, redirect to dashboard
  if (user && (isAuthRoute || isLandingRoute)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If route is not public and user is not authenticated, redirect to login
  if (!isPublicRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
