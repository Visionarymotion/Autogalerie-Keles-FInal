'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
    >
      <LogOut size={14} strokeWidth={1.8} />
      Abmelden
    </button>
  )
}
