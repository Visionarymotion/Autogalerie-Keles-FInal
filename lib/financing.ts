/**
 * Geteilte Rechenlogik für Finanzierungsraten – von der Fahrzeugkarte
 * ("ab X €/mtl.") und app/finanzierungsrechner/finanzierungsrechner-client.tsx
 * genutzt, damit beide Stellen bei gleichen Eingaben exakt dieselbe Rate
 * zeigen (Standard-Annuitätenformel).
 */
export function calculateMonthlyPayment(loanAmount: number, annualRatePercent: number, termMonths: number): number {
  if (loanAmount <= 0 || termMonths <= 0) return 0
  const monthlyRate = annualRatePercent / 100 / 12
  if (monthlyRate === 0) return loanAmount / termMonths
  return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))
}

// Konservative Standardannahmen für die "ab X €/mtl."-Anzeige auf den
// Fahrzeugkarten: 0 € Anzahlung, gleiche Laufzeit/Zinssatz wie der
// Default des vollen Finanzierungsrechners – damit die Karte nie eine
// günstigere Zahl zeigt, als der Rechner beim Durchklicken bestätigt.
export const CARD_ESTIMATE_TERM_MONTHS = 36
export const CARD_ESTIMATE_ANNUAL_RATE = 5.9

export function estimateCardMonthlyPayment(price: number): number {
  return calculateMonthlyPayment(price, CARD_ESTIMATE_ANNUAL_RATE, CARD_ESTIMATE_TERM_MONTHS)
}
