'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, Clock } from 'lucide-react'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import { getOpeningStatus, type OpeningStatus } from '@/lib/opening-hours'

const navLinks = [
  { label: 'Fahrzeugbestand', href: '/fahrzeuge' },
  { label: 'Ankauf', href: '/ankauf' },
  { label: 'Finanzierung', href: '/finanzierungsrechner' },
  { label: 'Service', href: '/#leistungen' },
  { label: 'Über uns', href: '/#ueber-uns' },
  { label: 'Kontakt', href: '/#kontakt' },
]

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

function StatusBadge({ status }: { status: OpeningStatus | null }) {
  if (!status) return null
  return (
    <span
      className={`flex items-center gap-1.5 text-[11.5px] font-medium ${
        status.isOpen ? (status.closingSoon ? 'text-amber-400' : 'text-emerald-400') : 'text-red-400'
      }`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {status.isOpen && !status.closingSoon && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            status.isOpen ? (status.closingSoon ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-red-400'
          }`}
        />
      </span>
      {status.label}
      {status.detail && (
        <span className="hidden text-muted-foreground font-normal lg:inline">· {status.detail}</span>
      )}
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState<OpeningStatus | null>(null)
  const todayHours = siteConfig.hours[getTodayIndex()]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Live-Status erst nach dem Mount berechnen (client-only), damit
    // Server- und Client-Render beim ersten Durchlauf identisch bleiben.
    setStatus(getOpeningStatus())
    const id = setInterval(() => setStatus(getOpeningStatus()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Info-Leiste: Öffnungszeiten + Live-Status + Telefon, immer sichtbar */}
      <div className="hidden md:block bg-[#0a0a0a] border-b border-border/60">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-9 flex items-center justify-end gap-6">
          <span className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
            <Clock size={12} strokeWidth={1.8} className="text-[#c7c9cc]" />
            Heute: {todayHours.time}
          </span>
          <span className="w-px h-3.5 bg-border" />
          <StatusBadge status={status} />
          <span className="w-px h-3.5 bg-border" />
          <a
            href={`tel:+${siteConfig.contact.ctaWhatsapp}`}
            className="flex items-center gap-2 text-[11.5px] text-muted-foreground hover:text-[#c7c9cc] transition-colors"
          >
            <Phone size={12} strokeWidth={1.8} className="text-[#c7c9cc]" />
            {siteConfig.contact.ctaPhone}
          </a>
        </div>
      </div>

      <div
        className={`transition-all duration-400 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-gradient-to-b from-black/50 to-transparent md:bg-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between h-24 py-4">

            {/* Logo */}
            <Logo />

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7" aria-label="Hauptnavigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* CTA – desktop */}
            <div className="hidden lg:flex items-center gap-5">
              <a
                href={`tel:+${siteConfig.contact.ctaWhatsapp}`}
                className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-gold transition-colors duration-300 font-medium"
                aria-label={`Jetzt anrufen: ${siteConfig.contact.ctaPhone}`}
              >
                <Phone size={14} strokeWidth={1.8} />
                <span>{siteConfig.contact.ctaPhone}</span>
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.ctaWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-[12px] font-semibold tracking-widest uppercase hover:bg-[#20bd5a] transition-all duration-300 rounded-sm shadow-[0_0_0_0_rgba(37,211,102,0.5)] hover:shadow-[0_0_0_6px_rgba(37,211,102,0.15)]"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22h.01c5.52 0 10-4.48 10-10s-4.49-9.84-10.01-9.84Zm5.86 14.26c-.25.7-1.45 1.36-2 1.44-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.68-.63-2.96-1.28-4.89-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.18.01.44-.07.68.53.25.6.85 2.08.92 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13.99 2.08 1.3 2.38 1.45.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.77.84 2.08 1 .3.15.5.23.58.35.08.13.08.72-.17 1.42Z" />
                </svg>
                WhatsApp
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-background border-b border-border shadow-lg">
          <nav className="max-w-7xl mx-auto px-5 py-7 flex flex-col gap-5" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] tracking-wide text-muted-foreground hover:text-gold transition-colors font-medium py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-5 border-t border-border flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} strokeWidth={1.5} />
                Heute: {todayHours.time}
                {status && (
                  <span
                    className={`ml-1 text-[12px] font-medium ${
                      status.isOpen ? (status.closingSoon ? 'text-amber-500' : 'text-emerald-500') : 'text-red-500'
                    }`}
                  >
                    · {status.label}
                  </span>
                )}
              </div>
              <a
                href={`tel:+${siteConfig.contact.ctaWhatsapp}`}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Phone size={14} strokeWidth={1.5} />
                {siteConfig.contact.ctaPhone}
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.ctaWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-center px-6 py-3 bg-[#25D366] text-white text-sm font-semibold tracking-wider uppercase rounded-sm"
                onClick={() => setMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22h.01c5.52 0 10-4.48 10-10s-4.49-9.84-10.01-9.84Zm5.86 14.26c-.25.7-1.45 1.36-2 1.44-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.68-.63-2.96-1.28-4.89-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.18.01.44-.07.68.53.25.6.85 2.08.92 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13.99 2.08 1.3 2.38 1.45.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.77.84 2.08 1 .3.15.5.23.58.35.08.13.08.72-.17 1.42Z" />
                </svg>
                WhatsApp schreiben
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
