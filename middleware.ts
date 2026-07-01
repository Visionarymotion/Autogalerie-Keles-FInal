import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Schützt /admin/* und die Admin-API-Routen zentral mit einem
 * Passwort-Cookie. War in der hochgeladenen Version leer/verloren
 * gegangen – dadurch war der komplette Admin-Bereich inkl. aller
 * API-Routen (Fahrzeuge anlegen/löschen/ändern, Foto-Upload) OHNE
 * Passwortschutz erreichbar. Jetzt wiederhergestellt.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/api/admin/login'
  if (isPublicAdminRoute) return NextResponse.next()

  const validPassword = process.env.ADMIN_PASSWORD
  const session = request.cookies.get('admin_session')?.value

  if (!validPassword || session !== validPassword) {
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
