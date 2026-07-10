import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/reveal'

/**
 * FAQ-Sektion mit FAQPage-Schema (JSON-LD) für Google Rich Results.
 * Server Component ohne JS-State: Auf-/Zuklappen läuft über natives
 * <details>/<summary> – barrierefrei, tastaturbedienbar, null Bundle-Kosten.
 */
const faqs = [
  {
    q: 'Kann ich ein Fahrzeug vor dem Kauf Probe fahren?',
    a: 'Ja, selbstverständlich. Vereinbaren Sie einfach kurz telefonisch oder per WhatsApp einen Termin – das Wunschfahrzeug steht dann fahrbereit für Sie bereit.',
  },
  {
    q: 'Bieten Sie Finanzierung an?',
    a: 'Ja, wir bieten Finanzierungen mit flexiblen Laufzeiten an und beraten Sie individuell. Einen ersten Überblick über mögliche Raten gibt Ihnen unser Finanzierungsrechner auf dieser Website.',
  },
  {
    q: 'Nehmen Sie mein altes Auto in Zahlung?',
    a: 'Ja, wir nehmen Ihr Fahrzeug gerne in Zahlung. Die Bewertung erfolgt fair und marktgerecht – senden Sie uns einfach die Fahrzeugdaten über unsere Ankauf-Seite oder bringen Sie das Fahrzeug direkt mit.',
  },
  {
    q: 'Sind die Fahrzeuge technisch geprüft?',
    a: 'Jedes Fahrzeug wird vor dem Verkauf technisch und optisch geprüft. Wir kommunizieren den Zustand ehrlich und transparent – ohne versteckte Mängel.',
  },
  {
    q: 'Liefern Sie Fahrzeuge auch aus?',
    a: 'Auf Anfrage liefern wir Ihr Fahrzeug bequem zu Ihnen nach Hause – komplett fertig zugelassen. Sprechen Sie uns einfach darauf an.',
  },
  {
    q: 'Kann ich mein Auto auch ohne Neukauf an Sie verkaufen?',
    a: 'Ja, wir kaufen Fahrzeuge auch unabhängig von einem Neukauf an – mit schneller Bewertung und sofortiger Barzahlung. Nutzen Sie dafür unser Ankauf-Formular.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function Faq() {
  return (
    <section id="faq" className="py-24 px-5 lg:px-10 section-alt">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-px bg-gold" />
              <span className="text-[11px] tracking-[0.3em] text-gold uppercase font-semibold">Gut zu wissen</span>
            </div>
            <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold text-balance">
              Häufige Fragen
            </h2>
          </div>
        </Reveal>

        <div className="divider-gold mb-10 mt-6" />

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="group bg-card border border-border rounded-lg overflow-hidden transition-colors hover:border-gold/30">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 text-[15px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    size={17}
                    strokeWidth={2}
                    className="flex-shrink-0 text-gold transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <p className="px-6 pb-5 text-[14px] text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
