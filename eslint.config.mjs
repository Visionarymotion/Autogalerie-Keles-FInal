import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', '.claude/**', 'public/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // react-hooks/set-state-in-effect ist eine sehr neue, strikte Regel und
      // schlägt bei jedem client-only-Hydration-Pattern an (Live-Uhrzeit,
      // localStorage-Read nach dem Mount) – genau das korrekte, verbreitete
      // Vorgehen, um Server/Client-Hydration-Mismatches zu vermeiden, nicht
      // der Anti-Pattern, den die Regel eigentlich adressiert (abgeleiteter
      // State, der stattdessen während des Renders berechnet werden könnte).
      // Als Warnung statt Fehler, bis eslint-plugin-react-hooks das sauberer
      // von echten Anti-Patterns unterscheidet.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]

export default eslintConfig
