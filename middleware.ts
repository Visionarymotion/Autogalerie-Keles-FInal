import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Alle /admin/login Requests erlauben (öffentlich)
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Alles andere unter /admin blockieren und zu Login redirect
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
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
