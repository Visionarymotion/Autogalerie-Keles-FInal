import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { services } from '@/lib/services-data'

export default function Services() {
  return (
    <section id="leistungen" className="py-24 px-5 lg:px-10 section-alt">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-xl mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-px bg-gold" />
            <span className="text-[11px] tracking-[0.3em] text-gold uppercase font-semibold">Was wir bieten</span>
          </div>
          <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold text-balance">
            Unsere Leistungen
          </h2>
        </div>

        <div className="divider-gold mb-12 mt-6" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.slug}
                href={`/leistungen/${s.slug}`}
                className="block bg-card border border-border rounded-lg p-7 group hover:shadow-md hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <Icon size={20} strokeWidth={1.6} className="text-gold group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-[16px] font-[var(--font-heading)] font-semibold text-foreground mb-2.5">{s.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{s.shortText}</p>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gold">
                  Mehr erfahren
                  <ArrowRight size={13} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
