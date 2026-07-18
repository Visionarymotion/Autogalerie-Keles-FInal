import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export const metadata = {
  title: `Impressum – ${siteConfig.name}`,
}

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-background px-5 lg:px-10 py-20">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-gold transition-colors mb-10">
          <ArrowLeft size={15} strokeWidth={2} />
          Zurück zur Startseite
        </Link>

        <h1 className="font-[var(--font-heading)] text-4xl font-semibold text-foreground mb-10">Impressum</h1>

        <div className="space-y-8 text-[14px] text-foreground leading-relaxed">
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-gold mb-2">Angaben gemäß § 5 DDG</h2>
            <p>
              {siteConfig.legal.companyName}<br />
              Inhaber: {siteConfig.legal.ownerName}<br />
              {siteConfig.address.street}<br />
              {siteConfig.address.zip} {siteConfig.address.city}
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-gold mb-2">Kontakt</h2>
            <p>
              Telefon: {siteConfig.contact.phone}<br />
              E-Mail: {siteConfig.contact.email}
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-gold mb-2">Rechtsform / Registereintrag</h2>
            <p>
              {siteConfig.legal.legalForm}
              {siteConfig.legal.register ? <><br />{siteConfig.legal.register}</> : null}
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-gold mb-2">Umsatzsteuer-ID</h2>
            <p>{siteConfig.legal.vatId ?? 'Wird nachgereicht.'}</p>
          </section>

          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-gold mb-2">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              {siteConfig.legal.ownerName}<br />
              {siteConfig.address.street}, {siteConfig.address.zip} {siteConfig.address.city}
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-gold mb-2">Verbraucherstreitbeilegung</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
