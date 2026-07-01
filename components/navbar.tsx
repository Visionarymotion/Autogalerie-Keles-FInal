'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, Clock } from 'lucide-react'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'

const navLinks = [
  { label: 'Fahrzeugbestand', href: '/fahrzeuge' },
  { label: 'Service', href: '/#leistungen' },
  { label: 'Über uns', href: '/#ueber-uns' },
  { label: 'Kontakt', href: '/#kontakt' },
]

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const todayHours = siteConfig.hours[getTodayIndex()]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Info-Leiste: Öffnungszeiten + Telefon, immer sichtbar */}
      <div className="hidden md:block bg-[#0a0a0a] border-b border-border/60">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-9 flex items-center justify-end gap-6">
          <span className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
            <Clock size={12} strokeWidth={1.8} className="text-[#c7c9cc]" />
            Heute: {todayHours.time}
          </span>
          <span className="w-px h-3.5 bg-border" />
          <a
            href={`tel:+${siteConfig.contact.whatsapp}`}
            className="flex items-center gap-2 text-[11.5px] text-muted-foreground hover:text-[#c7c9cc] transition-colors"
          >
            <Phone size={12} strokeWidth={1.8} className="text-[#c7c9cc]" />
            {siteConfig.contact.phone}
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
              href={`tel:+${siteConfig.contact.whatsapp}`}
              className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-gold transition-colors duration-300 font-medium"
              aria-label={`Jetzt anrufen: ${siteConfig.contact.phone}`}
            >
              <Phone size={14} strokeWidth={1.8} />
              <span>{siteConfig.contact.phone}</span>
            </a>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gold text-white text-[12px] font-semibold tracking-widest uppercase hover:bg-gold/90 transition-all duration-300 rounded-sm"
            >
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
              <a
                href={`tel:+${siteConfig.contact.whatsapp}`}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Phone size={14} strokeWidth={1.5} />
                {siteConfig.contact.phone}
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center px-6 py-3 bg-gold text-white text-sm font-semibold tracking-wider uppercase rounded-sm"
                onClick={() => setMenuOpen(false)}
              >
                WhatsApp schreiben
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
