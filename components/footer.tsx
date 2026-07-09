'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, MapPin, Clock } from 'lucide-react'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import { getOpeningStatus, type OpeningStatus } from '@/lib/opening-hours'

function WhatsAppIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22h.01c5.52 0 10-4.48 10-10s-4.49-9.84-10.01-9.84Zm5.86 14.26c-.25.7-1.45 1.36-2 1.44-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.68-.63-2.96-1.28-4.89-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.18.01.44-.07.68.53.25.6.85 2.08.92 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13.99 2.08 1.3 2.38 1.45.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.77.84 2.08 1 .3.15.5.23.58.35.08.13.08.72-.17 1.42Z" />
    </svg>
  )
}

function FooterStatusBadge({ status }: { status: OpeningStatus | null }) {
  if (!status) return null
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${
        status.isOpen ? (status.closingSoon ? 'text-amber-400' : 'text-emerald-400') : 'text-red-400'
      }`}
    >
      <span
        className={`inline-flex h-1.5 w-1.5 rounded-full ${
          status.isOpen ? (status.closingSoon ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-red-400'
        }`}
      />
      {status.isOpen ? status.label : `Aktuell ${status.label.toLowerCase()}`}
    </span>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const [status, setStatus] = useState<OpeningStatus | null>(null)

  useEffect(() => {
    setStatus(getOpeningStatus())
    const id = setInterval(() => setStatus(getOpeningStatus()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="text-white pt-16 pb-8 px-5 lg:px-10" style={{ backgroundColor: '#1c1812' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <Logo variant="light" />
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed max-w-xs mb-6">
              Ihr vertrauensvoller Gebrauchtwagen-Händler in {siteConfig.address.city}. Geprüfte Fahrzeuge aller Marken — fair, transparent und persönlich.
            </p>
            <a
              href={`https://wa.me/${siteConfig.contact.ctaWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white text-[12px] font-semibold tracking-widest uppercase hover:bg-[#20bd5a] transition-all duration-300 rounded-sm shadow-[0_0_0_0_rgba(37,211,102,0.5)] hover:shadow-[0_0_0_6px_rgba(37,211,102,0.15)]"
            >
              <WhatsAppIcon size={14} />
              WhatsApp schreiben
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[11px] tracking-widest text-white/40 uppercase mb-5 font-bold">Navigation</p>
            <ul className="space-y-3" aria-label="Footer Navigation">
              {[
                { label: 'Startseite', href: '/' },
                { label: 'Fahrzeuge', href: '/fahrzeuge' },
                { label: 'Leistungen', href: '/#leistungen' },
                { label: 'Finanzierungsrechner', href: '/finanzierungsrechner' },
                { label: 'Über uns', href: '/#ueber-uns' },
                { label: 'Kontakt', href: '/#kontakt' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/55 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] tracking-widest text-white/40 uppercase mb-5 font-bold">Kontakt</p>
            <ul className="space-y-4" aria-label="Kontaktinformationen">
              <li className="flex items-start gap-3">
                <MapPin size={13} strokeWidth={1.8} className="text-gold mt-0.5 flex-shrink-0" />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-white/55 hover:text-gold transition-colors leading-snug"
                >
                  {siteConfig.address.street}<br />{siteConfig.address.zip} {siteConfig.address.city}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={13} strokeWidth={1.8} className="text-gold flex-shrink-0" />
                <a href={`tel:+${siteConfig.contact.ctaWhatsapp}`} className="text-[13px] text-white/55 hover:text-gold transition-colors">
                  {siteConfig.contact.ctaPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={13} strokeWidth={1.8} className="text-gold mt-0.5 flex-shrink-0" />
                <div className="text-[13px] text-white/55 leading-snug">
                  <div>Mo–Sa: 09:00–18:00</div>
                  <div className="text-white/35 mb-1.5">So: Geschlossen</div>
                  <FooterStatusBadge status={status} />
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/30">
          <p>© {year} {siteConfig.name}. Alle Rechte vorbehalten.</p>
          <div className="flex items-center gap-6">
            <Link href="/impressum" className="hover:text-gold transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-gold transition-colors">Datenschutz</Link>
          </div>
        </div>

        {/* Agentur-Credit */}
        <div className="pt-4 text-center text-[11px] text-white/25">
          Realisiert von <span className="text-white/40">Visionary Motion</span>
        </div>
      </div>
    </footer>
  )
}
