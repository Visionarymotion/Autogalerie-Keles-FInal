'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}

/**
 * Dezente Scroll-Reveal-Animation: blendet Inhalte sanft ein (Opacity + leichter
 * Y-Versatz), sobald sie ins Viewport scrollen. Läuft nur einmal pro Element
 * (IntersectionObserver trennt sich nach dem ersten Trigger), damit beim
 * Hoch-/Runterscrollen kein Flackern entsteht. Respektiert reduzierte Bewegung
 * nicht separat, da Opacity/Transform-Übergänge dieser Dauer unkritisch sind.
 */
export function Reveal({ children, delay = 0, className = '', y = 20 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
