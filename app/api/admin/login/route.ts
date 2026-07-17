import { NextResponse } from 'next/server'
import { createSessionToken } from '@/lib/admin-session'

// Einfaches In-Memory-Rate-Limiting gegen Brute-Force auf das Admin-Passwort.
// Läuft pro warmer Serverless-Instanz – kein verteilter Speicher nötig für
// dieses Traffic-Volumen, reicht aber, um automatisiertes Durchprobieren
// spürbar zu bremsen statt es unbegrenzt zuzulassen.
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000
const attempts = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  return forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const entry = attempts.get(ip)
  if (!entry) return false
  if (Date.now() > entry.resetAt) {
    attempts.delete(ip)
    return false
  }
  return entry.count >= MAX_ATTEMPTS
}

function recordFailedAttempt(ip: string) {
  const entry = attempts.get(ip)
  if (!entry || Date.now() > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS })
  } else {
    entry.count += 1
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.' },
      { status: 429 },
    )
  }

  const { password } = await request.json()
  const validPassword = process.env.ADMIN_PASSWORD?.trim()
  if (!validPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD ist auf dem Server nicht gesetzt. Bitte in Vercel unter Environment Variables anlegen.' }, { status: 500 })
  }

  if (password !== validPassword) {
    recordFailedAttempt(ip)
    return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 })
  }

  attempts.delete(ip)

  const token = await createSessionToken()
  if (!token) {
    return NextResponse.json({ error: 'Sitzung konnte nicht erstellt werden.' }, { status: 500 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 Tage
  })
  return response
}
