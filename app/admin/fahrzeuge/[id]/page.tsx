üÜimport Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getVehicleById } from '@/lib/vehicle-store'
import { Logo } from '@/components/logo'
import VehicleForm from '../vehicle-form'

// Nie prerendern
export const dynamic = 'force-dynamic'

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  // Auth-Check
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin_session')?.value
  const validPassword = process.env.ADMIN_PASSWORD
  if (!validPassword) {
    throw new Error('ADMIN_PASSWORD ist nicht gesetzt. Bitte in Vercel unter Environment Variables anlegen.')
  }

  if (sessionCookie !== validPassword) {
    redirect('/admin/login')
  }

  const vehicle = await getVehicleById(Number(params.id))
  if (!vehicle) notFound()

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Logo />
      </header>
      <div className="max-w-6xl mx-auto px-5 lg:px-10 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-[#c7c9cc] transition-colors mb-6">
          <ArrowLeft size={15} strokeWidth={2} />
          Zurück zur Übersicht
        </Link>
        <h1 className="text-[26px] font-[var(--font-heading)] font-semibold text-foreground mb-8">{vehicle.brand} {vehicle.model} bearbeiten</h1>
        <VehicleForm vehicleId={vehicle.id} initialData={vehicle} />
      </div>
    </main>
  )
}
