'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Fuel, Gauge, Calendar, Zap, ArrowRight, ImageOff, SlidersHorizontal, X, Heart, ShieldCheck, Scale } from 'lucide-react'
import { formatPrice, formatKm, DATA_SNAPSHOT_DATE, type Vehicle } from '@/lib/vehicles-data'
import { siteConfig } from '@/lib/site-config'
import { estimateCardMonthlyPayment } from '@/lib/financing'

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

// Baut eine vorformulierte WhatsApp-Nachricht aus der gemerkten Fahrzeugliste,
// statt dass der Nutzer jedes Fahrzeug einzeln anfragen muss.
function buildMerklisteWhatsAppHref(vehicles: Vehicle[], favIds: number[]): string {
  const favVehicles = favIds
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is Vehicle => Boolean(v))
  const lines = favVehicles.map(
    (v) => `• ${v.brand} ${v.model} – ${formatPrice(v.price)} – ${siteConfig.url}/fahrzeuge/${v.slug}`,
  )
  const message = `Hallo, folgende Fahrzeuge interessieren mich:\n\n${lines.join('\n')}`
  return `https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent(message)}`
}

function WhatsAppIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77 0.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.89 14.32c-0.25 0.7-1.24 1.28-2.02 1.45-0.54 0.11-1.24 0.2-3.62-0.78-2.9-1.2-4.77-4.15-4.92-4.34-0.14-0.19-1.18-1.57-1.18-3 0-1.42 0.75-2.12 1.02-2.41 0.27-0.29 0.58-0.36 0.78-0.36 0.19 0 0.39 0 0.56 0.01 0.18 0.01 0.42-0.07 0.66 0.5 0.25 0.59 0.84 2.05 0.92 2.2 0.08 0.15 0.13 0.32 0.03 0.51-0.1 0.19-0.15 0.3-0.29 0.47-0.15 0.16-0.31 0.36-0.44 0.49-0.15 0.15-0.3 0.3-0.13 0.6 0.17 0.29 0.75 1.24 1.61 2.01 1.11 0.99 2.04 1.3 2.34 1.45 0.29 0.15 0.47 0.13 0.64-0.05 0.18-0.19 0.73-0.85 0.92-1.14 0.19-0.29 0.39-0.24 0.65-0.14 0.27 0.1 1.7 0.8 1.99 0.95 0.29 0.15 0.48 0.22 0.55 0.34 0.08 0.13 0.08 0.72-0.17 1.42Z" />
    </svg>
  )
}

