/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Bildoptimierung aktiv: Next.js generiert responsive Varianten (WebP/AVIF,
  // passende Breiten) für alle Bilder unter eigener Domain, inkl. der
  // /api/vehicle-image-Proxy-Route (mobile.de-Fotos) und lokaler Assets wie
  // dem Hero-Bild. Spart Datenvolumen auf Mobilgeräten deutlich gegenüber
  // dem vorherigen unoptimized:true (dort wurde z. B. das volle 563KB-
  // Hero-Bild ungedrosselt auch an Smartphones ausgeliefert).
  //
  // Content-Security-Policy sitzt bewusst NICHT hier, sondern in
  // middleware.ts: sie braucht eine pro Request neu erzeugte Nonce für die
  // von Next.js injizierten <script>-Tags (RSC-Flight-Data), das geht nur
  // in der Middleware. Die restlichen Security-Header (statisch, kein
  // Nonce-Bedarf) bleiben hier zentral.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
