'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Car, CheckCircle2, BadgeEuro, Clock, ShieldCheck } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { Reveal } from '@/components/reveal'

function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.8 14.13c-.25.7-1.44 1.34-2 1.4-.53.06-1.2.09-1.94-.12-.45-.13-1.02-.3-1.76-.62-3.1-1.34-5.12-4.47-5.28-4.68-.15-.2-1.26-1.67-1.26-3.19 0-1.52.8-2.27 1.08-2.58.28-.31.61-.39.82-.39l.59.01c.19.01.44-.07.69.53.25.61.86 2.1.93 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.5l-.45.53c-.15.15-.31.32-.13.62.18.31.79 1.31 1.7 2.12 1.17 1.04 2.15 1.36 2.46 1.52.31.15.49.13.67-.08.18-.2.77-.89.97-1.2.2-.31.41-.25.69-.15.28.1 1.79.85 2.1 1 .31.15.51.23.59.36.07.13.07.75-.18 1.44Z" />
    </svg>
  )
}

const FUEL_OPTIONS = ['Benzin', 'Diesel', 'Hybrid', 'Elektro', 'LPG/Autogas', 'Sonstiges'] as const
const TRANSMISSION_OPTIONS = ['Automatik', 'Schaltgetriebe'] as const
const CONDITION_OPTIONS = ['Sehr gut', 'Gut', 'Gebrauchsspuren', 'Reparaturbedürftig'] as const
const ACCIDENT_OPTIONS = ['Unfallfrei', 'Unfallschaden (repariert)', 'Unfallschaden (nicht repariert)', 'Unbekannt'] as const

/**
 * Fahrzeug-Ankauf-Formular. Bewusst OHNE eigenes Backend: die Angaben
 * werden – wie beim bestehenden Kontaktformular – als vorformatierte
 * WhatsApp-Nachricht an die Geschäftsnummer übergeben. Kein Speichern,
 * keine Datenbank, keine zusätzlichen DSGVO-Pflichten auf unserer Seite.
 */
