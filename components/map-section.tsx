'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const CONSENT_KEY = 'maps-consent'

/**
 * DSGVO: Google Maps setzt beim Laden des iframes eigene Cookies und
 * überträgt die IP-Adresse an Google-Server (auch in die USA) - das darf
 * ohne Einwilligung nicht automatisch passieren. Deshalb zeigen wir zuerst
 * eine neutrale Vorschau und laden die echte Karte erst nach Klick auf
 * "Karte laden". Die Zustimmung wird lokal gemerkt, damit sie nicht bei
 * jedem Besuch erneut nötig ist.
 */
export default function MapSection() {
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem(CONSENT_KEY) === 'true') {
      setConsent(true)
    }
  }, [])

  const grantConsent = () => {
    window.localStorage.setItem(CONSENT_KEY, 'true')
    setConsent(true)
  }

  if (!consent) {
    return (
      <div className="w-full h-72 md:h-[420px] bg-surface border-t border-border flex flex-col items-center justify-center gap-4 px-6 text-center">
        <MapPin size={28} strokeWidth={1.5} className="text-gold" />
        <div>
          <p className="text-[14px] font-medium text-foreground mb-1">{siteConfig.address.full}</p>
          <p className="text-[12.5px] text-muted-foreground max-w-sm">
            Beim Laden der Karte stellt Ihr Browser eine Verbindung zu Google her; dabei können
            Cookies gesetzt und Daten in die USA übertragen werden.
          </p>
        </div>
        <button
          onClick={grantConsent}
          className="px-5 py-2.5 bg-gold text-primary-foreground text-[12px] font-semibold tracking-widest uppercase hover:bg-gold/90 transition-all duration-300 rounded-sm"
        >
          Karte laden
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-72 md:h-[420px] bg-surface border-t border-border overflow-hidden">
      <iframe
        title={`${siteConfig.name} – ${siteConfig.address.full}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address.mapsQuery)}&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'grayscale(0.3) contrast(1.05)' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
