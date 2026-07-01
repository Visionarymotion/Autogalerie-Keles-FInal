/**
 * DATENSCHICHT für den Fahrzeugbestand.
 * ---------------------------------------------------------
 * Speichert den Bestand als JSON-Datei in Vercel Blob Storage.
 *
 * SETUP (einmalig, im Vercel-Dashboard des Projekts):
 * 1. Storage-Tab → "Blob" → Store erstellen → mit Projekt verbinden
 *    (Vercel setzt dann automatisch die Umgebungsvariable
 *    BLOB_READ_WRITE_TOKEN — nichts weiter zu tun)
 * 2. Environment Variable ADMIN_PASSWORD setzen (euer Admin-Passwort)
 * 3. Neu deployen
 *
 * WICHTIG: Kein "storeId"-Parameter nötig/verwenden! Das Standard-
 * Setup mit einem einzigen Blob-Store braucht das nicht — ein
 * vorheriger Versuch hatte einen nicht existierenden
 * "BLOBMain_STORE_ID" referenziert, wodurch JEDES Speichern
 * (Hinzufügen/Bearbeiten/Löschen) fehlgeschlagen ist.
 *
 * Bis der Blob-Store das erste Mal beschrieben wurde, liefert
 * getVehicles() die echten Startdaten aus vehicles-data.ts (Fallback).
 */
import { put, list } from '@vercel/blob'
import { vehicles as seedVehicles, type Vehicle } from './vehicles-data'

const BLOB_PATH = 'data/vehicles-data.json'

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 })
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
  try {
    await put(BLOB_PATH, JSON.stringify(vehicles, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
  } catch (err) {
    console.error('[vehicle-store] saveVehicles fehlgeschlagen:', err)
    throw new Error(
      'Speichern im Blob-Store fehlgeschlagen. Prüft in Vercel unter Storage, ob ein Blob-Store existiert und mit diesem Projekt verbunden ist.'
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
