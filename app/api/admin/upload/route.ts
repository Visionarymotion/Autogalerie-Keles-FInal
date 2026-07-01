import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: Request) {
  const form = await request.formData()
  const file = form.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Keine Datei erhalten' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Nur Bilddateien erlaubt' }, { status: 400 })
  }
  // 8 MB Limit, um Missbrauch/versehentlich riesige Dateien zu vermeiden
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'Datei zu groß (max. 8 MB)' }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const blob = await put(`fahrzeuge/${Date.now()}-${safeName}`, file, {
    access: 'public',
  })

  return NextResponse.json({ url: blob.url })
}
