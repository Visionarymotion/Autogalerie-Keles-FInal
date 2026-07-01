'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, ImageOff, Star } from 'lucide-react'
import { formatPrice, formatKm, type Vehicle } from '@/lib/vehicles-data'

export default function AdminVehicleTable({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

  async function handleDelete(id: number, label: string) {
    if (!confirm(`"${label}" wirklich unwiderruflich löschen?`)) return
    setDeletingId(id)
    const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setVehicles((prev) => prev.filter((v) => v.id !== id))
      router.refresh()
    } else {
      alert('Löschen fehlgeschlagen. Bitte erneut versuchen.')
    }
    setDeletingId(null)
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-20 bg-card border border-border rounded-xl text-muted-foreground text-[13.5px]">
        Noch keine Fahrzeuge im Bestand. Klicke oben auf &bdquo;Neues Fahrzeug&ldquo;.
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border text-[10.5px] uppercase tracking-widest text-muted-foreground">
            <th className="px-5 py-3.5 font-semibold">Fahrzeug</th>
            <th className="px-5 py-3.5 font-semibold hidden sm:table-cell">Preis</th>
            <th className="px-5 py-3.5 font-semibold hidden md:table-cell">km</th>
            <th className="px-5 py-3.5 font-semibold hidden md:table-cell">Fotos</th>
            <th className="px-5 py-3.5 font-semibold hidden lg:table-cell">Highlight</th>
            <th className="px-5 py-3.5 font-semibold text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-10 rounded overflow-hidden bg-surface flex-shrink-0">
                    {v.photos[0] ? (
                      <Image src={v.photos[0]} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff size={14} className="text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{v.brand} {v.model}</p>
                    <p className="text-[11px] text-muted-foreground">{v.firstRegistration}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] text-foreground hidden sm:table-cell">{formatPrice(v.price)}</td>
              <td className="px-5 py-3.5 text-[13px] text-muted-foreground hidden md:table-cell">{formatKm(v.km)}</td>
              <td className="px-5 py-3.5 text-[13px] text-muted-foreground hidden md:table-cell">{v.photos.length}</td>
              <td className="px-5 py-3.5 hidden lg:table-cell">
                {v.featured && <Star size={14} fill="#c7c9cc" className="text-[#c7c9cc]" />}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/fahrzeuge/${v.id}`} className="text-muted-foreground hover:text-[#c7c9cc] transition-colors" aria-label="Bearbeiten">
                    <Pencil size={15} strokeWidth={1.8} />
                  </Link>
                  <button
                    onClick={() => handleDelete(v.id, `${v.brand} ${v.model}`)}
                    disabled={deletingId === v.id}
                    className="text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-40"
                    aria-label="Löschen"
                  >
                    <Trash2 size={15} strokeWidth={1.8} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
