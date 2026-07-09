import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Calculator, ArrowRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { services, getServiceBySlug } from '@/lib/services-data'
import { siteConfig } from '@/lib/site-config'

function WhatsAppIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77 0.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.89 14.32c-0.25 0.7-1.24 1.28-2.02 1.45-0.54 0.11-1.24 0.2-3.62-0.78-2.9-1.2-4.77-4.15-4.92-4.34-0.14-0.19-1.18-1.57-1.18-3 0-1.42 0.75-2.12 1.02-2.41 0.27-0.29 0.58-0.36 0.78-0.36 0.19 0 0.39 0 0.56 0.01 0.18 0.01 0.42-0.07 0.66 0.5 0.25 0.59 0.84 2.05 0.92 2.2 0.08 0.15 0.13 0.32 0.03 0.51-0.1 0.19-0.15 0.3-0.29 0.47-0.15 0.16-0.31 0.36-0.44 0.49-0.15 0.15-0.3 0.3-0.13 0.6 0.17 0.29 0.75 1.24 1.61 2.01 1.11 0.99 2.04 1.3 2.34 1.45 0.29 0.15 0.47 0.13 0.64-0.05 0.18-0.19 0.73-0.85 0.92-1.14 0.19-0.29 0.39-0.24 0.65-0.14 0.27 0.1 1.7 0.8 1.99 0.95 0.29 0.15 0.48 0.22 0.55 0.34 0.08 0.13 0.08 0.72-0.17 1.42Z" />
    </svg>
  )
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: `${service.title} – ${siteConfig.name}`,
    description: service.shortText,
  }
}

export default async function LeistungDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const Icon = service.icon
  const waHref = `https://wa.me/${siteConfig.contact.ctaWhatsapp}?text=${encodeURIComponent(`Hallo, ich habe eine Frage zum Thema "${service.title}".`)}`
  const otherServices = services.filter((s) => s.slug !== service.slug)

  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-32 pb-24 px-5 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/#leistungen" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-gold transition-colors mb-10">
            <ArrowLeft size={15} strokeWidth={2} />
            Zurück zu Unsere Leistungen
          </Link>

          <div className="w-14 h-14 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center mb-6">
            <Icon size={26} strokeWidth={1.6} className="text-gold" />
          </div>

          <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl text-foreground font-semibold mb-5 text-balance">
            {service.title}
          </h1>

          <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
            {service.intro}
          </p>

          <div className="bg-card border border-border rounded-xl p-7 mb-10">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-foreground mb-5">Das bieten wir Ihnen</h2>
            <ul className="space-y-3.5">
              {service.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] text-foreground/90">
                  <CheckCircle2 size={17} strokeWidth={1.8} className="text-gold mt-0.5 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {service.slug === 'finanzierung' && (
            <Link
              href="/finanzierungsrechner"
              className="flex items-center justify-between gap-4 bg-gold/10 border border-gold/30 rounded-xl p-6 mb-10 hover:bg-gold/15 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-md bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <Calculator size={20} strokeWidth={1.6} className="text-gold" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-foreground mb-0.5">Finanzierungsrechner nutzen</p>
                  <p className="text-[12.5px] text-muted-foreground">Monatliche Rate in Sekunden berechnen</p>
                </div>
              </div>
              <ArrowRight size={18} strokeWidth={2} className="text-gold transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
            </Link>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-pulse w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-[#25D366] text-white text-[13px] font-semibold tracking-widest uppercase hover:bg-[#20bd5a] transition-all duration-300 rounded-sm"
            >
              <WhatsAppIcon size={15} />
              {service.ctaText}
            </a>
            <Link
              href="/fahrzeuge"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-foreground text-foreground text-[13px] font-semibold tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300 rounded-sm"
            >
              Fahrzeugbestand ansehen
            </Link>
          </div>

          <div className="border-t border-border pt-10">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground mb-5">Weitere Leistungen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherServices.map((s) => {
                const OtherIcon = s.icon
                return (
                  <Link
                    key={s.slug}
                    href={`/leistungen/${s.slug}`}
                    className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3.5 hover:border-gold/40 transition-colors"
                  >
                    <OtherIcon size={16} strokeWidth={1.8} className="text-gold flex-shrink-0" />
                    <span className="text-[13.5px] font-medium text-foreground">{s.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
