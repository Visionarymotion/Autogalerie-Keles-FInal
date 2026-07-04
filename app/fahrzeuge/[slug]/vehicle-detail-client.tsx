'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, Gauge, Fuel, Zap, Settings, Users,
  MessageCircle, Phone, Mail, ImageOff, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { formatPrice, formatKm, type Vehicle } from '@/lib/vehicles-data'

export default function VehicleDetailClient({ vehicle }: { vehicle: Vehicle }) {
  const [activePhoto, setActivePhoto] = useState(0)
  const hasPhotos = vehicle.photos.length > 0
  const waMessage = `Hallo, ich interessiere mich für den ${vehicle.brand} ${vehicle.model} für ${formatPrice(vehicle.price)}.`

  const specs = [
    { label: 'Erstzulassung', value: vehicle.firstRegistration, icon: Calendar },
    { label: 'Kilometerstand', value: formatKm(vehicle.km), icon: Gauge },
    { label: 'Kraftstoff', value: vehicle.fuel, icon: Fuel },
    { label: 'Leistung', value: `${vehicle.powerKw} kW (${vehicle.powerPs} PS)`, icon: Zap },
    { label: 'Getriebe', value: vehicle.transmission, icon: Settings },
    { label: 'Fahrzeughalter', value: String(vehicle.owners), icon: Users },
  ]

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-24">
      <Link href="/fahrzeuge" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-[#c7c9cc] transition-colors mb-6">
        <ArrowLeft size={15} strokeWidth={2} />
        Zurück zum Fahrzeugbestand
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">

        {/* Gallery */}
        <div>
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-surface border border-border">
            {hasPhotos ? (
              <>
                <Image
                  src={vehicle.photos[activePhoto]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  priority
                />
                {vehicle.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhoto((p) => (p === 0 ? vehicle.photos.length - 1 : p - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-dark/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-dark/90 transition-colors"
                      aria-label="Vorheriges Bild"
                    >
                      <ChevronLeft size={18} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setActivePhoto((p) => (p === vehicle.photos.length - 1 ? 0 : p + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-dark/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-dark/90 transition-colors"
                      aria-label="Nächstes Bild"
                    >
                      <ChevronRight size={18} strokeWidth={2} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1c1c1a] to-[#111110]">
                <ImageOff size={32} strokeWidth={1.2} className="text-muted-foreground/40" />
                <span className="text-[12px] tracking-widest uppercase text-muted-foreground/50">Fotos folgen in Kürze</span>
                <a
                  href={`https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent(waMessage + ' Könnten Sie mir bitte Fotos schicken?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11.5px] text-[#c7c9cc] hover:underline"
                >
                  Fotos per WhatsApp anfragen →
                </a>
              </div>
            )}
          </div>
          {hasPhotos && vehicle.photos.length > 1 && (
            <div className="flex gap-2 mt-3">
              {vehicle.photos.map((photo, i) => (
                <button
                  key={photo}
                  onClick={() => setActivePhoto(i)}
                  className={`relative w-20 aspect-[4/3] rounded-md overflow-hidden border-2 transition-colors ${
                    i === activePhoto ? 'border-[#c7c9cc]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={photo} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-foreground mb-3">Beschreibung</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">{vehicle.description}</p>
          </div>

          {/* Specs grid */}
          <div className="mt-8">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-foreground mb-4">Fahrzeugdaten</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-card border border-border rounded-lg p-4">
                  <spec.icon size={16} strokeWidth={1.8} className="text-[#c7c9cc] mb-2" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{spec.label}</p>
                  <p className="text-[13px] font-semibold text-foreground">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: price + contact */}
        <div>
          <div className="bg-card border border-border rounded-xl p-6 lg:sticky lg:top-32">
            <p className="text-[10px] tracking-[0.28em] text-[#c7c9cc] uppercase font-semibold mb-1">{vehicle.brand}</p>
            <h1 className="text-[24px] font-[var(--font-heading)] font-semibold text-foreground leading-snug mb-1">{vehicle.model}</h1>
            <p className="text-[12.5px] text-muted-foreground mb-5">{vehicle.detail}</p>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[30px] font-[var(--font-heading)] font-bold text-foreground">{formatPrice(vehicle.price)}</span>
            </div>
            {vehicle.priceNote && (
              <span className="inline-block text-[10.5px] font-semibold uppercase tracking-wide text-[#c7c9cc] bg-[#c7c9cc]/10 border border-[#c7c9cc]/25 rounded-sm px-2 py-1 mb-6">
                {vehicle.priceNote}
              </span>
            )}

            <div className="space-y-2.5 mt-2">
              <a
                href={`https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-pulse w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white text-[13px] font-semibold tracking-wide rounded-lg hover:bg-[#22bf5d] transition-all duration-300"
              >
                <MessageCircle size={16} strokeWidth={2} />
                Per WhatsApp anfragen
              </a>
              <a
                href={`tel:+${siteConfig.contact.ctaWhatsapp}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-surface border border-border text-foreground text-[13px] font-semibold tracking-wide rounded-lg hover:border-[#c7c9cc] transition-all duration-300"
              >
                <Phone size={15} strokeWidth={1.8} />
                {siteConfig.contact.ctaPhone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(`Anfrage: ${vehicle.brand} ${vehicle.model}`)}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-surface border border-border text-foreground text-[13px] font-semibold tracking-wide rounded-lg hover:border-[#c7c9cc] transition-all duration-300"
              >
                <Mail size={15} strokeWidth={1.8} />
                E-Mail senden
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Finanzierung möglich – fragen Sie uns nach individuellen Konditionen für dieses Fahrzeug.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
