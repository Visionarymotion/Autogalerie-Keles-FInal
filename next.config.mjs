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
}

export default nextConfig
