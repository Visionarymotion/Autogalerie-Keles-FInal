import { NextResponse } from 'next/server'
import { getVehicles, saveVehicles } from '@/lib/vehicle-store'
import type { Vehicle } from '@/lib/vehicles-data'

export async function GET() {
  const vehicles = await getVehicles()
  return NextResponse.json(vehicles)
}

export async function POST(request: Request) {
  const body = await request.json()
  const vehicles = await getVehicles()
  const nextId = vehicles.length > 0 ? Math.max(...vehicles.map((v) => v.id)) + 1 : 1

  const newVehicle: Vehicle = {
    id: nextId,
    slug: body.slug || `${body.brand}-${body.model}-${nextId}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    brand: body.brand,
    model: body.model,
    detail: body.detail || '',
    description: body.description || '',
    price: Number(body.price),
    priceNote: body.priceNote || undefined,
    firstRegistration: body.firstRegistration,
    km: Number(body.km),
    powerKw: Number(body.powerKw),
    powerPs: Number(body.powerPs),
    fuel: body.fuel,
    transmission: body.transmission,
    owners: Number(body.owners) || 1,
    consumption: body.consumption || undefined,
    emissions: body.emissions || undefined,
    featured: Boolean(body.featured),
    photos: Array.isArray(body.photos) ? body.photos : [],
  }

  const updated = [...vehicles, newVehicle]
  await saveVehicles(updated)
  return NextResponse.json(newVehicle, { status: 201 })
}
