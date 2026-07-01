'use client'

import { useState, useEffect } from 'react'
import { Phone, MapPin, MessageCircle, Clock, Send, CheckCircle2, Mail } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

function isOpenNow() {
  const now = new Date()
  const dayIndex = getTodayIndex()
  const todayHours = siteConfig.hours[dayIndex]
  if (todayHours.time === 'Geschlossen') return false
  const [start, end] = todayHours.time.split('–').map(t => t.trim())
  const [startH, startM] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  return minutesNow >= startH * 60 + startM && minutesNow < endH * 60 + endM
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: 'Fahrzeuginteresse', message: '' })
  const [open, setOpen] = useState<boolean | null>(null)
  const todayIndex = getTodayIndex()

  useEffect(() => {
    setOpen(isOpenNow())
    const t = setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => clearInterval(t)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const msg = `Hallo, mein Name ist ${form.name}. Anliegen: ${form.topic}. E-Mail: ${form.email}. Meine Nummer: ${form.phone}. Nachricht: ${form.message}`
    const url = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(msg)}`
    setTimeout(() => {
      window.open(url, '_blank')
      setSent(true)
      setLoading(false)
    }, 600)
  }

  return (
    <section id="kontakt" className="py-24 px-5 lg:px-10 section-alt">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-px bg-gold" />
              <span className="text-[11px] tracking-[0.3em] text-gold uppercase font-semibold">Kontakt</span>
            </div>
            <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold text-balance">
              Wir sind für Sie da
            </h2>
          </div>

          {/* Live open/closed badge */}
          {open !== null && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold w-fit ${
              open ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-muted text-muted-foreground border border-border'
            }`}>
              <span className={`w-2 h-2 rounded-full ${open ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/50'}`} aria-hidden="true" />
              {open ? 'Jetzt geöffnet' : 'Aktuell geschlossen'} · {siteConfig.hours[todayIndex].time}
            </div>
          )}
        </div>

        <div className="divider-gold mb-12 mt-6" />

        {/* Quick action row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <a
            href={`tel:+${siteConfig.contact.whatsapp}`}
            className="flex items-center gap-3 px-5 py-4 bg-card border border-border rounded-xl hover:border-gold/40 hover:shadow-sm transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
              <Phone size={16} strokeWidth={1.8} className="text-gold" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Anrufen</p>
              <p className="text-[13px] font-semibold text-foreground">{siteConfig.contact.phone}</p>
            </div>
          </a>

          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-pulse flex items-center gap-3 px-5 py-4 bg-[#25D366] rounded-xl hover:bg-[#22bf5d] transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={16} strokeWidth={1.8} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] text-white/75 uppercase tracking-wide">WhatsApp</p>
              <p className="text-[13px] font-semibold text-white">Jetzt schreiben</p>
            </div>
          </a>

          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex items-center gap-3 px-5 py-4 bg-card border border-border rounded-xl hover:border-gold/40 hover:shadow-sm transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
              <Mail size={16} strokeWidth={1.8} className="text-gold" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">E-Mail</p>
              <p className="text-[13px] font-semibold text-foreground truncate">{siteConfig.contact.email}</p>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">

          {/* Left: Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Contact details */}
            <div className="bg-card border border-border rounded-xl p-7">
              <h3 className="text-[12px] font-bold text-foreground mb-6 tracking-widest uppercase">Kontaktdaten</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <MapPin size={15} strokeWidth={1.8} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Adresse</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address.mapsQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] text-foreground hover:text-gold transition-colors leading-snug"
                    >
                      {siteConfig.address.street}<br />{siteConfig.address.zip} {siteConfig.address.city}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <Phone size={15} strokeWidth={1.8} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Telefon</p>
                    <a href={`tel:+${siteConfig.contact.whatsapp}`} className="text-[14px] text-foreground hover:text-gold transition-colors">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <Mail size={15} strokeWidth={1.8} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">E-Mail</p>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-[14px] text-foreground hover:text-gold transition-colors break-all">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening hours */}
            <div className="bg-card border border-border rounded-xl p-7">
              <div className="flex items-center gap-2.5 mb-5">
                <Clock size={14} strokeWidth={1.8} className="text-gold" />
                <h3 className="text-[12px] font-bold text-foreground tracking-widest uppercase">Öffnungszeiten</h3>
              </div>
              <ul className="space-y-1.5">
                {siteConfig.hours.map((h, i) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0"
                  >
                    <span className={`text-[13px] flex items-center gap-2 ${i === todayIndex ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                      {i === todayIndex && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" aria-hidden="true" />
                      )}
                      {h.day}
                    </span>
                    <span className={`text-[13px] ${h.time === 'Geschlossen' ? 'text-muted-foreground/50' : i === todayIndex ? 'text-gold font-semibold' : 'text-muted-foreground'}`}>
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-xl p-8 h-full">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center">
                    <CheckCircle2 size={28} strokeWidth={1.5} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-[var(--font-heading)] font-semibold text-foreground mb-2">Vielen Dank!</h3>
                    <p className="text-[13px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      Ihre Anfrage wurde an WhatsApp weitergeleitet. Wir melden uns so schnell wie möglich bei Ihnen.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', topic: 'Fahrzeuginteresse', message: '' }) }}
                    className="text-[12px] text-gold hover:underline font-semibold tracking-wide"
                  >
                    Neue Anfrage stellen
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-[20px] font-[var(--font-heading)] font-semibold text-foreground mb-1.5">Nachricht senden</h3>
                  <p className="text-[13px] text-muted-foreground mb-7">Wir antworten in der Regel innerhalb weniger Stunden.</p>

                  <form onSubmit={handleSubmit} className="space-y-4" aria-label="Kontaktformular">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-[11px] font-bold text-foreground mb-1.5 tracking-widest uppercase">
                          Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Max Mustermann"
                          className="w-full px-4 py-3 text-[13px] bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#c7c9cc] focus:ring-2 focus:ring-[#c7c9cc]/15 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-[11px] font-bold text-foreground mb-1.5 tracking-widest uppercase">
                          E-Mail
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="max@beispiel.de"
                          className="w-full px-4 py-3 text-[13px] bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#c7c9cc] focus:ring-2 focus:ring-[#c7c9cc]/15 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-[11px] font-bold text-foreground mb-1.5 tracking-widest uppercase">
                          Telefon
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="0173 1234567"
                          className="w-full px-4 py-3 text-[13px] bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#c7c9cc] focus:ring-2 focus:ring-[#c7c9cc]/15 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="topic-inline" className="block text-[11px] font-bold text-foreground mb-1.5 tracking-widest uppercase">
                          Anliegen
                        </label>
                        <select
                          id="topic-inline"
                          name="topic"
                          value={form.topic}
                          onChange={handleChange}
                          className="w-full px-4 py-3 text-[13px] bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-[#c7c9cc] focus:ring-2 focus:ring-[#c7c9cc]/15 transition-all appearance-none cursor-pointer"
                        >
                          <option value="Fahrzeuginteresse">Fahrzeuginteresse</option>
                          <option value="Ankauf">Fahrzeug verkaufen / Ankauf</option>
                          <option value="Finanzierung">Finanzierung</option>
                          <option value="Allgemeine Anfrage">Allgemeine Anfrage</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-[11px] font-bold text-foreground mb-1.5 tracking-widest uppercase">
                        Nachricht *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Ich interessiere mich für ... / Ich suche ein Fahrzeug mit ..."
                        className="w-full px-4 py-3 text-[13px] bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#c7c9cc] focus:ring-2 focus:ring-[#c7c9cc]/15 transition-all resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gold text-white text-[13px] font-semibold tracking-widest uppercase rounded-lg hover:bg-gold/90 transition-all duration-300 disabled:opacity-60"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        ) : (
                          <Send size={14} strokeWidth={2} />
                        )}
                        {loading ? 'Senden...' : 'Per WhatsApp senden'}
                      </button>
                      <p className="text-[11px] text-muted-foreground">
                        Öffnet WhatsApp mit Ihrer Nachricht
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
