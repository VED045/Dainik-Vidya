/** Decorative ink engraving; never presented as an article photograph. */
export default function ManuscriptArt() {
  return <svg className="manuscript-art" viewBox="0 0 640 340" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <g opacity=".2">
      <circle cx="330" cy="152" r="113" /><circle cx="330" cy="152" r="119" />
      {Array.from({ length: 36 }, (_, i) => <path key={i} d="M330 25v-10" transform={`rotate(${i * 10} 330 152)`} />)}
      <path d="M100 275h450M118 282h407M149 289h350" />
    </g>
    <g strokeLinejoin="round">
      <path d="M228 112q46-16 101 7v132q-51-24-101-8zM329 119q53-26 104-12l-2 133q-51-9-102 11M223 111l-9 137q56-8 115 12 54-21 110-14l3-136M214 248l-1 10q57-6 116 12 56-18 112-12v-12M329 119v151" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M241 ${132+i*9}q34-6 72 7M344 ${139+i*9}q35-15 70-7`} />)}
      <path d="M167 116l37-12 8 143-39 11zM173 121l25-8 7 128-25 8zM173 135l27-8M178 234l25-8M183 139l8 80M453 98l40 12-8 143-39-13zM461 109l24 7-7 124-25-7zM457 132l26 7M451 222l29 9" />
      <path d="M181 267l151-10 112 17-134 22zM181 267v9l129 29 134-21v-10M193 278l117 24 124-20M201 285l111 24 119-18M487 271q-3-60 46-112-9 64-43 105M491 262l33-85M506 230l-3-24M510 220l18-7M496 250l-5-20M124 266q25-29 20-79 35 32 25 73M136 214l20 40" />
    </g>
    <g opacity=".35"><path d="M259 66q29 12 46-3M299 64l6-1-3 8M359 69q24-13 43 0M396 65l6 4-7 2M285 310q45 9 89-2" /></g>
  </svg>
}
