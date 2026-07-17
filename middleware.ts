import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from '@/lib/admin-session'

// Öffentliche Seiten: statische CSP, 'unsafe-inline' für script-src.
// Bewusste Abwägung statt Nonce sitewide: eine Nonce-CSP zwingt jede Seite,
// die sie liest (via headers() in einer Server Component), in dynamisches
// SSR – das hätte alle bisher statisch generierten Marketing-Seiten
// (Startseite, Impressum, Leistungen …) ihre Static-Generation-Vorteile
// gekostet, für eine Seite ohne nennenswerte User-Generated-Content-Fläche.
// Der Admin-Bereich (Session-Cookie, Formulare) ist ohnehin immer dynamisch
// gerendert – dort lohnt sich die strengere Nonce-CSP ohne Zusatzkosten.
const PUBLIC_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.google.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

function buildAdminCsp(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}

/**
 * Schützt /admin/* und die Admin-API-Routen zentral mit einem
 * signierten Session-Token (siehe lib/admin-session.ts). War in der
 * hochgeladenen Version leer/verloren gegangen – dadurch war der
 * komplette Admin-Bereich inkl. aller API-Routen (Fahrzeuge anlegen/
 * löschen/ändern, Foto-Upload) OHNE Passwortschutz erreichbar. Jetzt
 * wiederhergestellt.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

  if (!isAdminRoute) {
    const response = NextResponse.next()
    response.headers.set('Content-Security-Policy', PUBLIC_CSP)
    return response
  }

  const nonce = crypto.randomUUID().replace(/-/g, '')
  const csp = buildAdminCsp(nonce)
  const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/api/admin/login'

  if (!isPublicAdminRoute) {
    const session = request.cookies.get('admin_session')?.value
    const isValid = await verifySessionToken(session)
    if (!isValid) {
      const response = pathname.startsWith('/api/')
        ? NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
        : NextResponse.redirect(new URL('/admin/login', request.url))
      response.headers.set('Content-Security-Policy', csp)
      return response
    }
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
