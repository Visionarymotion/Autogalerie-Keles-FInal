import Link from 'next/link'
import Image from 'next/image'

/**
 * Echtes Logo von Autogalerie Keles (vom Kunden bereitgestellt,
 * freigestellt/transparent gemacht). Ersetzt den früheren
 * Platzhalter-Badge.
 * 
 * Doppelklick auf Logo → Admin-Bereich
 */
export function Logo({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const handleDoubleClick = () => {
    window.location.href = '/admin/login'
  }

  return (
    <Link 
      href="#home" 
      className="flex items-center group" 
      aria-label="Autogalerie Keles – Startseite"
      onDoubleClick={(e) => {
        e.preventDefault()
        handleDoubleClick()
      }}
    >
      <div className="relative h-12 md:h-14 w-[220px] md:w-[260px]">
        <Image
          src="/images/logo-real-transparent.png"
          alt="Autogalerie Keles"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
    </Link>
  )
}
