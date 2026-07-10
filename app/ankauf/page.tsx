import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AnkaufClient from './ankauf-client'

export const metadata: Metadata = {
  title: 'Fahrzeug-Ankauf – Autogalerie Keles Nordenham',
  description:
    'Verkaufen Sie Ihr Auto schnell und fair an Autogalerie Keles in Nordenham: kostenlose Bewertung, sofortige Barzahlung, Abmeldung inklusive. Jetzt Fahrzeugdaten senden.',
  alternates: { canonical: '/ankauf' },
}

export default function AnkaufPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      {/* Seiten-Header */}
      <section className="pt-40 pb-14 px-5 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-px bg-gold" />
            <span className="text-[11px] tracking-[0.3em] text-gold uppercase font-semibold">Wir kaufen Ihr Auto</span>
          </div>
          <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold text-balance mb-4">
            Fahrzeug-Ankauf
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
            Sie möchten Ihr Auto verkaufen? Senden Sie uns die wichtigsten Daten – wir melden uns
            kurzfristig mit einer fairen, marktgerechten Bewertung. Barzahlung und Abmeldung inklusive.
          </p>
          <div className="divider-gold mt-6" />
        </div>
      </section>

      <AnkaufClient />
      <Footer />
    </main>
  )
}
