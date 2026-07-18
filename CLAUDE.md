## Agentur-Standards (Visionary Motion, projektübergreifend verbindlich)

Vollständige Fassung: `CLAUDE.md` im Hauptordner `VM Visionary Motion Digital/`. Kernpunkte, falls dieses Repo eigenständig geöffnet wird:

- **Qualitäts-Gate vor jedem Push:** Build + Lint/Typecheck grün, Secrets-Check (`.env*` nie committen), Browser-Test (Golden Path + Edge Cases), Mobile+Desktop-Check — sonst kein Push.
- **Deploy:** GitHub-Push automatisch nach Freigabe. Vercel-Deploy und lokaler Dev-Server nur nach expliziter Zustimmung, vorher aktiv fragen.
- **Design:** Farbpalette immer Kunden-Branding (Silber/Chrome bei diesem Kunden), nie eine feste VM-Palette. High-End, kein generischer KI-Look.
- **DSGVO/A11y:** WCAG 2.1 AA, Consent vor Tracking, Impressum/Datenschutz-Pflicht.
- **Footer:** zweizeilig, mittig unten — Zeile 1 "Realisiert von" dünn, Zeile 2 "Visionary Motion Digital" fett. Keine Abweichungen.
- **Fertigstellung:** vor jedem "fertig" ein Abschluss-Audit (Sicherheit, GEO/KI-SEO, SEO, Rechtliches), Ergebnis als Vorschlag zur Freigabe, nicht eigenmächtig einbauen. Danach Übergabeprotokoll in `01-Doku/` aktualisieren (umgesetzt/neu/offen).
- **Skills:** `.claude/skills/` in diesem Repo enthält u. a. `impeccable`, `emil-design-eng`, `design-taste-frontend`, `ui-ux-pro-max`, `web-design-guidelines`, `vercel-react-best-practices`, `next-best-practices`, `before-and-after`, `next-upgrade`, `vercel-blob`, `dependency-upgrade`, `vulnerability-scanning` — proaktiv nutzen, wo passend, kurz erwähnen was verwendet wurde. `vercel-blob` explizit vor jeder Änderung an `lib/vehicle-store.ts` konsultieren (siehe offener Blob-Versions-Fund im Chat-Verlauf).

---

# Autogalerie Keles — Projekt-Übergabe für Claude Code

> Diese Datei ist für die Übernahme in eine **Claude Code**-Session mit direktem
> Git-/Dateisystem-Zugriff auf das Repo gedacht. Sie fasst Architektur, den
> aktuellen Stand (Runde 7 abgeschlossen) und die priorisierten offenen Punkte
> zusammen. Am Projektende steht ein Abschnitt "Hinweis für Claude Code", der
> klarstellt, was von den bisherigen Workarounds für Claude Code irrelevant ist.

## Projekt-Stammdaten

- **Kunde**: Autogalerie Keles (Cengiz Keles), Am Sieltief 2, 26954 Nordenham — Gebrauchtwagenhändler.
- **Auftraggeber-Agentur**: Visionary Motion (Vision, contact.visionarymotion@gmail.com).
- **Repo**: `Visionarymotion/Autogalerie-Keles-FInal` auf GitHub (**öffentlich**).
- **Hosting**: Vercel, Projekt `autogalerie-keles-final`
  - `projectId`: `prj_O51WuYE6PEntMOMR4vSK0O9Ua0My`
  - `teamId`: `team_GBEqv4N1dHIVwZxtevAi134J`
- **Live-URL**: https://autogalerie-keles-final.vercel.app
- **Stack**: Next.js (App Router), TypeScript, Tailwind CSS, Vercel Blob Storage als Datenschicht, Vercel Analytics.
- **Noch keine eigene Domain** — größte verbleibende SEO/GEO-Lücke, liegt außerhalb des Codes (Kundenentscheidung).

## Architektur-Überblick

- **Fahrzeugdaten**: `lib/vehicle-store.ts` liest/schreibt über Vercel Blob Storage
  (Store-Name `BLOBMain`, Env-Var `BLOBMain_STORE_ID`, Blob-Pfad `data/vehicles-data.json`).
  `getVehicles()` fällt bei jedem Fehler auf die Startdaten (`lib/vehicles-data.ts`,
  `seedVehicles`) zurück. `saveVehicles()` schreibt per `put()` mit `allowOverwrite: true`.
