import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

// Steuert, was Suchmaschinen- und KI-Crawler (Googlebot, GPTBot, ClaudeBot,
// PerplexityBot etc.) indexieren dürfen. /admin bleibt ausgeschlossen, da
// dort keine öffentlich relevanten Inhalte liegen, der Rest der Seite ist
// bewusst offen für Indexierung. Zusätzlich werden die wichtigsten KI-Crawler
// namentlich freigegeben (maximale KI-SEO-Sichtbarkeit für ChatGPT, Claude,
// Perplexity, Google AI Overviews, Apple Intelligence u.a.).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Meta-ExternalAgent', allow: '/' },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
