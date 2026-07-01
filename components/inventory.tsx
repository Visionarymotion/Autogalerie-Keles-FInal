import Image from 'next/image'
import Link from 'next/link'
import { Fuel, Gauge, Calendar, Zap, ArrowRight, MessageCircle, ExternalLink, ImageOff } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { getFeaturedVehicles } from '@/lib/vehicle-store'
import { formatPrice, formatKm, type Vehicle } from '@/lib/vehicles-data'

function CarCard({ car }: { car: Vehicle }) {
  const photo = car.photos[0] ?? null
  return (
    <Link
      href={`/fahrzeuge/${car.slug}`}
      className="group bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#c7c9cc]/40 transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
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
            <Calendar size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />
            {car.firstRegistration}
          </span>
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
  )
}

export default async function Inventory() {
  const featuredVehicles = await getFeaturedVehicles()

  return (
    <section id="fahrzeuge" className="py-24 px-5 lg:px-10 bg-background">
      <div className="max-w-7xl mx-auto">

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

        <div className="divider-gold mb-8 mt-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredVehicles.map((car) => (
            <CarCard key={car.id} car={car} />
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
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Hallo, ich suche ein bestimmtes Fahrzeug und würde mich gerne beraten lassen.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-pulse group inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white text-[13px] font-semibold tracking-widest uppercase hover:bg-[#22bf5d] transition-all duration-300 rounded-sm"
          >
            <MessageCircle size={15} strokeWidth={2} />
            Wunschfahrzeug anfragen
          </a>
        </div>
      </div>
    </section>
  )
}
