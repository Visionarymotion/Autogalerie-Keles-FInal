'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Fuel, Gauge, Calendar, Zap, ArrowRight, ImageOff, SlidersHorizontal, X } from 'lucide-react'
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
  )
}

export default function FahrzeugbestandClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [brand, setBrand] = useState('Alle')
  const [fuel, setFuel] = useState('Alle')
  const [maxPrice, setMaxPrice] = useState(60000)
  const [sort, setSort] = useState<SortKey>('relevanz')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const brands = useMemo(() => ['Alle', ...Array.from(new Set(vehicles.map((v) => v.brand))).sort()], [vehicles])
  const fuels = useMemo(() => ['Alle', ...Array.from(new Set(vehicles.map((v) => v.fuel)))], [vehicles])

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => v.price <= maxPrice)
    if (brand !== 'Alle') list = list.filter((v) => v.brand === brand)
    if (fuel !== 'Alle') list = list.filter((v) => v.fuel === fuel)
    return sortVehicles(list, sort)
  }, [vehicles, brand, fuel, maxPrice, sort])

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

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((car) => <CarCard key={car.id} car={car} />)}
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
