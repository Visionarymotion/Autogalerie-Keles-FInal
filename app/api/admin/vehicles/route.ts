import { NextResponse } from 'next/server'
import { getVehicles, saveVehicles } from '@/lib/vehicle-store'

// Löschen eines Fahrzeugs
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = Number(searchParams.get('id'))
  
  const vehicles = await getVehicles()
  const filtered = vehicles.filter((v) => v.id !== id)
  
  await saveVehicles(filtered)
  return NextResponse.json({ success: true })
}

// Bearbeiten eines Fahrzeugs
export async function PUT(request: Request) {
  const body = await request.json()
  const vehicles = await getVehicles()
  
  const index = vehicles.findIndex((v) => v.id === body.id)
  if (index === -1) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  vehicles[index] = { ...vehicles[index], ...body }
  await saveVehicles(vehicles)
  
  return NextResponse.json(vehicles[index])
}