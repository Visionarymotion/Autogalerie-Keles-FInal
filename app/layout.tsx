import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
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
  title: 'Autogalerie Keles – Gebrauchtwagen in Nordenham',
  description:
    'Ihr vertrauensvoller Gebrauchtwagen-Händler in Nordenham. Autogalerie Keles bietet geprüfte Fahrzeuge aller Marken zu fairen Preisen. Am Sieltief 2, 26954 Nordenham. Tel: 04731 3699444',
  keywords: ['Gebrauchtwagen', 'Nordenham', 'Autogalerie Keles', 'Gebrauchtwagenhändler', 'Fahrzeuge kaufen', 'VW', 'Mercedes', 'Audi', 'BMW'],
  authors: [{ name: 'Autogalerie Keles' }],
  openGraph: {
    title: 'Autogalerie Keles – Gebrauchtwagen Nordenham',
    description: 'Geprüfte Fahrzeuge aller Marken. Fair. Transparent. Persönlich.',
    locale: 'de_DE',
    type: 'website',
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
  name: siteConfig.name,
  image: 'https://autogalerie-keles.de/images/dealership-real.jpg',
  telephone: siteConfig.contact.phoneHref,
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
      </body>
    </html>
  )
}
