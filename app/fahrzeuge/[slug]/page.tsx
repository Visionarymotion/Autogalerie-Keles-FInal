import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getVehicleBySlug } from '@/lib/vehicle-store'
import { formatPrice, type Vehicle } from '@/lib/vehicles-data'
import { siteConfig } from '@/lib/site-config'
import VehicleDetailClient from './vehicle-detail-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) return { title: 'Fahrzeug nicht gefunden – Autogalerie Keles' }
  return {
    title: `${vehicle.brand} ${vehicle.model} – ${formatPrice(vehicle.price)} | Autogalerie Keles`,
    description: vehicle.description,
    alternates: { canonical: `/fahrzeuge/${vehicle.slug}` },
    openGraph: {
      title: `${vehicle.brand} ${vehicle.model} – ${formatPrice(vehicle.price)}`,
      description: vehicle.description,
      images: vehicle.photos.length > 0 ? [`${siteConfig.url}${vehicle.photos[0]}`] : undefined,
    },
  }
}

// Strukturierte Daten pro Fahrzeug (schema.org "Car" + "Offer"), damit
// Google die Inserate als Produkt mit Preis/Zustand/km in Rich Results
// ausspielen kann. Nur Felder ausgeben, die wirklich vorhanden sind –
// keine erfundenen Werte (Datenqualitäts-Prinzip dieses Projekts).
function buildVehicleJsonLd(vehicle: Vehicle) {
  // firstRegistration ist "MM/JJJJ" → schema.org will ISO (JJJJ-MM).
  const [regMonth, regYear] = vehicle.firstRegistration.split('/')
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.brand} ${vehicle.model}`,
    brand: { '@type': 'Brand', name: vehicle.brand },
    model: vehicle.model,
    description: vehicle.description,
    url: `${siteConfig.url}/fahrzeuge/${vehicle.slug}`,
    vehicleIdentificationNumber: undefined,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.km,
      unitCode: 'KMT',
    },
    fuelType: vehicle.fuel,
    enginePower: {
      '@type': 'QuantitativeValue',
      value: vehicle.powerPs,
      unitText: 'PS',
    },
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'AutoDealer',
        name: siteConfig.name,
        telephone: siteConfig.contact.ctaPhoneHref,
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.address.street,
          postalCode: siteConfig.address.zip,
          addressLocality: siteConfig.address.city,
          addressCountry: 'DE',
        },
      },
    },
  }
  if (regYear && regMonth) {
    jsonLd.dateVehicleFirstRegistered = `${regYear}-${regMonth}`
  }
  if (vehicle.transmission) {
    jsonLd.vehicleTransmission = vehicle.transmission
  }
  if (vehicle.owners) {
    jsonLd.numberOfPreviousOwners = vehicle.owners
  }
  if (vehicle.photos.length > 0) {
    jsonLd.image = vehicle.photos.map((p) => `${siteConfig.url}${p}`)
  }
  if (vehicle.accidentFree) {
    jsonLd.additionalProperty = {
      '@type': 'PropertyValue',
      name: 'Unfallfrei',
      value: true,
    }
  }
  // undefined-Felder entfernen, damit kein "vehicleIdentificationNumber: undefined" im HTML landet
  Object.keys(jsonLd).forEach((k) => jsonLd[k] === undefined && delete jsonLd[k])
  return jsonLd
}

// Breadcrumb-Pfad für GEO/SEO (Startseite > Fahrzeuge > Modell) – hilft
// Google/KI-Crawlern bei der Einordnung der URL-Hierarchie, unabhängig
// vom Car-Schema oben.
function buildBreadcrumbJsonLd(vehicle: Vehicle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Fahrzeuge', item: `${siteConfig.url}/fahrzeuge` },
      { '@type': 'ListItem', position: 3, name: `${vehicle.brand} ${vehicle.model}`, item: `${siteConfig.url}/fahrzeuge/${vehicle.slug}` },
    ],
  }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) notFound()

  const jsonLd = buildVehicleJsonLd(vehicle)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(vehicle)

  return (
    <main className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <div className="pt-32">
        <VehicleDetailClient vehicle={vehicle} />
      </div>
      <Footer />
    </main>
  )
}
