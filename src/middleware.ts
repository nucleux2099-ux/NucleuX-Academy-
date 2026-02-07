import { NextResponse, type NextRequest } from 'next/server'

// Auth middleware disabled for development
// TODO: Re-enable when Supabase auth is ready

export async function middleware(request: NextRequest) {
  // Pass through all requests without auth check
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
