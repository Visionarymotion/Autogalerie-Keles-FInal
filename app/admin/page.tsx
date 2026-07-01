import Link from 'next/link'
import { Plus } from 'lucide-react'
import { cookies } from 'next/headers'
import { getVehicles } from '@/lib/vehicle-store'
import { Logo } from '@/components/logo'
import AdminVehicleTable from './vehicle-table'
import LogoutButton from './logout-button'

// Nie prerendern - immer dynamisch laden
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // Auth-Check im Page selbst
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin_session')?.value
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (sessionCookie !== validPassword) {
    // Redirect zur Login-Seite wenn nicht authentifiziert
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentifizierung erforderlich</h1>
          <p className="text-muted-foreground mb-6">Bitte melden Sie sich zuerst an.</p>
          <a href="/admin/login" className="inline-block px-6 py-3 bg-[#c7c9cc] text-background font-semibold rounded">
            Zur Login-Seite
          </a>
        </div>
      </main>
    )
  }

  const vehicles = await getVehicles()

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-muted-foreground hidden sm:inline">Admin-Bereich</span>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 lg:px-10 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-[26px] font-[var(--font-heading)] font-semibold text-foreground">Fahrzeugbestand verwalten</h1>
            <p className="text-[13px] text-muted-foreground mt-1">{vehicles.length} Fahrzeuge im Bestand</p>
          </div>
          <Link
            href="/admin/fahrzeuge/neu"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#c7c9cc] text-background text-[13px] font-semibold rounded-lg hover:bg-white transition-all"
          >
            <Plus size={16} strokeWidth={2} />
            Neues Fahrzeug
          </Link>
        </div>

        <AdminVehicleTable initialVehicles={vehicles} />
      </div>
    </main>
  )
}
