import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: 'Autogalerie Keles – Gebrauchtwagen in Nordenham',
  description:
    'Ihr vertrauensvoller Gebrauchtwagen-Händler in Nordenham. Autogalerie Keles bietet geprüfte Fahrzeuge aller Marken zu fairen Preisen. Am Sieltief 2, 26954 Nordenham. Tel: 04731 3699444',
  keywords: ['Gebrauchtwagen', 'Nordenham', 'Autogalerie Keles', 'Gebrauchtwagenhändler', 'Fahrzeuge kaufen', 'VW', 'Mercedes', 'Audi', 'BMW'],
  authors: [{ name: 'Autogalerie Keles' }],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: 'Autogalerie Keles – Gebrauchtwagen Nordenham',
    description: 'Geprüfte Fahrzeuge aller Marken. Fair. Transparent. Persönlich.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Autogalerie Keles – Gebrauchtwagen Nordenham',
    description: 'Geprüfte Fahrzeuge aller Marken. Fair. Transparent. Persönlich.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0e0e0e',
  width: 'device-width',
  initialScale: 1,
}

// Strukturierte Daten für Google (Rich Snippets: Bewertung,
// Öffnungszeiten, Adresse direkt im Suchergebnis sichtbar).
// Nur mit echten, bereits verifizierten Werten aus site-config.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': `${siteConfig.url}/#autodealer`,
  name: siteConfig.name,
  url: siteConfig.url,
  priceRange: '€€',
  areaServed: [
    { '@type': 'City', name: 'Nordenham' },
    { '@type': 'AdministrativeArea', name: 'Landkreis Wesermarsch' },
    { '@type': 'City', name: 'Bremerhaven' },
    { '@type': 'City', name: 'Bremen' },
    { '@type': 'City', name: 'Oldenburg' },
  ],
  hasMap: `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address.mapsQuery)}`,
  image: `${siteConfig.url}/images/dealership-real.jpg`,
  telephone: siteConfig.contact.ctaPhoneHref,
  email: siteConfig.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.address.street,
    postalCode: siteConfig.address.zip,
    addressLocality: siteConfig.address.city,
    addressCountry: 'DE',
  },
  openingHoursSpecification: siteConfig.hours
    .filter((h) => h.time !== 'Geschlossen')
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.day,
      opens: h.time.split('–')[0].trim(),
      closes: h.time.split('–')[1].trim(),
    })),
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: siteConfig.rating.value,
    reviewCount: siteConfig.rating.count,
  },
  sameAs: [siteConfig.links.mobileDe],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${playfair.variable}`}
      style={{ backgroundColor: '#0e0e0e' }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  )
}
