/**
 * DATENSCHICHT für den Fahrzeugbestand.
 * ---------------------------------------------------------
 * Speichert den Bestand als JSON-Datei in Vercel Blob Storage.
 *
 * WICHTIG zu diesem Projekt: Der verbundene Blob-Store heißt
 * "BLOBMain" (Vercels neueres Multi-Store-System). Dadurch
 * bekommt ihr KEINE Standard-Variable "BLOB_READ_WRITE_TOKEN",
 * sondern store-spezifische Variablen mit Präfix, u. a.
 * "BLOBMain_STORE_ID". Der Code hier verweist deshalb bewusst
 * auf process.env.BLOBMain_STORE_ID (siehe Vercel → Storage →
 * euer Blob-Store → Quickstart-Codebeispiel, das exakt das zeigt).
 *
 * SETUP-CHECK in Vercel:
 * 1. Storage → Blob-Store "BLOBMain" → mit diesem Projekt verbunden?
 * 2. Settings → Environment Variables → ist BLOBMain_STORE_ID für
 *    "Production" gesetzt (nicht nur Preview)?
 * 3. Nach jeder Änderung: neu deployen.
 */
import { put, list } from '@vercel/blob'
import { vehicles as seedVehicles, type Vehicle } from './vehicles-data'

const BLOB_PATH = 'data/vehicles-data.json'
const STORE_ID = process.env.BLOBMain_STORE_ID

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1, storeId: STORE_ID })
    if (blobs.length === 0) return seedVehicles
    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!res.ok) return seedVehicles
    const data = await res.json()
    return Array.isArray(data) && data.length > 0 ? data : seedVehicles
  } catch (err) {
    console.error('[vehicle-store] getVehicles Fallback auf Startdaten:', err)
    return seedVehicles
  }
}

export async function saveVehicles(vehicles: Vehicle[]): Promise<void> {
  if (!STORE_ID) {
    throw new Error(
      'BLOBMain_STORE_ID ist nicht gesetzt. Bitte in Vercel unter Settings → Environment Variables prüfen, ob diese Variable für "Production" existiert.'
    )
  }
  try {
    await put(BLOB_PATH, JSON.stringify(vehicles, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      storeId: STORE_ID,
    })
  } catch (err) {
    console.error('[vehicle-store] saveVehicles fehlgeschlagen:', err)
    throw new Error(
      'Speichern im Blob-Store fehlgeschlagen. Prüft in Vercel, ob der Blob-Store "BLOBMain" mit diesem Projekt verbunden ist und BLOBMain_STORE_ID für Production gesetzt ist.'
    )
  }
}

export async function getVehicleById(id: number): Promise<Vehicle | undefined> {
  const vehicles = await getVehicles()
  return vehicles.find((v) => v.id === id)
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  const vehicles = await getVehicles()
  return vehicles.find((v) => v.slug === slug)
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const vehicles = await getVehicles()
  return vehicles.filter((v) => v.featured)
}
