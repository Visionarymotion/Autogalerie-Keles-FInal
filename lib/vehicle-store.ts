/**
 * DATENSCHICHT für den Fahrzeugbestand.
 * ---------------------------------------------------------
 * Speichert den Bestand als JSON-Datei in Vercel Blob Storage.
 * Warum Blob statt "normaler" Datenbank? Für ~20-50 Fahrzeuge
 * ist das die einfachste Lösung ohne SQL-Setup — ein Admin
 * bearbeitet die Liste, sie wird als eine JSON-Datei gespeichert.
 *
 * SETUP (einmalig, im Vercel-Dashboard des Projekts):
 * 1. Storage-Tab → "Blob" → Store erstellen → mit Projekt verbinden
 *    (Vercel setzt dann automatisch die Umgebungsvariable
 *    BLOB_READ_WRITE_TOKEN — nichts weiter zu tun)
 * 2. Environment Variable ADMIN_PASSWORD setzen (euer Admin-Passwort)
 * 3. Neu deployen
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
    console.error('[vehicle-store] Fallback auf Startdaten:', err)
    return seedVehicles
  }
}

export async function saveVehicles(vehicles: Vehicle[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(vehicles, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
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
