import { ShieldCheck, CreditCard, RefreshCcw, Wrench, Search, Truck } from 'lucide-react'

const services = [
  {
    icon: ShieldCheck,
    title: 'Geprüfte Qualität',
    text: 'Jedes Fahrzeug wird vor dem Verkauf technisch und optisch geprüft. Keine versteckten Mängel.',
  },
  {
    icon: CreditCard,
    title: 'Finanzierung',
    text: 'Günstige Finanzierungsmöglichkeiten für jeden Bedarf. Wir beraten Sie individuell und transparent.',
  },
  {
    icon: RefreshCcw,
    title: 'Inzahlungnahme',
    text: 'Wir nehmen Ihr Fahrzeug fair in Zahlung. Schnelle Bewertung und unkomplizierte Abwicklung.',
  },
  {
    icon: Wrench,
    title: 'Ankauf',
    text: 'Wir kaufen Ihr Fahrzeug! Faire Preise, sofortige Barzahlung und schnelle Abwicklung ohne Stress.',
  },
  {
    icon: Search,
    title: 'Wunschfahrzeug',
    text: 'Das gewünschte Modell nicht dabei? Wir suchen es für Sie — markenübergreifend und zuverlässig.',
  },
  {
    icon: Truck,
    title: 'Lieferung',
    text: 'Fahrzeuglieferung auf Anfrage möglich. Bequem nach Hause geliefert, komplett fertig zugelassen.',
  },
]

export default function Services() {
  return (
    <section id="leistungen" className="py-24 px-5 lg:px-10 section-alt">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-xl mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-px bg-gold" />
            <span className="text-[11px] tracking-[0.3em] text-gold uppercase font-semibold">Was wir bieten</span>
          </div>
          <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold text-balance">
            Unsere Leistungen
          </h2>
        </div>

        <div className="divider-gold mb-12 mt-6" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="bg-card border border-border rounded-lg p-7 group hover:shadow-md hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <Icon size={20} strokeWidth={1.6} className="text-gold group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-[16px] font-[var(--font-heading)] font-semibold text-foreground mb-2.5">{s.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
