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
              technisch erforderlich (Art. 6 Abs. 1 lit. f DSGVO). Vercel ist ein US-Unternehmen;
              eine Verarbeitung der Daten auf Servern außerhalb der EU (insbesondere in den USA)
              ist möglich. Für die Auftragsverarbeitung besteht mit Vercel Inc. ein
              Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO. Die Übermittlung stützt sich auf die EU-Standardvertragsklauseln bzw.
              das EU-US Data Privacy Framework.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">3. Kontakt- und Ankauf-Formular</h2>
            <p>
              Wenn Sie uns über das Kontaktformular oder das Fahrzeug-Ankauf-Formular eine Anfrage
              senden, werden Ihre Angaben (z. B. Name, Telefonnummer, Fahrzeugdaten, Nachricht) zur
              Bearbeitung Ihrer Anfrage genutzt. Beide Formulare leiten Ihre Nachricht direkt an
              WhatsApp weiter – eine Speicherung auf unserer Website findet nicht statt. Es gelten
              zusätzlich die Datenschutzhinweise von WhatsApp/Meta (siehe Punkt 5). Rechtsgrundlage
              ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. lit. f (berechtigtes
              Interesse an Kundenkontakt).
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">4. Google Maps</h2>
            <p>
              Zur Anzeige unseres Standorts binden wir eine Karte von Google Maps ein (Google
              Ireland Limited). Die Karte wird nicht automatisch geladen, sondern erst, wenn Sie
              aktiv auf „Karte laden“ klicken. Erst dann kann Google Daten über Ihre Nutzung
              verarbeiten, ggf. auch außerhalb der EU. Rechtsgrundlage ist Ihre Einwilligung durch
              den Klick (Art. 6 Abs. 1 lit. a DSGVO). Weitere Infos:{' '}
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
              Technisch notwendige Speichervorgänge (z. B. zur grundlegenden Funktion der Seite) können
              gesetzt werden. Ihre Entscheidung zum Laden der Google-Maps-Karte (siehe Punkt 4)
              speichern wir lokal in Ihrem Browser (localStorage), damit Sie nicht bei jedem Besuch
              erneut gefragt werden – hierbei werden keine Daten an uns übertragen.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">7. Webanalyse (Vercel Analytics)</h2>
            <p>
              Zur Verbesserung unseres Angebots nutzen wir Vercel Web Analytics. Dieses Verfahren
              arbeitet ohne Cookies und ohne geräteübergreifendes Tracking: Es werden ausschließlich
              aggregierte, anonymisierte Nutzungsdaten erhoben (z. B. aufgerufene Seiten, Herkunftsland,
              Gerätetyp). Eine Identifizierung einzelner Besucher ist nicht möglich; IP-Adressen werden
              nicht dauerhaft gespeichert. Rechtsgrundlage ist unser berechtigtes Interesse an der
              statistischen Auswertung und Verbesserung der Website (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">8. Merkliste (lokale Speicherung)</h2>
            <p>
              Die Merkliste-Funktion (Herz-Symbol auf Fahrzeugkarten) speichert die IDs
              gemerkter Fahrzeuge ausschließlich lokal in Ihrem Browser (localStorage).
              Es werden dabei keine personenbezogenen Daten an unsere Server oder Dritte
              übertragen; die Auswahl bleibt auf Ihrem Gerät und wird beim Löschen der
              Browserdaten automatisch entfernt. Eine gesonderte Einwilligung ist hierfür
              nicht erforderlich, da keine Datenverarbeitung außerhalb Ihres Endgeräts
              stattfindet (kein Personenbezug, Art. 4 Nr. 1 DSGVO nicht einschlägig).
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[var(--font-heading)] font-semibold mb-2">9. Ihre Rechte</h2>
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