- **Fahrzeugtyp**: `lib/vehicles-data.ts` exportiert den `Vehicle`-Typ (Marke, Modell,
  Preis, Erstzulassung, km, PS, Kraftstoff, Getriebe, Vorbesitzer, Verbrauch, Fotos usw.).
  **Fehlt aktuell** (relevant für mobile.de-Anbindung, siehe unten): FIN/VIN, strukturierte
  Ausstattungsliste, Farbe, Karosserieform, Zustandsbericht, Garantie/Gewährleistung,
  Lieferoptionen.
- **Admin-CMS**: `app/admin/` — vollständiges Panel zur manuellen Fahrzeugpflege
  (`page.tsx`, `vehicle-table.tsx`, `fahrzeuge/`-Unterseiten, `login/page.tsx`).
  Auth: `app/api/admin/login/route.ts` prüft Passwort gegen `process.env.ADMIN_PASSWORD`,
  setzt `admin_session`-Cookie. `middleware.ts` schützt `/admin/:path*` und
  `/api/admin/:path*` zentral (`matcher`-Config).
- **Fahrzeugfotos**: `app/api/vehicle-image/[...path]/route.ts` — Proxy-Route, holt Fotos
  von `img.classistatic.de` (mobile.de-CDN) mit passendem Referer-Header, `cache: 'no-store'`.
  **Wichtig**: Diese Route liefert Pfade ohne Dateiendung — Vercels Image-Optimizer lehnt
  sie mit `400 INVALID_IMAGE_OPTIMIZE_REQUEST` ab, siehe Performance-Abschnitt unten.
- **Bild-Optimierung**: `next.config.mjs` hat `images.unoptimized` NICHT mehr global gesetzt
  (seit Runde 7 entfernt) — responsive Next.js-Bildvarianten sind aktiv für Hero/statische
  Assets. Für alle `<Image>`-Komponenten, die Fotos über `/api/vehicle-image/...` rendern,
  ist gezielt die `unoptimized`-Prop gesetzt (siehe Fixliste unten) — **das muss bei jeder
  neuen Komponente, die Fahrzeugfotos rendert, mitgedacht werden**, sonst bricht das Bild
  wieder mit demselben 400er.
- **Risiko, bewusst nicht geändert**: `next.config.mjs` hat weiterhin
  `typescript: { ignoreBuildErrors: true }`. Unterdrückt TS-Fehler beim Build — Risiko, dass
  sich unbemerkt Typfehler ansammeln, die bei einer größeren Änderung (z. B. mobile.de-Schema-
  Umbau) plötzlich in Masse sichtbar werden.

## Runde 7 (aktuellster Stand, abgeschlossen)

Auslöser: Kunde wollte einen ehrlichen Gesamt-Check ("würdest du die Seite so rausgeben")
inkl. mobile.de-Readiness, Bewertung der eigenen Terminbuchungs-Idee, und erneuter Prüfung
von GEO/SEO/KI-SEO/Performance/DSGVO/Recht.

### Performance-Regression gefunden und behoben (3 Commits)

Ursache: Beim Hero-Bild-Schärfen in Runde 6 blieb `images.unoptimized: true` aktiv → das
neue 563KB-Hero-Bild wurde ungedrosselt auch an Smartphones ausgeliefert.

1. **Commit `7017a56`** — `images.unoptimized: true` aus `next.config.mjs` entfernt.
   Hero-Bild danach über `/_next/image` mit 115KB statt 563KB (−80%).
2. **Regression dadurch**: Fahrzeugkarten auf `/fahrzeuge` brachen (Optimizer lehnt
   `/api/vehicle-image/...`-Pfade ab, `400 INVALID_IMAGE_OPTIMIZE_REQUEST`).
3. **Commit `75186ea`** — `unoptimized`-Prop gezielt auf `<Image>` in
   `app/fahrzeuge/fahrzeugbestand-client.tsx` (Kartenkomponente `CarCard`) gesetzt.
4. **Commit `0cb84d4`** (diese Runde) — derselbe Fehler auf der Fahrzeug-**Detailseite**
   gefunden (`app/fahrzeuge/[slug]/vehicle-detail-client.tsx`, eigene Datei mit eigener
   Foto-Galerie, 2 betroffene `<Image>`-Tags: Hauptbild + Thumbnail-Strip) und ebenfalls
   mit `unoptimized` gefixt.
