import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Login-Seiten sind immer öffentlich
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  // Nur /admin/* Seiten (nicht API) prüfen
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session')?.value
    const validPassword = process.env.ADMIN_PASSWORD?.trim() || 'admin123'

    if (session !== validPassword) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
