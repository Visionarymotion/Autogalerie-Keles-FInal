import { NextResponse } from 'next/server'
import { getVehicles, saveVehicles } from '@/lib/vehicle-store'
import type { Vehicle } from '@/lib/vehicles-data'

// Deine bestehende GET Funktion
export async function GET() { ... }

// Deine bestehende POST Funktion
export async function POST(request: Request) { ... }

// NEU: Die DELETE Funktion hier unten anfügen
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = Number(searchParams.get('id'))
  
  const vehicles = await getVehicles()
  const filtered = vehicles.filter((v) => v.id !== id)
  
  await saveVehicles(filtered)
  return NextResponse.json({ success: true })
}