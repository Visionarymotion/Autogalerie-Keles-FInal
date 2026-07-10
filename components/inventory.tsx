import Image from 'next/image'
import Link from 'next/link'
import { Fuel, Gauge, Calendar, Zap, ArrowRight, ExternalLink, ImageOff } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { getFeaturedVehicles } from '@/lib/vehicle-store'
import { formatPrice, formatKm, type Vehicle } from '@/lib/vehicles-data'
import { Reveal } from '@/components/reveal'

function WhatsAppIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77 0.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.89 14.32c-0.25 0.7-1.24 1.28-2.02 1.45-0.54 0.11-1.24 0.2-3.62-0.78-2.9-1.2-4.77-4.15-4.92-4.34-0.14-0.19-1.18-1.57-1.18-3 0-1.42 0.75-2.12 1.02-2.41 0.27-0.29 0.58-0.36 0.78-0.36 0.19 0 0.39 0 0.56 0.01 0.18 0.01 0.42-0.07 0.66 0.5 0.25 0.59 0.84 2.05 0.92 2.2 0.08 0.15 0.13 0.32 0.03 0.51-0.1 0.19-0.15 0.3-0.29 0.47-0.15 0.16-0.31 0.36-0.44 0.49-0.15 0.15-0.3 0.3-0.13 0.6 0.17 0.29 0.75 1.24 1.61 2.01 1.11 0.99 2.04 1.3 2.34 1.45 0.29 0.15 0.47 0.13 0.64-0.05 0.18-0.19 0.73-0.85 0.92-1.14 0.19-0.29 0.39-0.24 0.65-0.14 0.27 0.1 1.7 0.8 1.99 0.95 0.29 0.15 0.48 0.22 0.55 0.34 0.08 0.13 0.08 0.72-0.17 1.42Z" />
    </svg>
  )
}

function CarCard({ car }: { car: Vehicle }) {
  const photo = car.photos[0] ?? null
  const waHref = `https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent(`Hallo, ich interessiere mich für den ${car.brand} ${car.model}.`)}`
  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#c7c9cc]/40 transition-all duration-500 hover:-translate-y-1.5 flex flex-col">
      <Link
        href={`/fahrzeuge/${car.slug}`}
        className="flex flex-col flex-1"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-surface">
          {photo ? (
            <Image
              src={photo}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1c1c1a] to-[#111110]">
              <ImageOff size={22} strokeWidth={1.3} className="text-muted-foreground/40" />
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground/50">Foto folgt</span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-dark/85 backdrop-blur-sm rounded-sm px-2.5 py-1.5 border border-white/10">
            <span className="text-[13px] font-semibold text-white">{formatPrice(car.price)}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="mb-1">
            <p className="text-[10px] tracking-[0.28em] text-[#c7c9cc] uppercase font-semibold mb-0.5">{car.brand}</p>
            <h3 className="text-[16px] font-[var(--font-heading)] font-semibold text-foreground leading-snug">{car.model}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{car.detail}</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap pt-3.5 mt-auto border-t border-border">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Gauge size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />
              {formatKm(car.km)}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Fuel size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />
              {car.fuel}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Zap size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />
              {car.powerPs} PS
            </span>
          </div>

          <span className="mt-4 flex items-center justify-center gap-2 py-2.5 bg-surface border border-border text-[12px] font-semibold tracking-wide text-foreground rounded-sm group-hover:bg-[#c7c9cc] group-hover:text-background group-hover:border-[#c7c9cc] transition-all duration-300">
            Details ansehen
            <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${car.brand} ${car.model} per WhatsApp anfragen`}
        className="absolute top-3 left-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-lg transition-colors duration-300"
      >
        <WhatsAppIcon size={16} />
      </a>
    </div>
  )
}

export default async function Inventory() {
  const featuredVehicles = await getFeaturedVehicles()

  return (
    <section id="fahrzeuge" className="py-24 px-5 lg:px-10 bg-background">
      <div className="max-w-7xl mx-auto">

        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-px bg-[#c7c9cc]" />
                <span className="text-[11px] tracking-[0.3em] text-[#c7c9cc] uppercase font-semibold">Aktuelle Highlights</span>
              </div>
              <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold text-balance">
                Unsere Fahrzeuge
              </h2>
            </div>
            <Link
              href="/fahrzeuge"
              className="inline-flex items-center gap-1.5 text-[12px] text-[#c7c9cc] font-medium hover:underline"
            >
              Alle Fahrzeuge ansehen
              <ExternalLink size={11} strokeWidth={2} />
            </Link>
          </div>
        </Reveal>

        <div className="divider-gold mb-8 mt-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredVehicles.map((car, i) => (
            <Reveal key={car.id} delay={i * 90}>
              <CarCard car={car} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/fahrzeuge"
            className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-foreground text-foreground text-[13px] font-semibold tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300 rounded-sm"
          >
            Alle Fahrzeuge ansehen
            <ArrowRight size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href={`https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent('Hallo, ich suche ein bestimmtes Fahrzeug und würde mich gerne beraten lassen.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-pulse group inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white text-[13px] font-semibold tracking-widest uppercase hover:bg-[#22bf5d] transition-all duration-300 rounded-sm"
          >
            <WhatsAppIcon size={15} />
            Wunschfahrzeug anfragen
          </a>
        </div>
      </div>
    </section>
  )
}
