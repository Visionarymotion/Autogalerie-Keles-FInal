import { ShieldCheck, CreditCard, RefreshCcw, Wrench, Search, Truck, type LucideIcon } from 'lucide-react'

export type ServiceItem = {
  slug: string
  title: string
  shortText: string
  intro: string
  bullets: string[]
  ctaText: string
  icon: LucideIcon
}

export const services: ServiceItem[] = [
  {
    slug: 'gepruefte-qualitaet',
    title: 'Geprüfte Qualität',
    shortText: 'Jedes Fahrzeug wird vor dem Verkauf technisch und optisch geprüft. Keine versteckten Mängel.',
    intro:
      'Bei Autogalerie Keles durchläuft jedes Fahrzeug vor dem Verkauf eine gründliche technische und optische Prüfung. Wir stehen für Transparenz und Vertrauen – keine versteckten Mängel, keine bösen Überraschungen.',
    bullets: [
      'Technische Prüfung von Motor, Fahrwerk und Bremsen',
      'Optische Kontrolle von Lack, Innenraum und Bereifung',
      'Vollständige Fahrzeughistorie, soweit verfügbar',
      'Offene Kommunikation zu Zustand und Vorschäden',
    ],
    ctaText: 'Fragen zu einem Fahrzeug?',
    icon: ShieldCheck,
  },
  {
    slug: 'finanzierung',
    title: 'Finanzierung',
    shortText: 'Günstige Finanzierungsmöglichkeiten für jeden Bedarf. Wir beraten Sie individuell und transparent.',
    intro:
      'Wir bieten Ihnen günstige und flexible Finanzierungsmöglichkeiten für Ihr Wunschfahrzeug – individuell abgestimmt auf Ihre Situation. Nutzen Sie unseren Finanzierungsrechner für eine erste, unverbindliche Einschätzung Ihrer monatlichen Rate.',
    bullets: [
      'Individuelle Beratung zu Laufzeit und Anzahlung',
      'Transparente Konditionen ohne versteckte Kosten',
      'Schnelle Bearbeitung und unkomplizierte Antragstellung',
      'Finanzierung für nahezu jedes Fahrzeug in unserem Bestand',
    ],
    ctaText: 'Finanzierung anfragen',
    icon: CreditCard,
  },
  {
    slug: 'inzahlungnahme',
    title: 'Inzahlungnahme',
    shortText: 'Wir nehmen Ihr Fahrzeug fair in Zahlung. Schnelle Bewertung und unkomplizierte Abwicklung.',
    intro:
      'Tauschen Sie Ihr aktuelles Fahrzeug unkompliziert gegen Ihr neues Wunschauto. Wir bewerten Ihr Fahrzeug fair und rechnen den Wert direkt gegen Ihren Kaufpreis an.',
    bullets: [
      'Kostenlose, faire Fahrzeugbewertung',
      'Anrechnung direkt auf den Kaufpreis',
      'Keine separate Verkaufsabwicklung nötig',
      'Für nahezu alle Marken und Modelle möglich',
    ],
    ctaText: 'Fahrzeug bewerten lassen',
    icon: RefreshCcw,
  },
  {
    slug: 'ankauf',
    title: 'Ankauf',
    shortText: 'Wir kaufen Ihr Fahrzeug! Faire Preise, sofortige Barzahlung und schnelle Abwicklung ohne Stress.',
    intro:
      'Sie möchten Ihr Fahrzeug verkaufen, ohne selbst ein neues bei uns zu kaufen? Kein Problem – wir kaufen Ihr Auto zu einem fairen Preis, mit sofortiger Zahlung und ohne bürokratischen Aufwand.',
    bullets: [
      'Kostenlose und unverbindliche Bewertung',
      'Faire, marktgerechte Preise',
      'Sofortige Barzahlung oder Überweisung',
      'Übernahme der Ummeldung auf Wunsch',
    ],
    ctaText: 'Fahrzeug verkaufen',
    icon: Wrench,
  },
  {
    slug: 'wunschfahrzeug',
    title: 'Wunschfahrzeug',
    shortText: 'Das gewünschte Modell nicht dabei? Wir suchen es für Sie — markenübergreifend und zuverlässig.',
    intro:
      'Ihr Traumauto ist gerade nicht in unserem Bestand? Wir übernehmen die Suche für Sie – markenübergreifend, zuverlässig und mit dem gleichen Qualitätsanspruch wie bei allen unseren Fahrzeugen.',
    bullets: [
      'Markenübergreifende Fahrzeugsuche',
      'Zugriff auf ein großes Händlernetzwerk',
      'Gleicher Qualitätscheck wie bei Bestandsfahrzeugen',
      'Persönliche Beratung zu Ausstattung und Budget',
    ],
    ctaText: 'Wunschfahrzeug anfragen',
    icon: Search,
  },
  {
    slug: 'lieferung',
    title: 'Lieferung',
    shortText: 'Fahrzeuglieferung auf Anfrage möglich. Bequem nach Hause geliefert, komplett fertig zugelassen.',
    intro:
      'Keine Zeit für die Abholung? Wir liefern Ihr neues Fahrzeug auf Wunsch bequem zu Ihnen nach Hause – komplett fertig zugelassen und einsatzbereit.',
    bullets: [
      'Lieferung deutschlandweit auf Anfrage',
      'Fahrzeug bei Ankunft fertig zugelassen',
      'Persönliche Übergabe und Einweisung',
      'Transparente Absprache von Termin und Kosten',
    ],
    ctaText: 'Lieferung anfragen',
    icon: Truck,
  },
]

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug)
}