5. **Deployment `dpl_Hc8rVwhPvcrhUuBhga2BkW9dRJ9u`** als READY bestätigt, live per
   Netzwerk-Log verifiziert: alle `/api/vehicle-image/...`-Requests auf `/fahrzeuge` und
   zwei Detailseiten liefern durchgehend Status 200, Bilder rendern sichtbar scharf.

**Stand**: Regression vollständig behoben, kein bekannter Bildfehler mehr.

### mobile.de-Anbindung — ehrliche Einschätzung

Datenschicht (Blob-Store + Admin-Panel + `getVehicles()`) ist eine gute Grundlage, aber
eine echte API-Anbindung ist **kein Ein-Schalter-Umlegen**, sobald der Händler-Zugang da
ist. Zwei echte Bauaufgaben stehen aus:
- `Vehicle`-Schema erweitern (VIN, Ausstattungsliste, Farbe, Karosserieform,
  Zustandsbericht, Garantie, Lieferoptionen).
- Sync-Job bauen (Cron/Webhook, der mobile.de-Daten holt, mapped, in den Blob-Store
  schreibt, inkl. Fehlerbehandlung bei Nichterreichbarkeit/gelöschten Inseraten).

### Terminbuchung — Bewertung der Kundenidee

Empfehlung: **kein** volles Buchungskalender-System — Aufwand/Nutzen passt nicht für
einen inhabergeführten Händler, bei dem Kunden ohnehin anrufen/schreiben. Falls überhaupt
gewünscht: einfaches "Wunschtermin"-Freitextfeld in bestehenden Formularen (Kontakt/
Ankauf), das in die WhatsApp-/E-Mail-Nachricht mit übernommen wird. **Noch nicht
umgesetzt** — nur bauen, wenn der Kunde das nach dieser Einschätzung weiterhin will.

### GEO/SEO/KI-SEO/DSGVO/Recht — erneut geprüft, weiterhin solide

- Sitemap: 49 URLs, alle Kernseiten enthalten.
- `robots.txt`: Freigabe für GPTBot, ClaudeBot, PerplexityBot, Google-Extended u.a.
- JSON-LD (AutoDealer, Vehicle/Car pro Detailseite, FAQPage) vorhanden.
- `app/impressum/page.tsx`: korrektes § 5 DDG (nicht mehr TMG), EU-Streitschlichtung,
  Verbraucherstreitbeilegung — solide.
- **Neuer Fund**: `/leistungen/gepruefte-qualitaet` existiert bereits und deckt einen Teil
  der in Runde 5 als Lücke markierten "Prüfsiegel/Trust-Badge"-Idee ab.
- Kein Handlungsbedarf in diesen Bereichen diese Runde.

### Security-Fund (noch offen)

`app/api/admin/login/route.ts` setzt den `admin_session`-Cookie auf den **Klartext des
Admin-Passworts** statt auf ein zufälliges/signiertes Token:

```typescript
response.cookies.set('admin_session', validPassword, { httpOnly: true, secure: ... })
```

`middleware.ts` prüft entsprechend `session === process.env.ADMIN_PASSWORD`. Aktuell durch
`httpOnly`+`secure` mitigiert, aber sollte auf ein signiertes Session-Token umgestellt
werden (kein akuter Vorfall, aber unnötiges Restrisiko). `middleware.ts` selbst dokumentiert
per Kommentar einen früheren echten Vorfall — Admin-Bereich war kurzzeitig ganz ohne
Passwortschutz erreichbar, seither behoben.

### Direkter Verdict

Ja, die Seite ist mit dem jetzt behobenen Performance-Fix in einem guten,
auslieferungsfähigen Zustand. Zwei Punkte nicht auf die lange Bank schieben: den
Admin-Cookie (sauber lösbar) und realistische Erwartungen bei mobile.de (eigenes Projekt,
kein Nebenbei-Task).

## Runde 8 (Cowork, abgeschlossen, live verifiziert)

Auslöser: Vision bat um vollautomatische Umsetzung aller in Runde 7 offen gebliebenen
Punkte plus erneuten Blick auf mobile.de-Automatisierung. Sieben Commits, jeweils gegen
eine isolierte Kopie (`pnpm build` + `pnpm start`) gebaut und im Browser (Desktop +
Mobile, 375px) verifiziert, danach live auf Production gegengeprüft — nicht nur "sollte
funktionieren".

