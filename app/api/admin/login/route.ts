import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()
  // Fallback zu 'admin123' wenn ADMIN_PASSWORD nicht gesetzt ist (für Development/Testing)
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (!validPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD ist auf dem Server nicht gesetzt. Bitte in Vercel unter Environment Variables anlegen.' },
      { status: 500 }
    )
  }

  if (password !== validPassword) {
    return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 Tage
  })
  return response
}
