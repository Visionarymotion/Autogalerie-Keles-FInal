import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware für Admin-Bereich Authentifizierung.
 * Schützt alle /admin/* Routes außer /admin/login
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Login-Seite ist öffentlich - immer durchlassen
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Für alle anderen /admin/* Routes: Cookie prüfen
  const adminSessionCookie = request.cookies.get('admin_session')?.value
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

  // Wenn Cookie nicht vorhanden oder nicht korrekt → Redirect zu Login
  if (!adminSessionCookie || adminSessionCookie !== expectedPassword) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Cookie ist gültig → durchlassen
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
