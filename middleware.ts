import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware für Admin-Bereich Authentifizierung.
 * Schützt alle /admin/* Routes außer /admin/login
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Login-Seite ist immer öffentlich
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Für alle anderen /admin/* Routes: Session prüfen
  const sessionCookie = request.cookies.get('admin_session')?.value
  const correctPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (sessionCookie !== correctPassword) {
    // Kein gültiges Session-Cookie → zur Login-Seite
    const url = new URL('/admin/login', request.url)
    return NextResponse.redirect(url)
  }

  // Session ist gültig → durchlassen
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
