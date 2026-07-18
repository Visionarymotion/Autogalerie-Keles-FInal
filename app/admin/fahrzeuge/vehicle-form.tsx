'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import type { Vehicle } from '@/lib/vehicles-data'

type FormData = Omit<Vehicle, 'id'>

const emptyForm: FormData = {
  slug: '',
  brand: '',
  model: '',
  detail: '',
  description: '',
  price: 0,
  priceNote: '',
  firstRegistration: '',
  km: 0,
  powerKw: 0,
  powerPs: 0,
  fuel: 'Diesel',
  transmission: 'Automatik',
  owners: 1,
  consumption: '',
  emissions: '',
  featured: false,
  photos: [],
}

export default function VehicleForm({ vehicleId, initialData }: { vehicleId?: number; initialData?: Vehicle }) {
  const [form, setForm] = useState<FormData>(initialData ?? emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const isEdit = vehicleId !== undefined

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload fehlgeschlagen')
        update('photos', [...form.photos, data.url])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Foto-Upload fehlgeschlagen')
    }
    setUploading(false)
    e.target.value = ''
  }

  function removePhoto(url: string) {
    update('photos', form.photos.filter((p) => p !== url))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      // Zentraler API-Endpunkt mit ?id= für Bearbeiten
      const url = isEdit ? `/api/admin/vehicles?id=${vehicleId}` : '/api/admin/vehicles'
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Speichern fehlgeschlagen')
      }
      
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen')
      setSaving(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 text-[13px] bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-[#c7c9cc] focus:ring-2 focus:ring-[#c7c9cc]/15 transition-all'
  const labelClass = 'block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <label className={labelClass}>Fotos</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.photos.map((photo) => (
            <div key={photo} className="relative w-24 h-20 rounded-lg overflow-hidden border border-border group">
              <Image src={photo} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(photo)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-dark/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Foto entfernen"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
          <label className="w-24 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#c7c9cc]/50 transition-colors text-muted-foreground">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} strokeWidth={1.5} />}
            <span className="text-[9px]">Hochladen</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Marke *</label>
          <input required value={form.brand} onChange={(e) => update('brand', e.target.value)} placeholder="z. B. BMW" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Modell *</label>
          <input required value={form.model} onChange={(e) => update('model', e.target.value)} placeholder="z. B. 320d Touring" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Ausstattungs-Kurzbeschreibung</label>
        <input value={form.detail} onChange={(e) => update('detail', e.target.value)} placeholder="z. B. LED · NAVI · SHZ" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Beschreibung</label>
        <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} className={inputClass + ' resize-none'} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Preis (€) *</label>
          <input required type="number" value={form.price || ''} onChange={(e) => update('price', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Erstzulassung *</label>
          <input required placeholder="MM/JJJJ" value={form.firstRegistration} onChange={(e) => update('firstRegistration', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Kilometerstand *</label>
          <input required type="number" value={form.km || ''} onChange={(e) => update('km', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fahrzeughalter</label>
          <input type="number" value={form.owners || ''} onChange={(e) => update('owners', Number(e.target.value))} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Leistung (kW) *</label>
          <input required type="number" value={form.powerKw || ''} onChange={(e) => update('powerKw', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Leistung (PS) *</label>
          <input required type="number" value={form.powerPs || ''} onChange={(e) => update('powerPs', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Kraftstoff *</label>
          <select value={form.fuel} onChange={(e) => update('fuel', e.target.value as Vehicle['fuel'])} className={inputClass}>
            <option>Benzin</option>
            <option>Diesel</option>
            <option>Hybrid</option>
            <option>Elektro</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Getriebe *</label>
          <select value={form.transmission} onChange={(e) => update('transmission', e.target.value as Vehicle['transmission'])} className={inputClass}>
            <option>Automatik</option>
            <option>Schaltgetriebe</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => update('featured', e.target.checked)}
          className="w-4 h-4 accent-[#c7c9cc]"
        />
        <label htmlFor="featured" className="text-[13px] text-foreground">Auf der Startseite als Highlight zeigen</label>
      </div>

      {error && <p className="text-[12.5px] text-red-400">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-3 bg-[#c7c9cc] text-background text-[13px] font-semibold rounded-lg hover:bg-white transition-all disabled:opacity-60"
        >
          {saving ? 'Speichern...' : isEdit ? 'Änderungen speichern' : 'Fahrzeug anlegen'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-6 py-3 border border-border text-foreground text-[13px] font-medium rounded-lg hover:border-[#c7c9cc]/50 transition-all"
        >
          Abbrechen
        </button>
      </div>
    </form>
  )
}