'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Fuel, Gauge, Calendar, Zap, ArrowRight, ImageOff, SlidersHorizontal, X, Heart } from 'lucide-react'
import { formatPrice, formatKm, type Vehicle } from '@/lib/vehicles-data'
import { siteConfig } from '@/lib/site-config'

type SortKey = 'relevanz' | 'preis-auf' | 'preis-ab' | 'km-auf' | 'ez-neu'

function sortVehicles(list: Vehicle[], sort: SortKey) {
  const arr = [...list]
  switch (sort) {
    case 'preis-auf': return arr.sort((a, b) => a.price - b.price)
    case 'preis-ab': return arr.sort((a, b) => b.price - a.price)
    case 'km-auf': return arr.sort((a, b) => a.km - b.km)
    case 'ez-neu': return arr.sort((a, b) => b.id - a.id)
    default: return arr
  }
}

function WhatsAppIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77 0.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.89 14.32c-0.25 0.7-1.24 1.28-2.02 1.45-0.54 0.11-1.24 0.2-3.62-0.78-2.9-1.2-4.77-4.15-4.92-4.34-0.14-0.19-1.18-1.57-1.18-3 0-1.42 0.75-2.12 1.02-2.41 0.27-0.29 0.58-0.36 0.78-0.36 0.19 0 0.39 0 0.56 0.01 0.18 0.01 0.42-0.07 0.66 0.5 0.25 0.59 0.84 2.05 0.92 2.2 0.08 0.15 0.13 0.32 0.03 0.51-0.1 0.19-0.15 0.3-0.29 0.47-0.15 0.16-0.31 0.36-0.44 0.49-0.15 0.15-0.3 0.3-0.13 0.6 0.17 0.29 0.75 1.24 1.61 2.01 1.11 0.99 2.04 1.3 2.34 1.45 0.29 0.15 0.47 0.13 0.64-0.05 0.18-0.19 0.73-0.85 0.92-1.14 0.19-0.29 0.39-0.24 0.65-0.14 0.27 0.1 1.7 0.8 1.99 0.95 0.29 0.15 0.48 0.22 0.55 0.34 0.08 0.13 0.08 0.72-0.17 1.42Z" />
    </svg>
  )
}

