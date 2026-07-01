import { Logo } from '@/components/logo'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import VehicleForm from '../vehicle-form'

// Nie prerendern
export const dynamic = 'force-dynamic'

export default function NewVehiclePage() {
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
        <h1 className="text-[26px] font-[var(--font-heading)] font-semibold text-foreground mb-8">Neues Fahrzeug anlegen</h1>
        <VehicleForm />
      </div>
    </main>
  )
}
