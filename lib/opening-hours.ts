import { siteConfig } from './site-config'

/**
 * Live-Öffnungsstatus für die Autogalerie Keles.
 * Wertet siteConfig.hours (Mo-So) gegen die aktuelle Uhrzeit aus und
 * liefert einen Status ("Jetzt geöffnet" / "Schließt bald" / "Geschlossen")
 * inkl. Detailtext (Restzeit bzw. nächste Öffnung).
 */

export type OpeningStatus = {
  isOpen: boolean
  closingSoon: boolean
  label: string
  detail?: string
}

function parseTimeRange(time: string): { start: number; end: number } | null {
  const match = time.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/)
  if (!match) return null
  const [, sh, sm, eh, em] = match
  return {
    start: Number(sh) * 60 + Number(sm),
    end: Number(eh) * 60 + Number(em),
  }
}

function dayIndexOf(date: Date) {
  const d = date.getDay()
  return d === 0 ? 6 : d - 1
}

function openingLabel(time: string) {
  const range = parseTimeRange(time)
  return range
    ? `${String(Math.floor(range.start / 60)).padStart(2, '0')}:${String(range.start % 60).padStart(2, '0')}`
    : time
}

export function getOpeningStatus(now: Date = new Date()): OpeningStatus {
  const hours = siteConfig.hours
  const todayIdx = dayIndexOf(now)
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const todayRange = parseTimeRange(hours[todayIdx].time)

  if (todayRange && minutesNow >= todayRange.start && minutesNow < todayRange.end) {
    const minutesLeft = todayRange.end - minutesNow
    if (minutesLeft <= 30) {
      return {
        isOpen: true,
        closingSoon: true,
        label: 'Schließt bald',
        detail: `noch ${minutesLeft} Min. geöffnet`,
      }
    }
    return { isOpen: true, closingSoon: false, label: 'Jetzt geöffnet' }
  }

  // Geschlossen - nächste Öffnung suchen (heute später, oder an einem der nächsten Tage)
  if (todayRange && minutesNow < todayRange.start) {
    return {
      isOpen: false,
      closingSoon: false,
      label: 'Geschlossen',
      detail: `öffnet heute um ${openingLabel(hours[todayIdx].time)} Uhr`,
    }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const idx = (todayIdx + offset) % 7
    const day = hours[idx]
    const range = parseTimeRange(day.time)
    if (!range) continue
    return {
      isOpen: false,
      closingSoon: false,
      label: 'Geschlossen',
      detail: `öffnet ${day.day} um ${openingLabel(day.time)} Uhr`,
    }
  }

  return { isOpen: false, closingSoon: false, label: 'Geschlossen' }
}
