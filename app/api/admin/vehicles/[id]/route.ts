import { NextResponse } from 'next/server'
import { getVehicles, saveVehicles } from '@/lib/vehicle-store'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const vehicles = await getVehicles()
  const vehicle = vehicles.find((v) => v.id === id)
  if (!vehicle) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  return NextResponse.json(vehicle)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const updates = await request.json()
  const vehicles = await getVehicles()
  const index = vehicles.findIndex((v) => v.id === id)
  if (index === -1) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  vehicles[index] = {
    ...vehicles[index],
    ...updates,
    id,
    price: Number(updates.price),
    km: Number(updates.km),
    powerKw: Number(updates.powerKw),
    powerPs: Number(updates.powerPs),
    owners: Number(updates.owners) || 1,
    photos: Array.isArray(updates.photos) ? updates.photos : vehicles[index].photos,
  }
  await saveVehicles(vehicles)
  return NextResponse.json(vehicles[index])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const vehicles = await getVehicles()
  const updated = vehicles.filter((v) => v.id !== id)
  await saveVehicles(updated)
  return NextResponse.json({ success: true })
}
