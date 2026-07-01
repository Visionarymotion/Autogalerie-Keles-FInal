import { getVehicleById } from '@/lib/vehicle-store'
import { notFound } from 'next/navigation'

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleById(Number(params.id))

  if (!vehicle) {
    notFound()
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">Bearbeiten: {vehicle.brand} {vehicle.model}</h1>
      {/* Hier würde dein Formular zur Bearbeitung folgen */}
      <div className="p-4 bg-gray-100 rounded">
        <p>Fahrzeug ID: {vehicle.id}</p>
        {/* Hier später das Edit-Formular einbauen */}
      </div>
    </main>
  )
}