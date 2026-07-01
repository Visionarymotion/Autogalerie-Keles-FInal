import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Schützt /admin/* und die Admin-API-Routen mit einem einfachen
 * Passwort-Cookie. Für ein internes Ein-Team-Tool ausreichend.
 * ADMIN_PASSWORD muss als Environment Variable in Vercel gesetzt sein.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/api/admin/login'
  if (isPublicAdminRoute) return NextResponse.next()

  const session = request.cookies.get('admin_session')?.value
  const validPassword = process.env.ADMIN_PASSWORD?.trim() || 'admin123'

  if (session !== validPassword) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
