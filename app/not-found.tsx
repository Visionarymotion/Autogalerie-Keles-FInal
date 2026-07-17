import Link from 'next/link'
import { Search, Home, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'

export const metadata = {
  title: `Seite nicht gefunden – ${siteConfig.name}`,
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 text-center"
      style={{ backgroundColor: '#0e0e0e' }}
    >
      <div className="mb-10">
        <Logo variant="light" />
      </div>

      <p className="text-[11px] tracking-[0.35em] text-gold uppercase font-semibold mb-4">
        Fehler 404
      </p>
      <h1 className="font-[var(--font-heading)] text-4xl md:text-6xl leading-[1.1] tracking-tight text-white mb-5">
        Diese Seite ist nicht{' '}
        <span style={{ color: '#dcdddd' }}>vorgefahren.</span>
      </h1>
      <p className="text-[16px] text-white/60 leading-relaxed max-w-md mb-10">
        Die aufgerufene Seite existiert nicht mehr oder wurde verschoben.
        Vielleicht finden Sie, was Sie suchen, im Fahrzeugbestand.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/fahrzeuge"
          className="btn-shine group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gold text-white font-semibold text-[13px] tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-all duration-300"
        >
          <Search size={15} strokeWidth={2} />
          Zum Fahrzeugbestand
          <ArrowRight size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white/80 text-[13px] tracking-widest uppercase hover:border-white/60 hover:text-white transition-all duration-300 rounded-sm"
        >
          <Home size={15} strokeWidth={2} />
          Startseite
        </Link>
      </div>
    </main>
  )
}
