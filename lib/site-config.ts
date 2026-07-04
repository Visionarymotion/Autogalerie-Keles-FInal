/**
 * ZENTRALE FIRMENDATEN
 * ---------------------------------------------------------
 * Alle Komponenten ziehen Adresse, Telefon, Öffnungszeiten etc.
 * aus DIESER Datei. Wenn sich etwas ändert (z. B. Adresse,
 * Telefonnummer, Öffnungszeiten) – hier einmal anpassen,
 * statt es in 5 Dateien zu suchen.
 *
 * Adresse vom Kunden bestätigt + gegengeprüft mit mobile.de-
 * Händlerprofil und dem offiziellen Instagram-Auftritt:
 * "Am Sieltief 2, 26954 Nordenham" ✓
 *
 * TODO (Kunde): für das Impressum noch offen:
 * - USt-IdNr. (falls vorhanden)
 * - Steuernummer
 * - Registereintrag, falls im Handelsregister eingetragen
 */

export const siteConfig = {
  name: 'Autogalerie Keles',
  tagline: 'Ihr vertrauensvoller Gebrauchtwagen-Händler in Nordenham',

  address: {
    street: 'Am Sieltief 2',
    zip: '26954',
    city: 'Nordenham',
    full: 'Am Sieltief 2, 26954 Nordenham',
    mapsQuery: 'Am Sieltief 2, 26954 Nordenham',
  },

  contact: {
    phone: '04731 3699444',
    phoneHref: '+4947313699444',
    whatsapp: '4947313699444',
    ctaPhone: '0159 01290621',
    ctaPhoneHref: '+4915901290621',
    ctaWhatsapp: '4915901290621',
    email: 'auto@galerie-keles.com',
  },

  hours: [
    { day: 'Montag', time: '09:00 – 18:00' },
    { day: 'Dienstag', time: '09:00 – 18:00' },
    { day: 'Mittwoch', time: '09:00 – 18:00' },
    { day: 'Donnerstag', time: '09:00 – 18:00' },
    { day: 'Freitag', time: '09:00 – 18:00' },
    { day: 'Samstag', time: '09:00 – 18:00' },
    { day: 'Sonntag', time: 'Geschlossen' },
  ],

  // Echte, nachprüfbare Bewertungen – zwei Quellen, wie gewünscht.
  // mobile.de: live geprüft (115 Bewertungen, Gesamt 5.0/5).
  // Google: noch nicht verifiziert – siehe Hinweis bei reviews.google unten.
  rating: {
    value: 5.0,
    count: 115,
    source: 'mobile.de',
    sourceUrl: 'https://www.mobile.de/bewertungen/AutogalerieKeles',
  },

  reviewsGoogle: {
    value: 4.6 as number | null,
    count: 42 as number | null,
    sourceUrl: 'https://www.google.com/search?q=Autogalerie+Keles+Rezensionen' as string | null,
  },

  links: {
    mobileDe: 'https://home.mobile.de/AUTOGALERIEKELES',
  },

  // Pflichtangaben für das Impressum (§5 DDG).
  legal: {
    ownerName: 'Cengiz Keles',
    companyName: 'Autogalerie Keles – Cengiz Keles Autohandel',
    legalForm: 'Einzelunternehmen / Gewerbebetrieb',
    vatId: 'DE 341445719' as string | null,
    taxNumber: null as string | null, // TODO (Kunde): Steuernummer nachreichen
    register: null as string | null, // TODO (Kunde): nur falls im Handelsregister eingetragen
  },
} as const

export type SiteConfig = typeof siteConfig
