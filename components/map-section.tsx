import { siteConfig } from '@/lib/site-config'

export default function MapSection() {
  return (
    <div className="w-full h-72 md:h-[420px] bg-surface border-t border-border overflow-hidden">
      <iframe
        title={`${siteConfig.name} – ${siteConfig.address.full}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address.mapsQuery)}&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'grayscale(0.3) contrast(1.05)' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
