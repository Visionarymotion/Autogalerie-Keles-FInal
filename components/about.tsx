import Image from 'next/image'
import { CheckCircle2, Star } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const values = [
  'Sorgfältige technische Prüfung vor jedem Verkauf',
  'Ehrlichkeit und Transparenz bei jedem Fahrzeug',
  'Faire Marktpreise – keine versteckten Kosten',
  'Persönliche Beratung ohne Kaufdruck',
  'Schnelle und unkomplizierte Abwicklung',
  'Finanzierung und Inzahlungnahme aus einer Hand',
]

export default function About() {
  return (
    <section id="ueber-uns" className="py-24 px-5 lg:px-10 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl bg-dark">
              {/*
                Echtes Teamfoto (vom Kunden bereitgestellt, hohe
                Auflösung) — ersetzt den früheren Platzhalter aus
                dem Video-Standbild.
              */}
              <Image
                src="/images/team-real.jpg"
                alt={`Das Team von ${siteConfig.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 bg-dark/70 backdrop-blur-sm rounded-md px-3 py-1.5">
                <p className="text-[11px] text-white/80 tracking-wide">Unser Team in {siteConfig.address.city}</p>
              </div>
            </div>

            {/* Stats bar — nur verifizierte Werte */}
            <div className="absolute -bottom-6 left-4 right-4 md:left-8 md:right-8 bg-card rounded-lg shadow-xl border border-border px-6 py-5 flex items-center justify-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={15} fill="#c7c9cc" strokeWidth={0} />
                ))}
              </div>
              <p className="text-[15px] font-[var(--font-heading)] font-semibold text-foreground leading-none">
                {siteConfig.rating.value.toFixed(1)} / 5
              </p>
              <span className="text-[12px] text-muted-foreground">
                · {siteConfig.rating.count} echte Bewertungen auf {siteConfig.rating.source}
              </span>
            </div>

            {/* Gold accent */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-gold rounded-tl-lg hidden md:block" />

            {/* Mini-Galerie: Außenansicht + Fahrzeuge vor Ort — wie im Rundgangs-Video */}
            <div className="grid grid-cols-2 gap-3 mt-10">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-dark">
                <Image
                  src="/images/dealership-real.jpg"
                  alt="Außenansicht Autogalerie Keles"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute bottom-2 left-2 bg-dark/70 backdrop-blur-sm rounded px-2 py-1">
                  <p className="text-[10px] text-white/80">Unser Standort</p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-dark">
                <Image
                  src="/images/location_cars-real-temp.png"
                  alt="Fahrzeuge auf dem Hof der Autogalerie Keles"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute bottom-2 left-2 bg-dark/70 backdrop-blur-sm rounded px-2 py-1">
                  <p className="text-[10px] text-white/80">Unser Bestand</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2 pb-6 lg:pb-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-px bg-gold" />
              <span className="text-[11px] tracking-[0.3em] text-gold uppercase font-semibold">Über uns</span>
            </div>
            <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold mb-5 text-balance">
              Ihr vertrauensvoller Partner für Gebrauchtwagen
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
              {siteConfig.name} steht für zuverlässigen Service und eine sorgfältig ausgewählte
              Auswahl an Gebrauchtwagen aller Marken in {siteConfig.address.city}. Unser Anspruch:
              Jeder Kunde soll mit einem guten Gefühl nach Hause fahren.
            </p>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-9">
              Wir beraten Sie persönlich, ehrlich und kompetent — ohne Verkaufsdruck. Besuchen Sie uns
              in der {siteConfig.address.street} oder schreiben Sie uns einfach auf WhatsApp.
            </p>

            {/* Values */}
            <ul className="space-y-2.5 mb-9" aria-label="Unsere Werte">
              {values.map((v) => (
                <li key={v} className="flex items-start gap-3">
                  <CheckCircle2 size={16} strokeWidth={1.8} className="text-gold mt-0.5 flex-shrink-0" />
                  <span className="text-[13px] text-foreground">{v}</span>
                </li>
              ))}
            </ul>

            <a
              href="#kontakt"
              className="group inline-flex items-center gap-2 text-[13px] font-semibold text-gold tracking-wider uppercase border-b-2 border-gold/40 pb-0.5 hover:border-gold transition-colors duration-300"
            >
              Uns kennenlernen
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