function CarCard({
  car, isFav, onToggleFav, isComparing, onToggleCompare, compareDisabled,
}: {
  car: Vehicle
  isFav: boolean
  onToggleFav: (id: number) => void
  isComparing: boolean
  onToggleCompare: (id: number) => void
  compareDisabled: boolean
}) {
  const photo = car.photos[0] ?? null
  const waHref = `https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent(`Hallo, ich interessiere mich für den ${car.brand} ${car.model}.`)}`
  const monthlyEstimate = Math.round(estimateCardMonthlyPayment(car.price))

  /* Dezenter 3D-Tilt-Effekt (Maus-Perspektive) + Glare-Highlight, prefers-reduced-motion-sicher */
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50, hover: false })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setTilt({ rx: (0.5 - py) * 8, ry: (px - 0.5) * 8, glareX: px * 100, glareY: py * 100, hover: true })
  }

  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50, hover: false })

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.hover ? -6 : 0}px)`,
      }}
      className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#c7c9cc]/40 transition-transform duration-200 ease-out flex flex-col [transform-style:preserve-3d] will-change-transform"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.16), transparent 60%)` }}
      />
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
              unoptimized
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
          {car.accidentFree && !car.priceNote && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-dark/85 backdrop-blur-sm text-white text-[9.5px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm border border-white/10">
              <ShieldCheck size={11} strokeWidth={2} className="text-[#c7c9cc]" />
              Unfallfrei
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-1">
            <p className="text-[10px] tracking-[0.28em] text-[#c7c9cc] uppercase font-semibold mb-0.5">{car.brand}</p>
            <h3 className="text-[16px] font-[var(--font-heading)] font-semibold text-foreground leading-snug">{car.model}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{car.detail}</p>
            {monthlyEstimate > 0 && (
              <p className="text-[11.5px] text-[#c7c9cc] mt-1.5 font-medium">
                ab {formatPrice(monthlyEstimate)}/mtl.<span className="text-muted-foreground font-normal">*</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2.5 flex-wrap pt-3.5 mt-auto border-t border-border">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Calendar size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />{car.firstRegistration}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Gauge size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />{formatKm(car.km)}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Fuel size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />{car.fuel}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Zap size={11} strokeWidth={1.8} className="text-[#c7c9cc]" />{car.powerPs} PS</span>
          </div>
          <p className="text-[9.5px] text-muted-foreground/50 mt-2">Stand: {DATA_SNAPSHOT_DATE}</p>
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
        className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#178048] hover:bg-[#136339] shadow-lg transition-colors duration-300"
      >
        <WhatsAppIcon size={16} />
      </a>
      <button
        type="button"
        onClick={() => onToggleFav(car.id)}
        aria-label={isFav ? 'Von Merkliste entfernen' : 'Auf Merkliste setzen'}
        aria-pressed={isFav}
        className={`absolute top-[3.75rem] right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full border shadow-lg transition-colors duration-300 ${
          isFav ? 'bg-gold border-gold text-primary-foreground' : 'bg-dark/70 border-white/25 text-white/85 hover:text-white hover:border-gold/70'
        }`}
      >
        <Heart size={15} strokeWidth={2} fill={isFav ? 'currentColor' : 'none'} />
      </button>
      <button
        type="button"
        onClick={() => onToggleCompare(car.id)}
        disabled={compareDisabled}
        aria-pressed={isComparing}
        aria-label={isComparing ? `${car.brand} ${car.model} vom Vergleich entfernen` : `${car.brand} ${car.model} zum Vergleich hinzufügen`}
        title={compareDisabled ? 'Maximal 3 Fahrzeuge vergleichen' : undefined}
        className={`absolute top-[6.75rem] right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full border shadow-lg transition-colors duration-300 ${
          isComparing
            ? 'bg-[#c7c9cc] border-[#c7c9cc] text-background'
            : compareDisabled
              ? 'bg-dark/50 border-white/10 text-white/30 cursor-not-allowed'
              : 'bg-dark/70 border-white/25 text-white/85 hover:text-white hover:border-[#c7c9cc]/70'
        }`}
      >
        <Scale size={14} strokeWidth={2} />
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
  const [compareIds, setCompareIds] = useState<number[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

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
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <p className="text-[12.5px] text-muted-foreground">
              {filtered.length} Fahrzeuge
              <span className="hidden sm:inline">
                {' '}· <span className="text-[11px]">*Finanzierungsbeispiel: 0 € Anzahlung, 36 Monate, 5,9 % eff. Jahreszins, unverbindlich</span>
              </span>
            </p>
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

          <div className="mb-6 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setOnlyFavs((v) => !v)}
              aria-pressed={onlyFavs}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border text-[12px] font-semibold tracking-wide transition-colors duration-300 ${
                onlyFavs ? 'bg-gold border-gold text-primary-foreground' : 'bg-card border-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
              }`}
            >
              <Heart size={13} strokeWidth={2} fill={onlyFavs ? 'currentColor' : 'none'} />
              Merkliste{favs.length > 0 ? ` (${favs.length})` : ''}
            </button>
            {favs.length > 0 && (
              <a
                href={buildMerklisteWhatsAppHref(vehicles, favs)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#178048] text-white text-[12px] font-semibold tracking-wide hover:bg-[#136339] transition-colors duration-300"
              >
                <WhatsAppIcon size={13} />
                Merkliste per WhatsApp teilen
              </a>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isFav={favs.includes(car.id)}
                  onToggleFav={toggleFav}
                  isComparing={compareIds.includes(car.id)}
                  onToggleCompare={toggleCompare}
                  compareDisabled={compareIds.length >= 3 && !compareIds.includes(car.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-[13.5px]">
              Keine Fahrzeuge gefunden. Bitte Filter anpassen.
            </div>
          )}
        </div>
      </div>

      {compareIds.length >= 2 && !compareOpen && (
        <button
          type="button"
          onClick={() => setCompareOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-6 py-3.5 bg-[#c7c9cc] text-background text-[13px] font-semibold tracking-wide rounded-full shadow-2xl hover:bg-[#c7c9cc]/90 transition-all duration-300"
        >
          <Scale size={16} strokeWidth={2} />
          {compareIds.length} Fahrzeuge vergleichen
        </button>
      )}

      {compareOpen && (
        <CompareModal
          vehicles={compareIds.map((id) => vehicles.find((v) => v.id === id)).filter((v): v is Vehicle => Boolean(v))}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        />
      )}
    </div>
  )
}

function CompareModal({
  vehicles, onClose, onRemove,
}: {
  vehicles: Vehicle[]
  onClose: () => void
  onRemove: (id: number) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const rows: { label: string; render: (v: Vehicle) => ReactNode }[] = [
    { label: 'Preis', render: (v) => <span className="text-[16px] font-bold text-foreground">{formatPrice(v.price)}</span> },
    {
      label: 'Finanzierung',
      render: (v) => {
        const rate = Math.round(estimateCardMonthlyPayment(v.price))
        return rate > 0 ? <span>ab {formatPrice(rate)}/mtl.*</span> : <span>–</span>
      },
    },
    { label: 'Erstzulassung', render: (v) => <span>{v.firstRegistration}</span> },
    { label: 'Kilometerstand', render: (v) => <span>{formatKm(v.km)}</span> },
    { label: 'Leistung', render: (v) => <span>{v.powerKw} kW ({v.powerPs} PS)</span> },
    { label: 'Kraftstoff', render: (v) => <span>{v.fuel}</span> },
    { label: 'Getriebe', render: (v) => <span>{v.transmission ?? '–'}</span> },
    {
      label: 'Unfallfrei',
      render: (v) => v.accidentFree
        ? <span className="inline-flex items-center gap-1 text-[#c7c9cc]"><ShieldCheck size={13} strokeWidth={2} />Ja</span>
        : <span className="text-muted-foreground">unbekannt</span>,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-card border-b border-border">
          <h2 className="text-[15px] font-[var(--font-heading)] font-semibold text-foreground">Fahrzeugvergleich</h2>
          <button type="button" onClick={onClose} aria-label="Vergleich schließen" className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed" style={{ minWidth: `${140 + vehicles.length * 190}px` }}>
            <thead>
              <tr>
                <th className="w-[140px]" />
                {vehicles.map((v) => (
                  <th key={v.id} className="w-[190px] p-4 text-left align-top">
                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-surface mb-3">
                      {v.photos[0] ? (
                        <Image src={v.photos[0]} alt={`${v.brand} ${v.model}`} fill unoptimized className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageOff size={20} strokeWidth={1.3} className="text-muted-foreground/40" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemove(v.id)}
                        aria-label={`${v.brand} ${v.model} aus Vergleich entfernen`}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark/80 text-white flex items-center justify-center hover:bg-dark transition-colors"
                      >
                        <X size={14} strokeWidth={2} />
                      </button>
                    </div>
                    <p className="text-[9px] tracking-[0.2em] text-[#c7c9cc] uppercase font-semibold mb-0.5">{v.brand}</p>
                    <p className="text-[13px] font-semibold text-foreground leading-snug mb-3">{v.model}</p>
                    <a
                      href={`https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent(`Hallo, ich interessiere mich für den ${v.brand} ${v.model}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 bg-[#178048] hover:bg-[#136339] text-white text-[11px] font-semibold rounded-md transition-colors duration-300 mb-1.5"
                    >
                      <WhatsAppIcon size={12} />
                      Anfragen
                    </a>
                    <Link
                      href={`/fahrzeuge/${v.slug}`}
                      className="flex items-center justify-center gap-1.5 py-2 border border-border text-foreground text-[11px] font-semibold rounded-md hover:border-[#c7c9cc]/50 transition-colors duration-300"
                    >
                      Details
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-surface/50' : ''}>
                  <td className="p-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground align-top">{row.label}</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-4 text-[13px] text-foreground align-top">{row.render(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-5 pb-5 text-[10.5px] text-muted-foreground leading-relaxed">
          *Finanzierungsbeispiel: 0 € Anzahlung, 36 Monate, 5,9 % eff. Jahreszins, unverbindlich.
        </p>
      </div>
    </div>
  )
}
