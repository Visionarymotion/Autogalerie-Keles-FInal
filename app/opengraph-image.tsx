import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { siteConfig } from '@/lib/site-config'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Gebrandetes OG-Bild statt Rohfoto (dealership-real.jpg) – WhatsApp ist
// bei diesem Kunden ein Hauptkanal, ein generisches Standort-Foto ohne
// Logo/Claim verschenkt dort Wiedererkennung. Chrome-K-Icon als Data-URI
// eingebettet (klein genug, keine Netzwerk-Abhängigkeit beim Rendern).
export default async function OpengraphImage() {
  const iconPath = join(process.cwd(), 'app', 'apple-icon.png')
  const iconBase64 = readFileSync(iconPath).toString('base64')
  const iconSrc = `data:image/png;base64,${iconBase64}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0e0e0e',
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(199,201,204,0.14) 0%, rgba(14,14,14,0) 55%)',
        }}
      >
        <img
          src={iconSrc}
          alt=""
          width={112}
          height={112}
          style={{ borderRadius: 12, marginBottom: 36 }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 66,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: -1,
          }}
        >
          Autogalerie Keles
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 20,
            width: 90,
            height: 2,
            backgroundColor: '#c7c9cc',
          }}
        />
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 30,
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Geprüfte Gebrauchtwagen in {siteConfig.address.city}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 24,
            color: '#c7c9cc',
            letterSpacing: 2,
          }}
        >
          {siteConfig.rating.value.toFixed(1)} VON 5 · {siteConfig.rating.count}+ BEWERTUNGEN AUF {siteConfig.rating.source.toUpperCase()}
        </div>
      </div>
    ),
    { ...size },
  )
}
