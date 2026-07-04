import { NextRequest } from 'next/server'

// Proxy für mobile.de-Fahrzeugfotos.
// classistatic.de (mobile.de's Bilder-CDN) liefert unter dem reinen
// Bild-Pfad ohne Render-Regel einen Fehler zurück - es wird zwingend der
// Query-Parameter "rule" benötigt (z.B. "mo-1600" für die 1600px-Variante).
// Dieser Server-Route-Handler ergänzt die Regel serverseitig, holt das Bild
// mit einem mobile.de-Referer (zusätzliche Absicherung) und reicht es
// unverändert an den Browser weiter.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const upstreamUrl = `https://img.classistatic.de/api/v1/mo-prod/images/${path.join('/')}?rule=mo-1600`

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        Referer: 'https://home.mobile.de/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
      },
      cache: 'no-store',
    })

    if (!upstream.ok || !upstream.body) {
      return new Response('Bild nicht verfügbar', { status: 502 })
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg'
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=2592000, immutable',
      },
    })
  } catch {
    return new Response('Bild nicht verfügbar', { status: 502 })
  }
}
