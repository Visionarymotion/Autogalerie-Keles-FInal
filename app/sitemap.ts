import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import { getVehicles } from '@/lib/vehicle-store'
import { services } from '@/lib/services-data'

// Dynamische Sitemap: statische Seiten + alle Fahrzeug- und
// Leistungs-Unterseiten. Läuft bei jedem Build/Request neu, damit neue
// Fahrzeuge aus dem Bestand automatisch mit aufgenommen werden, ohne
// dass diese Datei manuell gepflegt werden muss.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/fahrzeuge`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/finanzierungsrechner`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/impressum`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/datenschutz`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${baseUrl}/leistungen/${s.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  let vehicleRoutes: MetadataRoute.Sitemap = []
  try {
    const vehicles = await getVehicles()
    vehicleRoutes = vehicles.map((v) => ({
      url: `${baseUrl}/fahrzeuge/${v.slug}`,
      changeFrequency: 'daily',
      priority: 0.7,
    }))
  } catch {
    // Bestand konnte nicht geladen werden (z. B. Blob-Store nicht
    // erreichbar) – Sitemap bleibt trotzdem gültig, nur ohne Fahrzeug-URLs.
    vehicleRoutes = []
  }

  return [...staticRoutes, ...serviceRoutes, ...vehicleRoutes]
}