1. **Mobile-Hero-Overflow gefixt**: `Gebrauchtwagen,` lief bei ≤639px über den
   Viewport-Rand (Flex-Kind ohne `min-w-0`, `text-5xl` zu breit für das längste Wort).
   Fix: `min-w-0` am Content-Wrapper + `text-4xl` als Mobile-Basis in `components/hero.tsx`.
2. **Favicon/Icon-Set**: lag komplett ungenutzt in `public/` (kein `<link rel="icon">` im
   Head). Auf Next.js-File-Convention umgestellt (`app/icon.png`, `app/apple-icon.png`,
   aus dem vorhandenen Chrome-K-Logo zugeschnitten), altes `public/apple-icon.png`
   entfernt (Routen-Konflikt sonst).
3. **Custom 404**: `app/not-found.tsx` fehlte, zeigte die englische Next.js-Standardseite.
   Jetzt im Markendesign mit Links zu Fahrzeugbestand/Startseite.
4. **Security-Header + CSP**: Standard-Header (`X-Content-Type-Options`,
   `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) global über
   `next.config.mjs`. CSP zweigeteilt in `middleware.ts` — öffentliche Seiten:
   `script-src 'self' 'unsafe-inline'` (statisch, erhält Static Generation für
   Startseite/Impressum/Leistungen); Admin-Bereich: strikte Nonce-CSP
   (`'nonce-…' 'strict-dynamic'`, kein `unsafe-inline`), da dort ohnehin immer
   dynamisch gerendert wird. **Wichtige Falle, die dabei live diagnostiziert wurde**:
   Next.js' App Router liefert Hydration über 44+ Inline-`<script>`-Tags
   (`self.__next_f.push(...)`, RSC-Flight-Data) — eine CSP mit `script-src 'self'`
   ohne `unsafe-inline`/Nonce blockiert die komplett und die Seite bleibt unhydratisiert
   (Buttons tot, Hero-Fade-in hängt bei `opacity:0`), **ohne dass CSP-Verstöße in der
   Browser-Pane-Konsole auftauchen** — nur per Bau/Screenshot-Vergleich mit
   deaktivierter CSP eindeutig diagnostizierbar. Nonce-Propagation an Next.js' eigene
   Scripts läuft nicht automatisch übers Response-Header allein; es braucht zusätzlich
   einen `headers()`-Read in einer Server Component im jeweiligen Teilbaum
   (`app/admin/layout.tsx` liest die Nonce, dadurch aktiv nur dort).
5. **Admin-Session-Cookie signiert**: `lib/admin-session.ts`, HMAC-SHA256 über Web
   Crypto (läuft in Node- UND Edge-Runtime, kein `Buffer`/Node-`crypto`), Token-Format
   `<expiry>.<signature>`. Ersetzt das Klartext-Passwort-Cookie aus Runde 7 komplett.
6. **Login-Rate-Limit**: einfaches In-Memory-Sliding-Window (5 Versuche/15 Min pro IP)
   in `app/api/admin/login/route.ts` — bremst Brute-Force spürbar, kein verteilter
   Speicher nötig für dieses Traffic-Volumen.
7. **OG-Image gebrandet**: `app/opengraph-image.tsx` (next/og, dunkles Design mit
   Chrome-K-Logo, Bewertung) statt des rohen `dealership-real.jpg` — WhatsApp ist
   Hauptkanal bei diesem Kunden, Link-Vorschau zählt. **Falle**: Satori/`next/og`
   versucht bei Sonderzeichen wie „★" einen Font dynamisch nachzuladen; schlägt der
   Netzwerkzugriff fehl, bricht das Bild. Text bewusst ohne Symbolzeichen gehalten.
8. **BreadcrumbList-Schema** auf Fahrzeug-Detailseiten (`app/fahrzeuge/[slug]/page.tsx`).
9. **Finanzierungsrate auf Fahrzeugkarten**: „ab X €/mtl.*" auf `/fahrzeuge`, Rechenlogik
   aus `app/finanzierungsrechner/finanzierungsrechner-client.tsx` in `lib/financing.ts`
   extrahiert und geteilt (0 € Anzahlung, 36 Monate, 5,9 % eff. Jahreszins — identisch
   zu den Rechner-Defaults, damit Karte und Rechner beim Durchklicken nie widersprüchlich
   wirken). Disclaimer-Zeile über der Ergebnisliste.

**Nicht umgesetzt, echte Blocker statt Zeitmangel:**

- **mobile.de-Live-Sync**: braucht Händler-Schnittstellen-Zugang vom Kunden (API-Key/
  Zugangsdaten) — ohne den ist kein funktionierender Sync-Job baubar, nur totes
  Scaffolding. Nicht begonnen, um kein ungetestetes Gerüst als "fertig" auszugeben.
- **Fahrzeugfotos in Vercel Blob statt Live-Proxy zu mobile.de**: `BLOB_READ_WRITE_TOKEN`
  liegt nur in Vercels Env-Vars, lokal nicht verfügbar (kein `vercel`-CLI-Login in
  dieser Session). **Hinweis für die nächste Session**: Eine parallele Session hat
  während Runde 8 bereits `sharp` als Dependency ins Repo gebracht (`pnpm-lock.yaml`,
  `pnpm-workspace.yaml`, unter `.github/` liegt ebenfalls neuer, noch uncommitteter
  Inhalt) — das deutet stark darauf hin, dass genau diese Bild-Migration dort bereits
  in Arbeit ist. Vor eigenem Start unbedingt mit der anderen Session/Vision abgleichen,
  um keine Doppelarbeit zu bauen.

## Runde 9 (Cowork, abgeschlossen, live verifiziert)

Auslöser: Vision bat um kompletten Vollaudit ("was fällt dir auf, was würdest du als
Senior besser machen, sind wir 11/10") — echte Web-Recherche zu Konkurrenz/Rechtslage,
keine reine Code-Analyse. Danach alle Funde sofort umgesetzt. 9 Commits.

**Zwei kritische Funde aus der Recherche:**
1. **EU-OS-Streitschlichtungslink war ein aktives Abmahnrisiko**: Die Plattform wurde
   zum 20.07.2025 abgeschaltet (IHK-Quellen), die Verlinkungspflicht ist seither
   entfallen — wer den Link trotzdem zeigt, riskiert eine Abmahnung nach §§ 3, 5 UWG
   (suggeriert ein nicht mehr existierendes Verfahren). Aus dem Impressum entfernt.
2. **WCAG-Kontrastfehler auf praktisch allen Haupt-CTAs**: Rechnerisch per
   `getComputedStyle()` geprüft (nicht nur optisch). Zwei systemische Ursachen:
   - WhatsApp-Grün `#25D366` mit weißer Schrift: 1.98:1 (nötig 4.5:1). Auf `#178048`
     (Hover `#136339`) umgestellt, beides echte WhatsApp-Markenfarben — 4.98:1.
   - `bg-gold text-white` (die "gold"-Variable zeigt seit Runde 5 auf den Silber-Akzent
     `#c7c9cc`, nicht mehr auf echtes Gold): 1.66:1. Betraf 9 Stellen sitweit (Hero-CTA,
     Kontaktformular-Submit, "Karte laden", Ankauf-Schritt-Badges, Finanzierungsrechner-
     Laufzeit-Auswahl, Merkliste-Toggles, Leistungs-Icons). Fix: `text-primary-foreground`
     (`#0e0e0e`) statt `text-white` — dieses Token war im Design-System bereits als
     korrektes Pairing für `--primary`/`bg-gold` definiert (siehe `components/ui/button.tsx`),
     nur nirgends sonst benutzt worden. Jetzt 11.6:1.

**Weitere Funde/Fixes:**
- **"Unfallfrei" war nur Fließtext, kein Trust-Signal**: mobile.de zeigt es als Tag direkt
  auf der Karte, unsere Seite hatte es nur in 4 von 37 Beschreibungstexten versteckt (die
  einzigen 4 Fahrzeuge, bei denen mobile.de es auch tatsächlich auswies — nicht erfunden,
  nur strukturiert). Neues `Vehicle.accidentFree?: boolean`-Feld, Badge auf Karte +
  Detailseite, `additionalProperty`-PropertyValue im Car-JSON-LD.
- **Preis/CTA auf der Fahrzeug-Detailseite saß auf Mobile zu tief** (erst nach Galerie +
  Beschreibung + Datenkarten, kompletter Scroll nötig). Neue Sticky-Bottom-Bar
  (`lg:hidden`, Preis + Finanzierungsrate + WhatsApp-Button) ohne Scroll sichtbar.
  **Kollisionsfix nötig**: der globale schwebende WhatsApp-Button
  (`components/whatsapp-float.tsx`) hätte die neue Bar überlappt — per
  `body:has(.sticky-mobile-cta)`-CSS-Selektor (nur < lg-Breakpoint) ausgeblendet, sobald
  die Sticky-Bar im DOM ist. Reiner CSS-Fix, keine JS-Koordination zwischen den beiden
  unabhängigen Komponenten nötig.
- **Finanzierungsrate fehlte auf der Detailseite** (nur generischer "fragen Sie uns"-Text),
  obwohl die Karte längst "ab X €/mtl." zeigte. Jetzt konsistent auf beiden Seiten.
- **Kein Marken-Fokusring**: Tastatur-Fokus zeigte nur den nackten Browser-Default. Jetzt
  global `:focus-visible { outline: 2px solid #c7c9cc }` in `globals.css`.
- **Adresse im Impressum verifiziert**: Drittanbieter-Verzeichnisse (11880, ein alter
  Zeitungsartikel) nennen "Martin-Pauls-Straße" — das mobile.de-Händlerprofil selbst
  (vom Kunden gepflegt, maßgeblich) bestätigt "Am Sieltief 2" exakt wie im Impressum.
  Kein Handlungsbedarf, Drittanbieter-Einträge sind veraltet.

**Recherche-Ergebnis (kein Code-Fix, zur Kenntnis)**: Zertifizierte Gebrauchtwagen-
Programme (VW, BMW, MINI, Spoticar) bieten inzwischen standardmäßig 360°-Fotos/-Videos
und Online-Probefahrt-Buchung. Für einen inhabergeführten Einzelhändler als Vollausbau
unrealistisch (siehe Runde-7-Einschätzung zur Terminbuchung), aber ein kurzes
Rundgang-Video pro Fahrzeug wäre ein realistischer nächster Schritt, sobald der Kunde
das liefern kann.

## Frühere Runden (Kurzfassung)

- **Runde 6**: E-Mail-Anfrage-Option (Ankauf + Finanzierungsrechner) neben WhatsApp,
  3D-Tilt-Animation auf Fahrzeugkarten (mousemove-basiert, `prefers-reduced-motion`-sicher,
  nicht touch-fähig), Hero-Bild rechnerisch geschärft (Ursache der Runde-7-Regression).
- **Runde 5**: Navbar-Fix (Ankauf/Finanzierung sichtbar), Shine-Animation verstärkt,
  AutoDealer-Schema erweitert (GEO), KI-Crawler-Freigabe in robots.txt, DSGVO-Maximalpass
  (AVV-Hinweis, Merkliste-Absatz), tiefe Konkurrenzanalyse (lokale + Konzern-Wettbewerber).
- **Runde 4**: Gold-Shine-Animation, Count-up-Trust-Zahlen, FAQ-Sektion mit
  FAQPage-Schema, Merkliste (Herz-Button, `localStorage`).
- **Runde 3**: 8 echte mobile.de-Fotos pro Fahrzeug (alle 37 Inserate), Galerie mit
  Pfeilen + Thumbnails.
- **Runde 2**: `/ankauf`-Seite (Fahrzeugdaten-Formular → WhatsApp), Vercel Analytics
  aktiviert, Vehicle/Car-JSON-LD pro Detailseite, DSGVO-Lücken geschlossen.
- **Runde 1**: Scroll-Reveal-Komponente, Hero-Klarheit + Ken-Burns-Effekt, SEO-Fundament
  (robots/sitemap/`metadataBase`/llms.txt, JSON-LD-Domain-Fix).

## Offene Punkte (priorisiert für die nächste Session, Stand nach Runde 9)

1. **mobile.de-Live-Sync**: blockiert auf Händler-Schnittstellen-Zugang vom Kunden
   (API-Key/Zugangsdaten) — kann niemand ohne diese Daten bauen, siehe Runde 8.
2. **Fahrzeugfotos in Vercel Blob statt Live-Proxy** — vermutlich schon in Arbeit in
   einer parallelen Session (siehe Runde 8, `sharp`-Dependency-Fund), vor Start abgleichen.
3. **Eigene Domain** einrichten (Kundenentscheidung, außerhalb des Codes) — größte
   verbleibende SEO/GEO-Lücke.
4. Falls der Kunde ein höher aufgelöstes Original-Hero-Foto hat: damit ersetzen (besser
   als die rechnerisch geschärfte Version aus Runde 6).
5. Aus der Konkurrenzanalyse (Runde 5), noch offen: echte Kundenstimmen,
   Öffnungszeiten auf der Bestandsseite, Ankauf-Prozess-Visualisierung. Prüfsiegel-Idee
   ggf. auf Detailseiten sichtbarer verlinken/badge-artig darstellen (Basis existiert
   bereits über `/leistungen/gepruefte-qualitaet`).
6. Organization-Schema als weitere GEO/SEO-Ergänzung — kein `sameAs` ohne echte
   Social-Media-URLs vom Kunden.
7. "Wunschtermin"-Freitextfeld in bestehende Formulare, falls vom Kunden nach der
   Runde-7-Einschätzung weiterhin gewünscht — kein voller Buchungskalender.
8. `typescript.ignoreBuildErrors: true` als separate Aufräum-Session angehen, falls
   gewünscht (Umfang der bereits vorhandenen Typfehler ist unbekannt, da nie geprüft).
9. Ratgeber-/Content-Bereich für Local SEO, echte Kundenvideos — mittelfristig.
10. Kurzes Rundgang-Video pro Fahrzeug (Handy-Aufnahme reicht) als realistische
    Annäherung an die 360°-Ansichten der zertifizierten Gebrauchtwagen-Programme der
    Hersteller (Runde-9-Konkurrenzrecherche) — braucht Material vom Kunden.
11. Weitere `Vehicle.accidentFree`-Flags nachtragen, sobald der Kunde für weitere
    Fahrzeuge den Unfallfrei-Status bestätigt (aktuell nur 4 von 37, exakt die vom
    mobile.de-Inserat bereits ausgewiesenen — nicht großzügiger raten).
10. ESLint ist im Projekt referenziert (`npm run lint`), aber nicht als Dependency
    installiert — `pnpm run lint` schlägt mit "command not found" fehl. Vor der
    nächsten größeren Änderung nachrüsten, damit das Qualitäts-Gate wieder vollständig
    automatisiert prüfbar ist (aktuell nur `next build` als Signal).

## Wichtige Konventionen im Code

- Async Server Components haben keine Event-Handler — Client-Komponenten entsprechend
  mit `'use client'` markieren.
- WhatsApp-CTAs immer über `ctaWhatsapp` (zentrale wa.me-Link-Funktion).
- `siteConfig.url` = zentrale SEO-Domain, `siteConfig.contact.email` = zentrale E-Mail
  für `mailto:`-Links — beide zentral in `lib/site-config.ts` halten, nicht hardcoden.
- Fahrzeugdaten nie erfinden. Keine Prüfsiegel/Trust-Badges ohne echte Bestätigung vom
  Kunden.
- Jede neue Komponente, die Fotos über `/api/vehicle-image/...` rendert, braucht die
  `unoptimized`-Prop auf dem `<Image>`-Tag (siehe Performance-Abschnitt oben) — sonst
  bricht das Bild mit `400 INVALID_IMAGE_OPTIMIZE_REQUEST`.

## Hinweis für Claude Code

Die bisherige Arbeit an diesem Projekt lief aus einer Cloud-Sandbox ohne direkten
Netzzugang zu github.com/vercel.app — deshalb wurden alle Änderungen über den Browser
(GitHub-Web-Editor, direkte CodeMirror-Manipulation, Commit-Flow über die UI) statt über
lokales `git` gemacht. Mit direktem Repo-Zugriff entfällt das komplett:

- Repo ganz normal klonen/pullen (`git clone https://github.com/Visionarymotion/Autogalerie-Keles-FInal.git`),
  lokal mit `npm run dev` / `npm run build` arbeiten, normal committen und pushen.
- Deployment-Status weiterhin gut über die Vercel-CLI (`vercel ls`, `vercel inspect`) oder
  das Vercel-Dashboard prüfbar — die Projekt-/Team-IDs oben genügen dafür.
- Vor jeder Änderung an Bild-Komponenten im Fahrzeugbereich: kurz `next.config.mjs` und
  die Nutzung von `unoptimized` prüfen (siehe oben), das ist der einzige nicht ganz
  offensichtliche Fallstrick in der aktuellen Architektur.
- Diese Datei kann als Ausgangspunkt für ein projektspezifisches `CLAUDE.md` im Repo
  dienen — bei Bedarf kürzen/anpassen, sobald Claude Code direkten Zugriff hat und
  eigene Erkenntnisse ergänzt.
