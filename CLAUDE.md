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

## Offene Punkte (priorisiert für die nächste Session)

1. **mobile.de-Live-Sync bauen**, sobald der Kunde Händler-Schnittstellen-Zugang liefert
   — als eigenständiges Projekt: Schema-Erweiterung + Sync-Job mit Fehlerbehandlung.
2. **Admin-Session-Cookie** auf signiertes Token statt Klartext-Passwort umstellen.
3. **Eigene Domain** einrichten (Kundenentscheidung, außerhalb des Codes) — größte
   verbleibende SEO/GEO-Lücke.
4. Falls der Kunde ein höher aufgelöstes Original-Hero-Foto hat: damit ersetzen (besser
   als die rechnerisch geschärfte Version aus Runde 6).
5. Aus der Konkurrenzanalyse (Runde 5) priorisiert umsetzen: echte Kundenstimmen,
   Öffnungszeiten auf der Bestandsseite, Ankauf-Prozess-Visualisierung,
   Finanzierungsrate direkt auf der Fahrzeugkarte. Prüfsiegel-Idee ggf. auf Detailseiten
   sichtbarer verlinken/badge-artig darstellen (Basis existiert bereits über
   `/leistungen/gepruefte-qualitaet`).
6. BreadcrumbList/Organization-Schema als weitere GEO/SEO-Ergänzung — kein `sameAs`
   ohne echte Social-Media-URLs vom Kunden.
7. "Wunschtermin"-Freitextfeld in bestehende Formulare, falls vom Kunden nach obiger
   Einschätzung weiterhin gewünscht — kein voller Buchungskalender.
8. `typescript.ignoreBuildErrors: true` als separate Aufräum-Session angehen, falls
   gewünscht (Umfang der bereits vorhandenen Typfehler ist unbekannt, da nie geprüft).
9. Ratgeber-/Content-Bereich für Local SEO, echte Kundenvideos — mittelfristig.

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
