import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

// Steuert, was Suchmaschinen- und KI-Crawler (Googlebot, GPTBot, ClaudeBot,
// PerplexityBot etc.) indexieren dürfen. /admin bleibt ausgeschlossen, da
// dort keine öffentlich relevanten Inhalte liegen, der Rest der Seite ist
// bewusst offen für Indexierung.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
