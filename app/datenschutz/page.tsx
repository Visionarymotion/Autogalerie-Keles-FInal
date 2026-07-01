import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export const metadata = {
  title: `Datenschutzerklärung – ${siteConfig.name}`,
}

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-background px-5 lg:px-10 py-20">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-gold transition-colors mb-10">
          <ArrowLeft size={15} strokeWidth={2} />
          Zurück zur Startseite
        </Link>

        <h1 className="font-[var(--font-heading)] text-4xl font-semibold text-foreground mb-3">Datenschutzerklärung</h1>
        <p className="text-[13px] text-muted-foreground mb-10">Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })}</p>

        <div className="space-y-9 text-[14px] text-foreground leading-relaxed">

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">1. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br /><br />
              {siteConfig.legal.companyName}<br />
              {siteConfig.legal.ownerName}<br />
              {siteConfig.address.street}, {siteConfig.address.zip} {siteConfig.address.city}<br />
              Telefon: {siteConfig.contact.phone}<br />
              E-Mail: {siteConfig.contact.email}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">2. Hosting</h2>
            <p>
              Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Seite verarbeitet Vercel
              automatisch technische Daten (z. B. IP-Adresse, Browsertyp, Datum und Uhrzeit des
              Zugriffs) in Server-Logfiles. Diese Verarbeitung ist zur Bereitstellung der Website
              technisch erforderlich (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">3. Kontaktformular</h2>
            <p>
              Wenn Sie uns über das Kontaktformular eine Anfrage senden, werden Ihre Angaben (Name,
              Telefonnummer, Nachricht) zur Bearbeitung Ihrer Anfrage genutzt. Das Formular leitet
              Ihre Nachricht direkt an WhatsApp weiter. Es gelten zusätzlich die Datenschutzhinweise
              von WhatsApp/Meta (siehe Punkt 5). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
              (Vertragsanbahnung) bzw. lit. f (berechtigtes Interesse an Kundenkontakt).
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">4. Google Maps</h2>
            <p>
              Zur Anzeige unseres Standorts binden wir eine Karte von Google Maps ein (Google
              Ireland Limited). Beim Aufruf der Seite mit eingebetteter Karte kann Google Daten
              über Ihre Nutzung verarbeiten, ggf. auch außerhalb der EU. Rechtsgrundlage ist Art. 6
              Abs. 1 lit. f DSGVO (übersichtliche Darstellung unseres Standorts). Weitere Infos:{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                Datenschutzerklärung von Google
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">5. WhatsApp</h2>
            <p>
              Über die WhatsApp-Buttons auf dieser Website können Sie direkt mit uns in Kontakt
              treten. Dabei wird die WhatsApp-Anwendung (Meta) genutzt; es gelten die
              Datenschutzbestimmungen von WhatsApp/Meta. Die Nutzung ist freiwillig und erfolgt auf
              Ihre Initiative (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">6. Cookies</h2>
            <p>
              Diese Website verwendet aktuell keine eigenen Tracking- oder Marketing-Cookies.
              Technisch notwendige Cookies (z. B. zur grundlegenden Funktion der Seite) können
              gesetzt werden. Eingebundene Drittinhalte (Google Maps) können eigene Cookies setzen
              – siehe Punkt 4.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">7. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung
              der Verarbeitung Ihrer personenbezogenen Daten sowie ein Recht auf
              Datenübertragbarkeit und Widerspruch. Wenden Sie sich hierfür an die oben genannte
              Kontaktadresse. Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
              zu beschweren.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
