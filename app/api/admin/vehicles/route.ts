import { NextResponse } from 'next/server'
import { getVehicles, saveVehicles } from '@/lib/vehicle-store'

export async function GET() {
  const vehicles = await getVehicles()
  return NextResponse.json(vehicles)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const vehicles = await getVehicles()
    const nextId = vehicles.length > 0 ? Math.max(...vehicles.map((v) => v.id)) + 1 : 1
    const newVehicle = { ...body, id: nextId }
    await saveVehicles([...vehicles, newVehicle])
    return NextResponse.json(newVehicle, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'POST fehlgeschlagen' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = Number(searchParams.get('id'))
  const vehicles = await getVehicles()
  await saveVehicles(vehicles.filter((v) => v.id !== id))
  return NextResponse.json({ success: true })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const vehicles = await getVehicles()
  const index = vehicles.findIndex((v) => v.id === body.id)
  if (index === -1) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  vehicles[index] = { ...vehicles[index], ...body }
  await saveVehicles(vehicles)
  return NextResponse.json(vehicles[index])
}