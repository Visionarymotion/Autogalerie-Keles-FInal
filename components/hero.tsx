'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ChevronDown, Star } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

/**
 * Dezenter Count-up für die Trust-Zahlen: zählt beim ersten Rendern in ~1.2s
 * mit Ease-out auf den Zielwert hoch. Läuft nur einmal; bei
 * prefers-reduced-motion wird sofort der Endwert gezeigt.
 */
function CountUp({ to, decimals = 0, duration = 1200 }: { to: number; decimals?: number; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{val.toFixed(decimals)}</>
}

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden bg-dark">

      {/* Echtes Standort-Foto (von euch bereitgestellt) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            transform: visible ? 'scale(1)' : 'scale(1.08)',
            transition: 'transform 7s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Image
            src="/images/dealership-real.jpg"
            alt="Autogalerie Keles – unser Standort"
            fill
            priority
            className="object-cover object-center"
            style={{ filter: 'brightness(0.8) contrast(1.12) saturate(1.18)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/92 via-[#0a0a0a]/48 to-[#0a0a0a]/12" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/78 via-transparent to-[#0a0a0a]/22" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto w-full px-5 lg:px-10 pt-40 pb-20">
        <div
          className="max-w-2xl min-w-0"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.85s ease, transform 0.85s ease',
          }}
        >
          {/* Echte Bewertung – verlinkt & nachprüfbar */}
          <a
            href={siteConfig.rating.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-8 hover:bg-white/15 transition-colors"
          >
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} fill="#c7c9cc" strokeWidth={0} />
              ))}
            </div>
            <span className="text-white/90 text-[11px] tracking-wider font-medium">
              {siteConfig.rating.value.toFixed(1)} · {siteConfig.rating.count} Bewertungen auf {siteConfig.rating.source}
            </span>
          </a>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-gold" />
            <span className="text-[11px] tracking-[0.35em] text-gold uppercase font-semibold">Ihr Händler in {siteConfig.address.city}</span>
          </div>

          {/* Headline */}
          <h1 className="font-[var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.06] tracking-tight text-white mb-5">
            Gebrauchtwagen,{' '}
            <span style={{ color: '#dcdddd' }}>die überzeugen.</span>
          </h1>

          {/* Sub */}
          <p className="text-[16px] text-white/65 leading-relaxed mb-10 max-w-lg">
            {siteConfig.name} — Ihr vertrauensvoller Partner für geprüfte Fahrzeuge aller Marken.
            Persönliche Beratung. Faire Preise. Schnelle Abwicklung.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#fahrzeuge"
              className="btn-shine group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gold text-primary-foreground font-semibold text-[13px] tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-all duration-300"
            >
              Alle Fahrzeuge
              <ArrowRight size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white/80 text-[13px] tracking-widest uppercase hover:border-white/60 hover:text-white transition-all duration-300 rounded-sm"
            >
              Kontakt
            </a>
          </div>

          {/* Trust stats */}
          <div
            className="mt-14 flex flex-wrap items-center gap-8 pt-8 border-t border-white/12"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 1.1s ease 0.5s',
            }}
          >
            <div>
              <p className="text-[28px] font-[var(--font-heading)] text-white font-semibold"><CountUp to={siteConfig.rating.value} decimals={1} />★</p>
              <p className="text-[10px] tracking-[0.25em] text-white/50 uppercase mt-0.5"><CountUp to={siteConfig.rating.count} />+ Bewertungen</p>
            </div>
            <div className="w-px h-9 bg-white/15" />
            <div>
              <p className="text-[28px] font-[var(--font-heading)] text-white font-semibold">Alle</p>
              <p className="text-[10px] tracking-[0.25em] text-white/50 uppercase mt-0.5">Marken</p>
            </div>
            <div className="w-px h-9 bg-white/15" />
            <div>
              <p className="text-[28px] font-[var(--font-heading)] text-white font-semibold">2021</p>
              <p className="text-[10px] tracking-[0.25em] text-white/50 uppercase mt-0.5">In {siteConfig.address.city}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#fahrzeuge"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/40 hover:text-gold transition-colors duration-300"
        aria-label="Nach unten scrollen"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase">Scrollen</span>
        <ChevronDown size={18} strokeWidth={1.5} className="animate-bounce" />
      </a>
    </section>
  )
}
