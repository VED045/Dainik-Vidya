import { useId } from 'react'

// Decorative only: the existing theme switch remains the sole control.
export default function EveningLamp() {
  const id = useId()
  return <div className="evening-lamp" aria-hidden="true">
    <svg viewBox="0 0 72 210" fill="none" focusable="false">
      <defs>
        <linearGradient id={`${id}-brass`} x1="23" y1="115" x2="50" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#57402b" /><stop offset=".45" stopColor="#b9955b" /><stop offset="1" stopColor="#604329" />
        </linearGradient>
        <radialGradient id={`${id}-glass`}>
          <stop stopColor="#fff5bf" stopOpacity=".8" /><stop offset="1" stopColor="#f4c66c" stopOpacity=".12" />
        </radialGradient>
      </defs>
      <path className="lamp-cord" d="M36 0v115" stroke="#8a7353" strokeWidth="2" />
      <path d="M29 115h14v10H29zM25 125h22v17H25z" fill={`url(#${id}-brass)`} stroke="#b9955b" />
      <path d="M26 131h20m-20 5h20" stroke="#443324" />
      <path className="lamp-glass" d="M26 142c0 7-11 14-11 28 0 16 9 29 21 29s21-13 21-29c0-14-11-21-11-28H26Z" fill={`url(#${id}-glass)`} stroke="#c3a578" strokeWidth="1.4" />
      <path d="M23 167c-2 7-1 15 3 21" stroke="#fff3cb" strokeOpacity=".5" strokeLinecap="round" />
      <path d="m31 144 1 29m9-29-1 29" stroke="#b5955b" />
      <path className="lamp-filament" d="m30 173 3 5 3-5 3 5 3-5" stroke="#fff0af" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  </div>
}
