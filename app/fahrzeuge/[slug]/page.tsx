import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getVehicleBySlug } from '@/lib/vehicle-store'
import { formatPrice } from '@/lib/vehicles-data'
import VehicleDetailClient from './vehicle-detail-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const vehicle = await getVehicleBySlug(slug)
    if (!vehicle) return { title: 'Fahrzeug nicht gefunden – Autogalerie Keles' }
    return {
          title: `${vehicle.brand} ${vehicle.model} – ${formatPrice(vehicle.price)} | Autogalerie Keles`,
          description: vehicle.description,
    }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const vehicle = await getVehicleBySlug(slug)
    if (!vehicle) notFound()

  return (
        <main className="bg-background min-h-screen">
              <Navbar />
              <div className="pt-32">
                      <VehicleDetailClient vehicle={vehicle} />
              </div>div>
              <Footer />
        </main>main>
      )
}
</main>