function CarCard({ car, isFav, onToggleFav }: { car: Vehicle; isFav: boolean; onToggleFav: (id: number) => void }) {
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
              <ImageOff size={20} strokeWidth={1.3} className="text-muted-foreground/40" />
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground/50">Foto folgt</span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-dark/85 backdrop-blur-sm rounded-sm px-2.5 py-1.5 border border-white/10">
            <span className="text-[13px] font-semibold text-white">{formatPrice(car.price)}</span>
          </div>
          {car.priceNote && (
            <div className="absolute top-3 left-3 bg-[#c7c9cc]/95 text-background text-[9.5px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm">
              {car.priceNote}
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-1">
            <p className="text-[10px] tracking-[0.28em] text-[#c7c9cc] uppercase font-semibold mb-0.5">{car.brand}</p>
            <h3 className="text-[16px] font-[var(--font-heading)] font-semibold text-foreground leading-snug">{car.model}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{car.detail}</p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap pt-3.5 mt-auto border-t border-border">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Calendar size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />{car.firstRegistration}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Gauge size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />{formatKm(car.km)}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Fuel size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />{car.fuel}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Zap size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />{car.powerPs} PS</span>
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
        className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-lg transition-colors duration-300"
      >
        <WhatsAppIcon size={16} />
      </a>
      <button
        type="button"
        onClick={() => onToggleFav(car.id)}
        aria-label={isFav ? 'Von Merkliste entfernen' : 'Auf Merkliste setzen'}
        aria-pressed={isFav}
        className={`absolute top-[3.75rem] right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full border shadow-lg transition-colors duration-300 ${
          isFav ? 'bg-gold border-gold text-white' : 'bg-dark/70 border-white/25 text-white/85 hover:text-white hover:border-gold/70'
        }`}
      >
        <Heart size={15} strokeWidth={2} fill={isFav ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}

export default function FahrzeugbestandClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [brand, setBrand] = useState('Alle')
  const [fuel, setFuel] = useState('Alle')
  const [maxPrice, setMaxPrice] = useState(60000)
  const [sort, setSort] = useState<SortKey>('relevanz')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [favs, setFavs] = useState<number[]>([])
  const [onlyFavs, setOnlyFavs] = useState(false)

  // Merkliste liegt nur lokal im Browser (localStorage) – keine
  // Server-Speicherung, keine personenbezogenen Daten.
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ak-merkliste')
      if (stored) setFavs(JSON.parse(stored))
    } catch {}
  }, [])

  const toggleFav = (id: number) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      try { localStorage.setItem('ak-merkliste', JSON.stringify(next)) } catch {}
      return next
    })
  }

  const brands = useMemo(() => ['Alle', ...Array.from(new Set(vehicles.map((v) => v.brand))).sort()], [vehicles])
  const fuels = useMemo(() => ['Alle', ...Array.from(new Set(vehicles.map((v) => v.fuel)))], [vehicles])

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => v.price <= maxPrice)
    if (brand !== 'Alle') list = list.filter((v) => v.brand === brand)
    if (fuel !== 'Alle') list = list.filter((v) => v.fuel === fuel)
    if (onlyFavs) list = list.filter((v) => favs.includes(v.id))
    return sortVehicles(list, sort)
  }, [vehicles, brand, fuel, maxPrice, sort, onlyFavs, favs])

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-px bg-[#c7c9cc]" />
          <span className="text-[11px] tracking-[0.3em] text-[#c7c9cc] uppercase font-semibold">Fahrzeugbestand</span>
        </div>
        <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold mb-3">
          Alle Fahrzeuge
        </h1>
        <p className="text-[13.5px] text-muted-foreground max-w-xl">
          {vehicles.length} geprüfte Fahrzeuge – echte, aktuelle Angebote direkt aus unserem Bestand.
          Nicht dabei, was Sie suchen?{' '}
          <a
            href={`https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent('Hallo, ich suche ein bestimmtes Fahrzeug.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c7c9cc] hover:underline font-medium"
          >
            Schreiben Sie uns
          </a>.
        </p>
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="lg:hidden mb-4 flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-lg text-[13px] font-medium text-foreground w-full justify-center"
      >
        <SlidersHorizontal size={15} strokeWidth={1.8} />
        Filter {filtersOpen ? 'ausblenden' : 'anzeigen'}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-card border border-border rounded-xl p-5 lg:sticky lg:top-32 space-y-6">
            <div className="flex items-center justify-between lg:hidden">
              <span className="text-[13px] font-semibold">Filter</span>
              <button onClick={() => setFiltersOpen(false)} aria-label="Filter schließen">
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">Marke</label>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`px-3 py-1.5 text-[11.5px] rounded-full border transition-all ${
                      brand === b ? 'bg-[#c7c9cc] text-background border-[#c7c9cc] font-semibold' : 'border-border text-muted-foreground hover:border-[#c7c9cc]/50'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">Kraftstoff</label>
              <div className="flex flex-wrap gap-2">
                {fuels.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFuel(f)}
                    className={`px-3 py-1.5 text-[11.5px] rounded-full border transition-all ${
                      fuel === f ? 'bg-[#c7c9cc] text-background border-[#c7c9cc] font-semibold' : 'border-border text-muted-foreground hover:border-[#c7c9cc]/50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                <span>Preis bis</span>
                <span className="text-[#c7c9cc] normal-case tracking-normal">{formatPrice(maxPrice)}</span>
              </label>
              <input
                type="range"
                min={5000}
                max={60000}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#c7c9cc]"
              />
            </div>

            {(brand !== 'Alle' || fuel !== 'Alle' || maxPrice < 60000) && (
              <button
                onClick={() => { setBrand('Alle'); setFuel('Alle'); setMaxPrice(60000) }}
                className="text-[11.5px] text-muted-foreground hover:text-[#c7c9cc] underline"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-[12.5px] text-muted-foreground">{filtered.length} Fahrzeuge</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-[12px] bg-card border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-[#c7c9cc] cursor-pointer"
            >
              <option value="relevanz">Beste Ergebnisse</option>
              <option value="preis-auf">Preis aufsteigend</option>
              <option value="preis-ab">Preis absteigend</option>
              <option value="km-auf">Kilometerstand aufsteigend</option>
              <option value="ez-neu">Neueste zuerst</option>
            </select>
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => setOnlyFavs((v) => !v)}
              aria-pressed={onlyFavs}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border text-[12px] font-semibold tracking-wide transition-colors duration-300 ${
                onlyFavs ? 'bg-gold border-gold text-white' : 'bg-card border-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
              }`}
            >
              <Heart size={13} strokeWidth={2} fill={onlyFavs ? 'currentColor' : 'none'} />
              Merkliste{favs.length > 0 ? ` (${favs.length})` : ''}
            </button>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((car) => <CarCard key={car.id} car={car} isFav={favs.includes(car.id)} onToggleFav={toggleFav} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-[13.5px]">
              Keine Fahrzeuge gefunden. Bitte Filter anpassen.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
