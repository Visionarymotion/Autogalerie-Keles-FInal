import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getVehicles } from '@/lib/vehicle-store'
import FahrzeugbestandClient from './fahrzeugbestand-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Fahrzeugbestand – Autogalerie Keles',
  description: 'Alle aktuellen Fahrzeuge von Autogalerie Keles in Nordenham. Geprüfte Gebrauchtwagen aller Marken zu fairen Preisen.',
}

export default async function FahrzeugbestandPage() {
  const vehicles = await getVehicles()

  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-32">
        <FahrzeugbestandClient vehicles={vehicles} />
      </div>
      <Footer />
    </main>
  )
}
