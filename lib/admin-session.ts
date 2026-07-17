/**
 * Signierte Admin-Session-Tokens statt Klartext-Passwort im Cookie.
 *
 * Läuft sowohl in der Login-API-Route (Node-Runtime) als auch in
 * middleware.ts (Edge-Runtime) – deshalb ausschließlich Web Crypto
 * (crypto.subtle) statt Node's `crypto`-Modul oder `Buffer`, die auf
 * der Edge-Runtime nicht verfügbar sind.
 *
 * Token-Format: "<expiry-ms>.<hmac-sha256-hex>". Der Ablaufzeitpunkt
 * ist bewusst nicht geheim – ohne ADMIN_PASSWORD kann niemand eine
 * gültige Signatur dafür erzeugen.
 */

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7 // 7 Tage

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

async function getHmacKey(): Promise<CryptoKey | null> {
  const secret = process.env.ADMIN_PASSWORD?.trim()
  if (!secret) return null
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

async function sign(expiry: number): Promise<string | null> {
  const key = await getHmacKey()
  if (!key) return null
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(expiry)))
  return bufToHex(sigBuf)
}

export async function createSessionToken(): Promise<string | null> {
  const expiry = Date.now() + SESSION_DURATION_MS
  const signature = await sign(expiry)
  if (!signature) return null
  return `${expiry}.${signature}`
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const [expiryRaw, signature] = token.split('.')
  const expiry = Number(expiryRaw)
  if (!expiryRaw || !signature || Number.isNaN(expiry)) return false
  if (Date.now() > expiry) return false

  const expected = await sign(expiry)
  if (!expected) return false
  return timingSafeEqual(expected, signature)
}
