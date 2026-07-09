import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FinanzierungsrechnerClient from './finanzierungsrechner-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Finanzierungsrechner – Autogalerie Keles',
  description: 'Berechnen Sie unverbindlich Ihre monatliche Finanzierungsrate für Ihr Wunschfahrzeug bei Autogalerie Keles in Nordenham.',
}

export default function FinanzierungsrechnerPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-32">
        <FinanzierungsrechnerClient />
      </div>
      <Footer />
    </main>
  )
}
