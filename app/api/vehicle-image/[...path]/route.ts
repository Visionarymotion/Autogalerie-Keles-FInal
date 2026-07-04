import { NextRequest } from 'next/server'

// Proxy für mobile.de-Fahrzeugfotos.
// classistatic.de (mobile.de's Bilder-CDN) blockiert Hotlinking von
// fremden Domains (Referer-Check) - direkte <img src="https://img.classistatic.de/..."/>
// von unserer Seite aus schlagen deshalb fehl. Dieser Server-Route-Handler
// holt das Bild stattdessen serverseitig mit einem mobile.de-Referer und
// reicht es unverändert an den Browser weiter.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const upstreamUrl = `https://img.classistatic.de/api/v1/mo-prod/images/${path.join('/')}`

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