export default function AnkaufClient() {
  const [form, setForm] = useState({
    brand: '',
    model: '',
    firstReg: '',
    km: '',
    fuel: '',
    transmission: '',
    condition: '',
    accident: '',
    price: '',
    name: '',
    phone: '',
    message: '',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const canSubmit = form.brand.trim() && form.model.trim() && form.km.trim() && form.name.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    const lines = [
      'Hallo, ich möchte mein Fahrzeug zum Ankauf anbieten:',
      '',
      `Fahrzeug: ${form.brand} ${form.model}`,
      form.firstReg && `Erstzulassung: ${form.firstReg}`,
      `Kilometerstand: ${form.km} km`,
      form.fuel && `Kraftstoff: ${form.fuel}`,
      form.transmission && `Getriebe: ${form.transmission}`,
      form.condition && `Zustand: ${form.condition}`,
      form.accident && `Unfallstatus: ${form.accident}`,
      form.price && `Preisvorstellung: ${form.price} €`,
      '',
      `Name: ${form.name}`,
      form.phone && `Telefon: ${form.phone}`,
      form.message && `Anmerkung: ${form.message}`,
    ].filter(Boolean)
    const url = `https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const inputCls =
    'w-full bg-surface border border-border rounded-md px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-colors'
  const labelCls = 'block text-[12px] font-semibold tracking-wide text-muted-foreground uppercase mb-2'

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-24">

      {/* Vorteile */}
      <Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[
            { icon: BadgeEuro, title: 'Faire Preise', text: 'Marktgerechte Bewertung, keine Drückerei.' },
            { icon: Clock, title: 'Schnelle Abwicklung', text: 'Bewertung und Auszahlung ohne Wartezeit.' },
            { icon: CheckCircle2, title: 'Sofortige Barzahlung', text: 'Geld direkt bei Übergabe.' },
            { icon: ShieldCheck, title: 'Sichere Abmeldung', text: 'Wir kümmern uns um die Formalitäten.' },
          ].map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className="bg-card border border-border rounded-lg p-5">
                <div className="w-10 h-10 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                  <Icon size={18} strokeWidth={1.6} className="text-gold" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{b.title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* Formular */}
      <Reveal delay={100}>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-7 lg:p-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Car size={20} strokeWidth={1.6} className="text-gold" />
            </div>
            <div>
              <h2 className="text-xl font-[var(--font-heading)] font-semibold text-foreground">Fahrzeugdaten</h2>
              <p className="text-[13px] text-muted-foreground">Je mehr Angaben, desto schneller können wir bewerten.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label htmlFor="ankauf-brand" className={labelCls}>Marke *</label>
              <input id="ankauf-brand" required value={form.brand} onChange={set('brand')} placeholder="z. B. Volkswagen" className={inputCls} />
            </div>
            <div>
              <label htmlFor="ankauf-model" className={labelCls}>Modell *</label>
              <input id="ankauf-model" required value={form.model} onChange={set('model')} placeholder="z. B. Golf VII GTI" className={inputCls} />
            </div>
            <div>
              <label htmlFor="ankauf-reg" className={labelCls}>Erstzulassung</label>
              <input id="ankauf-reg" value={form.firstReg} onChange={set('firstReg')} placeholder="MM/JJJJ" className={inputCls} />
            </div>
            <div>
              <label htmlFor="ankauf-km" className={labelCls}>Kilometerstand *</label>
              <input id="ankauf-km" required inputMode="numeric" value={form.km} onChange={set('km')} placeholder="z. B. 89.000" className={inputCls} />
            </div>
            <div>
              <label htmlFor="ankauf-fuel" className={labelCls}>Kraftstoff</label>
              <select id="ankauf-fuel" value={form.fuel} onChange={set('fuel')} className={inputCls}>
                <option value="">Bitte wählen</option>
                {FUEL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ankauf-transmission" className={labelCls}>Getriebe</label>
              <select id="ankauf-transmission" value={form.transmission} onChange={set('transmission')} className={inputCls}>
                <option value="">Bitte wählen</option>
                {TRANSMISSION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ankauf-condition" className={labelCls}>Zustand</label>
              <select id="ankauf-condition" value={form.condition} onChange={set('condition')} className={inputCls}>
                <option value="">Bitte wählen</option>
                {CONDITION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ankauf-accident" className={labelCls}>Unfallstatus</label>
              <select id="ankauf-accident" value={form.accident} onChange={set('accident')} className={inputCls}>
                <option value="">Bitte wählen</option>
                {ACCIDENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ankauf-price" className={labelCls}>Preisvorstellung (optional)</label>
              <input id="ankauf-price" inputMode="numeric" value={form.price} onChange={set('price')} placeholder="z. B. 12.500" className={inputCls} />
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-2 mb-5">
            <h3 className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase mb-4">Ihre Kontaktdaten</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="ankauf-name" className={labelCls}>Name *</label>
                <input id="ankauf-name" required value={form.name} onChange={set('name')} placeholder="Ihr Name" className={inputCls} />
              </div>
              <div>
                <label htmlFor="ankauf-phone" className={labelCls}>Telefon (optional)</label>
                <input id="ankauf-phone" inputMode="tel" value={form.phone} onChange={set('phone')} placeholder="Für Rückfragen" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ankauf-message" className={labelCls}>Anmerkungen (optional)</label>
                <textarea id="ankauf-message" rows={3} value={form.message} onChange={set('message')} placeholder="Besonderheiten, Ausstattung, Mängel …" className={inputCls} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-semibold tracking-wide px-8 py-4 rounded-md transition-all duration-300"
          >
            <WhatsAppIcon size={17} />
            Anfrage per WhatsApp senden
          </button>

          <p className="text-[11px] text-muted-foreground/80 leading-relaxed mt-4 text-center">
            Beim Absenden öffnet sich WhatsApp mit Ihrer vorbereiteten Nachricht – Sie sehen alles vor dem
            Senden und Ihre Angaben werden nicht auf unserer Website gespeichert. Details in der{' '}
            <Link href="/datenschutz" className="text-gold hover:underline">Datenschutzerklärung</Link>.
          </p>
        </form>
      </Reveal>

      {/* Ablauf */}
      <Reveal delay={150}>
        <div className="max-w-3xl mx-auto mt-14">
          <h2 className="text-lg font-[var(--font-heading)] font-semibold text-foreground mb-6 text-center">So läuft der Ankauf ab</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Daten senden', text: 'Formular ausfüllen und per WhatsApp abschicken.' },
              { step: '2', title: 'Bewertung erhalten', text: 'Wir melden uns kurzfristig mit einer fairen Einschätzung.' },
              { step: '3', title: 'Verkauf & Auszahlung', text: 'Termin vor Ort, Barzahlung, Abmeldung inklusive.' },
            ].map((s) => (
              <li key={s.step} className="bg-card border border-border rounded-lg p-5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white text-[13px] font-bold mb-3">{s.step}</span>
                <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{s.title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </div>
  )
}
