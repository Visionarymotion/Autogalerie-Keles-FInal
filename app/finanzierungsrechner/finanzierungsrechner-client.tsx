'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { calculateMonthlyPayment } from '@/lib/financing'

function WhatsAppIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77 0.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.89 14.32c-0.25 0.7-1.24 1.28-2.02 1.45-0.54 0.11-1.24 0.2-3.62-0.78-2.9-1.2-4.77-4.15-4.92-4.34-0.14-0.19-1.18-1.57-1.18-3 0-1.42 0.75-2.12 1.02-2.41 0.27-0.29 0.58-0.36 0.78-0.36 0.19 0 0.39 0 0.56 0.01 0.18 0.01 0.42-0.07 0.66 0.5 0.25 0.59 0.84 2.05 0.92 2.2 0.08 0.15 0.13 0.32 0.03 0.51-0.1 0.19-0.15 0.3-0.29 0.47-0.15 0.16-0.31 0.36-0.44 0.49-0.15 0.15-0.3 0.3-0.13 0.6 0.17 0.29 0.75 1.24 1.61 2.01 1.11 0.99 2.04 1.3 2.34 1.45 0.29 0.15 0.47 0.13 0.64-0.05 0.18-0.19 0.73-0.85 0.92-1.14 0.19-0.29 0.39-0.24 0.65-0.14 0.27 0.1 1.7 0.8 1.99 0.95 0.29 0.15 0.48 0.22 0.55 0.34 0.08 0.13 0.08 0.72-0.17 1.42Z" />
    </svg>
  )
}

function formatEuro(value: number) {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
}

const TERM_OPTIONS = [12, 18, 24, 36, 48, 60, 72, 84]

export default function FinanzierungsrechnerClient() {
  const [price, setPrice] = useState(15000)
  const [downPayment, setDownPayment] = useState(2000)
  const [term, setTerm] = useState(36)
  const [rate, setRate] = useState(5.9)

  const { loanAmount, monthlyPayment, totalPayment, totalInterest } = useMemo(() => {
    const loan = Math.max(price - downPayment, 0)
    const payment = calculateMonthlyPayment(loan, rate, term)
    const total = payment * term
    return {
      loanAmount: loan,
      monthlyPayment: payment,
      totalPayment: total,
      totalInterest: Math.max(total - loan, 0),
    }
  }, [price, downPayment, term, rate])

  const waMessage = `Hallo, ich interessiere mich für eine Finanzierung. Fahrzeugpreis: ${formatEuro(price)}, Anzahlung: ${formatEuro(downPayment)}, Laufzeit: ${term} Monate. Errechnete monatliche Rate: ca. ${formatEuro(monthlyPayment)}. Können Sie mir ein individuelles Angebot erstellen?`
  const waHref = `https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent(waMessage)}`
  const mailSubject = `Finanzierungsanfrage: ${formatEuro(price)} über ${term} Monate`
  const mailHref = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(waMessage)}`

  return (
    <div className="pb-24 px-5 lg:px-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/leistungen/finanzierung"
          className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-gold transition-colors mb-10"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Zurück zu Finanzierung
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-px bg-gold" />
          <span className="text-[11px] tracking-[0.3em] text-gold uppercase font-semibold">Rechenbeispiel</span>
        </div>
        <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold text-balance mb-5">
          Finanzierungsrechner
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-xl">
          Ermitteln Sie in wenigen Sekunden eine unverbindliche Beispielrate für Ihre Fahrzeugfinanzierung.
          Passen Sie Fahrzeugpreis, Anzahlung, Laufzeit und Zinssatz an Ihre Wunschkonstellation an.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-card border border-border rounded-xl p-6 md:p-7 space-y-6">
            <div>
              <label className="flex items-center justify-between text-[13px] font-medium text-foreground mb-2">
                Fahrzeugpreis
                <span className="text-gold font-semibold">{formatEuro(price)}</span>
              </label>
              <input
                type="range"
                min={2000}
                max={100000}
                step={500}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-[13px] font-medium text-foreground mb-2">
                Anzahlung
                <span className="text-gold font-semibold">{formatEuro(downPayment)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={Math.max(price, 1)}
                step={500}
                value={Math.min(downPayment, price)}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Laufzeit</label>
              <div className="grid grid-cols-4 gap-2">
                {TERM_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTerm(t)}
                    className={`text-[12.5px] py-2 rounded-md border transition-colors duration-300 ${
                      term === t
                        ? 'bg-gold border-gold text-white'
                        : 'border-border text-muted-foreground hover:border-gold/40'
                    }`}
                  >
                    {t} Mon.
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-[13px] font-medium text-foreground mb-2">
                Effektiver Jahreszins
                <span className="text-gold font-semibold">{rate.toFixed(1).replace('.', ',')} %</span>
              </label>
              <input
                type="range"
                min={0}
                max={15}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>
          </div>

          <div className="bg-card border border-gold/30 rounded-xl p-6 md:p-7 flex flex-col">
            <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase font-semibold mb-2">
              Monatliche Rate (ca.)
            </span>
            <span className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold mb-6">
              {formatEuro(monthlyPayment)}
            </span>

            <div className="space-y-3 text-[13.5px] mb-8">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Finanzierte Summe</span>
                <span className="text-foreground font-medium">{formatEuro(loanAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Laufzeit</span>
                <span className="text-foreground font-medium">{term} Monate</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Gesamtkosten</span>
                <span className="text-foreground font-medium">{formatEuro(totalPayment)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Zinskosten gesamt</span>
                <span className="text-foreground font-medium">{formatEuro(totalInterest)}</span>
              </div>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-pulse flex-1 inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-[#25D366] text-white text-[13px] font-semibold tracking-widest uppercase hover:bg-[#20bd5a] transition-all duration-300 rounded-sm"
              >
                <WhatsAppIcon size={15} />
                Angebot per WhatsApp anfragen
              </a>
              <a
                href={mailHref}
                className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-transparent border border-border text-foreground text-[13px] font-semibold tracking-widest uppercase hover:border-gold/60 transition-all duration-300 rounded-sm"
              >
                <Mail size={15} strokeWidth={2} />
                Per E-Mail anfragen
              </a>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-muted-foreground leading-relaxed border-t border-border pt-6">
          <strong className="text-foreground">Hinweis:</strong> Dieser Rechner dient ausschließlich als
          unverbindliches Beispiel zur ersten Orientierung. Der tatsächliche effektive Jahreszins richtet
          sich nach Bonität, Fahrzeug und Finanzierungspartner und kann von der hier gewählten Beispielrate
          abweichen. Ein verbindliches Finanzierungsangebot erhalten Sie nach persönlicher Beratung.
        </p>
      </div>
    </div>
  )
}
