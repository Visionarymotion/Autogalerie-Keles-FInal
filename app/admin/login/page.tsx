'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Logo } from '@/components/logo'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const pwd = password.trim()
    if (!pwd) {
      setError('Passwort erforderlich')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
        return
      }

      const data = await res.json()
      setError(data.error || 'Falsches Passwort')
      setLoading(false)
    } catch {
      setError('Verbindungsfehler. Versuche es später erneut.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} strokeWidth={1.8} className="text-[#c7c9cc]" />
            <h1 className="text-[15px] font-semibold text-foreground">Admin-Bereich</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Geben Sie das Admin-Passwort ein"
                className="w-full px-4 py-3 text-[13px] bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-[#c7c9cc] focus:ring-2 focus:ring-[#c7c9cc]/15 transition-all"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-[12px] text-red-400 bg-red-400/10 p-2 rounded">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-[#c7c9cc] text-background text-[13px] font-semibold tracking-wide rounded-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Wird überprüft...' : 'Anmelden'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
