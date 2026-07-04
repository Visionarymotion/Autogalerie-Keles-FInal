import Link from 'next/link'
import { Phone, MapPin, MessageCircle, Clock } from 'lucide-react'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'

export default function Footer() {
  const year = new Date().getFullYear()

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
              className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-white/80 text-[12px] font-semibold tracking-widest uppercase hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-sm"
            >
              <MessageCircle size={13} strokeWidth={1.8} />
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
                  Mo–Sa: 09:00–18:00<br />
                  <span className="text-white/35">So: Geschlossen</span>
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
      </div>
    </footer>
  )
}
