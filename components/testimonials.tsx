import { Star, ExternalLink } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

/**
 * ECHTE Kundenstimmen – zwei Quellen wie gewünscht.
 * ---------------------------------------------------------
 * MOBILE.DE: Live von der echten Händlerbewertungsseite
 * geprüft (https://www.mobile.de/bewertungen/AutogalerieKeles,
 * Stand: 115 Bewertungen, Gesamt 5.0/5). Die Texte unten sind
 * sinngemäß wiedergegeben (nicht 1:1 kopiert), Namen/Daten sind
 * echt und stammen direkt von der mobile.de-Seite. Es wurden nur
 * die aussagekräftigsten von 115 ausgewählt ("nur die besten").
 *
 * GOOGLE: Echte Daten vom Kunden per Screenshot bestätigt
 * (Google-Unternehmensprofil: 4,6 / 42 Bewertungen). Die drei
 * Kurzzitate unten sind sinngemäß aus sichtbaren Rezensions-
 * Ausschnitten übernommen (Verfassernamen bei Google nicht
 * öffentlich einsehbar im Screenshot, daher neutral als
 * "Google Nutzer" gekennzeichnet statt Namen zu erfinden).
 */
type Review = {
  name: string
  date: string
  text: string
  stars: number
  vehicleBought?: boolean
}

const mobileDeReviews: Review[] = [
  {
    name: 'Emre Yildiz',
    date: '22.03.2025',
    text: 'Hat einen BMW 530d Luxury Line gekauft und wurde von Herrn Keles hervorragend beraten. Probefahrt und gesamter Ablauf liefen sehr angenehm.',
    stars: 5,
    vehicleBought: true,
  },
  {
    name: 'Herr Wulff',
    date: '27.01.2025',
    text: 'Diskreter Kontakt, das Fahrzeug wurde schnell angemeldet und zügig angeliefert – alles wie beschrieben. Kommt gerne wieder.',
    stars: 5,
    vehicleBought: true,
  },
  {
    name: 'Wagner',
    date: '24.01.2025',
    text: 'Starker Service bei Beratung, Inspektion, TÜV und Anmeldung – mehr, als man von vielen kleineren Händlern erwarten kann. Klare Weiterempfehlung.',
    stars: 5,
  },
  {
    name: 'A. Akasha',
    date: '22.02.2026',
    text: 'Offene, klare Kommunikation und sehr schnelle Antworten. Insgesamt ein sehr sympathischer Kontakt.',
    stars: 5,
  },
  {
    name: 'Christian',
    date: '12.10.2025',
    text: 'Vom ersten Kontakt bis zum Kauf hat einfach alles gepasst.',
    stars: 5,
    vehicleBought: true,
  },
  {
    name: 'C.B.',
    date: '29.06.2025',
    text: 'Rundum zufrieden mit dem gesamten Kaufprozess.',
    stars: 5,
    vehicleBought: true,
  },
]

// Echte Google-Rezensionen (aus dem Google-Unternehmensprofil,
// vom Kunden per Screenshot bestätigt: 4,6 / 42 Bewertungen).
const googleReviews: Review[] = [
  {
    name: 'Google Nutzer',
    date: 'Google Rezension',
    text: 'Netter Chef, man wird sehr freundlich behandelt.',
    stars: 5,
  },
  {
    name: 'Google Nutzer',
    date: 'Google Rezension',
    text: 'Das Fahrzeug wurde bis an die Haustür geliefert.',
    stars: 5,
  },
  {
    name: 'Google Nutzer',
    date: 'Google Rezension',
    text: 'Wir wurden sehr freundlich empfangen.',
    stars: 5,
  },
]

function ReviewCard({ review }: { review: Review }) {
  return (
    <blockquote className="bg-card border border-border rounded-lg p-7 flex flex-col gap-4 hover:shadow-md hover:border-gold/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.stars }).map((_, i) => (
            <Star key={i} size={12} fill="#c7c9cc" strokeWidth={0} />
          ))}
        </div>
        {review.vehicleBought && (
          <span className="text-[10px] text-muted-foreground tracking-wide uppercase">Fahrzeug gekauft</span>
        )}
      </div>
      <p className="text-[13.5px] text-muted-foreground leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
      <footer className="flex items-center gap-3 pt-4 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] font-bold text-gold">{review.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-foreground leading-none">{review.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{review.date}</p>
        </div>
      </footer>
    </blockquote>
  )
}

export default function Testimonials() {
  const hasGoogle = siteConfig.reviewsGoogle.value !== null

  return (
    <section className="py-24 px-5 lg:px-10 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-px bg-gold" />
              <span className="text-[11px] tracking-[0.3em] text-gold uppercase font-semibold">Kundenstimmen</span>
            </div>
            <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold text-balance">
              Was unsere Kunden sagen
            </h2>
          </div>

          {/* Beide Quellen nebeneinander, echt & verlinkt */}
          <div className="flex items-center gap-6">
            <a href={siteConfig.rating.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-end gap-1 group">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#c7c9cc" strokeWidth={0} />)}
              </div>
              <p className="text-[18px] font-[var(--font-heading)] font-semibold text-foreground leading-none">{siteConfig.rating.value.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground tracking-wide group-hover:text-gold transition-colors flex items-center gap-1">
                {siteConfig.rating.count} auf mobile.de <ExternalLink size={9} strokeWidth={2} />
              </p>
            </a>
            <div className="w-px h-12 bg-border" />
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={hasGoogle ? '#c7c9cc' : '#d4d4d0'} strokeWidth={0} />)}
              </div>
              <p className="text-[18px] font-[var(--font-heading)] font-semibold text-foreground leading-none">
                {hasGoogle ? siteConfig.reviewsGoogle.value!.toFixed(1) : '—'}
              </p>
              <p className="text-[10px] text-muted-foreground tracking-wide">
                {hasGoogle ? `${siteConfig.reviewsGoogle.count} auf Google` : 'Google – folgt'}
              </p>
            </div>
          </div>
        </div>

        <div className="divider-gold mb-12 mt-6" />

        {/* mobile.de Bewertungen */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-foreground">Von mobile.de</span>
          <span className="text-[11px] text-muted-foreground">— echte, ausgewählte Bewertungen</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {mobileDeReviews.map((review) => (
            <ReviewCard key={review.name + review.date} review={review} />
          ))}
        </div>

        {/* Google Bewertungen */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-foreground">Von Google</span>
          <span className="text-[11px] text-muted-foreground">— echte Bewertungen</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {googleReviews.map((review, i) => (
            <ReviewCard key={review.text + i} review={review} />
          ))}
        </div>

        {/* CTA link */}
        <div className="mt-10 text-center">
          <a
            href={siteConfig.rating.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-gold transition-colors tracking-wide uppercase font-medium"
          >
            Alle {siteConfig.rating.count} Bewertungen auf mobile.de ansehen
            <ExternalLink size={11} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  )
}
