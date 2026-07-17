import { headers } from 'next/headers'

/**
 * Der Admin-Bereich läuft unter einer strengeren Nonce-CSP als der Rest
 * der Seite (siehe middleware.ts) – Formulare, Session-Cookie, Foto-
 * Upload rechtfertigen den strengeren script-src ohne 'unsafe-inline'.
 * Das Auslesen der Nonce über headers() hier ist der Trigger, der
 * Next.js veranlasst, dieselbe Nonce automatisch an alle selbst
 * injizierten <script>-Tags (RSC-Flight-Data, Chunk-Loader) dieses
 * Teilbaums zu hängen, damit sie die CSP passieren. Admin-Routen sind
 * durch den Session-Check ohnehin immer dynamisch gerendert – hier
 * entsteht dadurch kein zusätzlicher Verlust an Static Generation.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await headers()
  return children
}
