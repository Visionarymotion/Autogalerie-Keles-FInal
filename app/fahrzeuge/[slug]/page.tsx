import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getVehicleBySlug } from '@/lib/vehicle-store'
import { formatPrice } from '@/lib/vehicles-data'
import VehicleDetailClient from './vehicle-detail-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const vehicle = await getVehicleBySlug(params.slug)
  if (!vehicle) return { title: 'Fahrzeug nicht gefunden – Autogalerie Keles' }
  return {
    title: `${vehicle.brand} ${vehicle.model} – ${formatPrice(vehicle.price)} | Autogalerie Keles`,
    description: vehicle.description,
  }
}

export default async function VehicleDetailPage({ params }: { params: { slug: string } }) {
  const vehicle = await getVehicleBySlug(params.slug)
  if (!vehicle) notFound()

  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-32">
        <VehicleDetailClient vehicle={vehicle} />
      </div>
      <Footer />
    </main>
  )
}
