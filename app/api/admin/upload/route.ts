import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const STORE_ID = process.env.BLOBMain_STORE_ID

export async function POST(request: Request) {
  if (!STORE_ID) {
    return NextResponse.json(
      { error: 'BLOBMain_STORE_ID ist nicht gesetzt. Bitte in Vercel unter Environment Variables prüfen.' },
      { status: 500 }
    )
  }

  const form = await request.formData()
  const file = form.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Keine Datei erhalten' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Nur Bilddateien erlaubt' }, { status: 400 })
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'Datei zu groß (max. 8 MB)' }, { status: 400 })
  }

  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const blob = await put(`fahrzeuge/${Date.now()}-${safeName}`, file, {
      access: 'public',
      storeId: STORE_ID,
    })
    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error('[upload] fehlgeschlagen:', err)
    return NextResponse.json(
      { error: 'Upload fehlgeschlagen. Ist der Blob-Store "BLOBMain" korrekt verbunden?' },
      { status: 500 }
    )
  }
}
