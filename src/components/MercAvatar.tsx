import type { Mercenary } from '../types'

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff
  return Math.abs(h)
}

const SKIN: Record<string, string> = {
  엘프: '#e2cab4', 인간: '#d4915a', 드워프: '#a86830', 수인: '#c07848',
}
const EYE_COL: Record<string, string> = {
  불: '#ff7043', 얼음: '#40c4ff', 번개: '#ffee58', 자연: '#66bb6a', 암흑: '#ce93d8', 빛: '#fffde7',
}
const GRADE_RING: Record<string, { stroke: string; width: number; glow: string }> = {
  S: { stroke: '#e879f9', width: 2.5, glow: 'rgba(232,121,249,0.55)' },
  A: { stroke: '#fbbf24', width: 2,   glow: 'rgba(251,191,36,0.45)' },
  B: { stroke: '#34d399', width: 1.5, glow: 'rgba(52,211,153,0.3)' },
  C: { stroke: '#38bdf8', width: 1.5, glow: 'rgba(56,189,248,0.2)' },
  D: { stroke: '#64748b', width: 1,   glow: 'transparent' },
}
const ELEM_BG: Record<string, [string, string]> = {
  불:   ['#4a1200', '#200800'],
  얼음: ['#082840', '#041018'],
  번개: ['#302400', '#181000'],
  자연: ['#082810', '#030c06'],
  암흑: ['#180828', '#0a0412'],
  빛:   ['#282010', '#101008'],
}
const HAIR_SETS: Record<string, string[]> = {
  엘프: ['#ddd0b8', '#c4b090', '#b8a878', '#a89870'],
  인간: ['#2a1408', '#5c2e14', '#9b4820', '#181008', '#c47830'],
  드워프: ['#4a2808', '#7a3e18', '#2e1808', '#c07030'],
  수인:  ['#785a38', '#584030', '#a87848', '#302820'],
}
const CLASS_BADGE: Record<string, string> = {
  전사: '⚔', 궁수: '🏹', 도적: '🗡', 마법사: '🪄', 성직자: '🕊',
}
const CLASS_BG: Record<string, string> = {
  전사: '#3d1a08', 궁수: '#1a2808', 도적: '#0a0a0a', 마법사: '#150830', 성직자: '#281800',
}

export function MercAvatar({ m, size = 56 }: { m: Mercenary; size?: number }) {
  const h = hash(m.id)
  const hairPalette = HAIR_SETS[m.race] ?? HAIR_SETS['인간']
  const hair = hairPalette[h % hairPalette.length]
  const skin = SKIN[m.race] ?? '#d4915a'
  const eye  = EYE_COL[m.element] ?? '#64b5f6'
  const ring = GRADE_RING[m.grade] ?? GRADE_RING['D']
  const bg   = ELEM_BG[m.element] ?? ['#1a1a2e', '#0d0d1a']

  const isElf   = m.race === '엘프'
  const isDwarf = m.race === '드워프'
  const isBeast = m.race === '수인'
  const isGhost = m.status === '영혼'

  const smileY = h % 2 === 0 ? 36.5 : 36
  const uid = m.id.replace(/[^a-zA-Z0-9]/g, '_')

  return (
    <svg viewBox="0 0 56 56" width={size} height={size}
      style={{ display: 'block', flexShrink: 0, opacity: isGhost ? 0.55 : 1, filter: isGhost ? 'grayscale(0.6) hue-rotate(180deg)' : 'none' }}>
      <defs>
        <radialGradient id={`bg${uid}`} cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor={bg[0]} />
          <stop offset="100%" stopColor={bg[1]} />
        </radialGradient>
        <clipPath id={`clip${uid}`}>
          <circle cx="28" cy="28" r="26" />
        </clipPath>
      </defs>

      {/* Outer glow for A/S */}
      {(m.grade === 'S' || m.grade === 'A') && (
        <circle cx="28" cy="28" r="27.5" fill="none" stroke={ring.glow} strokeWidth="5" opacity="0.7" />
      )}

      {/* Background */}
      <circle cx="28" cy="28" r="26" fill={`url(#bg${uid})`} />

      {/* Clipped content */}
      <g clipPath={`url(#clip${uid})`}>
        {/* Clothing / body at bottom */}
        <ellipse cx="28" cy="56" rx="20" ry="12" fill={CLASS_BG[m.class] ?? '#1a1a2e'} />
        <ellipse cx="28" cy="54" rx="14" ry="6" fill={CLASS_BG[m.class] ?? '#1a1a2e'} opacity="0.7" />

        {/* Beast ears */}
        {isBeast && <>
          <ellipse cx="16" cy="14" rx="5.5" ry="7.5" fill={hair} transform="rotate(-18 16 14)" />
          <ellipse cx="40" cy="14" rx="5.5" ry="7.5" fill={hair} transform="rotate(18 40 14)" />
          <ellipse cx="16" cy="14" rx="3"   ry="4.5" fill={skin} opacity="0.5" transform="rotate(-18 16 14)" />
          <ellipse cx="40" cy="14" rx="3"   ry="4.5" fill={skin} opacity="0.5" transform="rotate(18 40 14)" />
        </>}

        {/* Hair — back layer */}
        <ellipse cx="28" cy="23" rx="15" ry="16" fill={hair} />

        {/* Elf ears */}
        {isElf && <>
          <polygon points="13,28 8,19 16,25" fill={skin} />
          <polygon points="43,28 48,19 40,25" fill={skin} />
          <polygon points="13,28 9,20 15,24" fill={skin} opacity="0.6" />
          <polygon points="43,28 47,20 41,24" fill={skin} opacity="0.6" />
        </>}

        {/* Human/Dwarf ears */}
        {!isElf && !isBeast && <>
          <ellipse cx="14" cy="29" rx="3.5" ry="4" fill={skin} />
          <ellipse cx="42" cy="29" rx="3.5" ry="4" fill={skin} />
          <ellipse cx="13.5" cy="29" rx="1.8" ry="2.2" fill={skin} opacity="0.5" />
          <ellipse cx="42.5" cy="29" rx="1.8" ry="2.2" fill={skin} opacity="0.5" />
        </>}

        {/* Face */}
        <ellipse cx="28" cy="30" rx="13.5" ry="14.5" fill={skin} />

        {/* Jaw shadow */}
        <ellipse cx="28" cy="41" rx="10" ry="4" fill="rgba(0,0,0,0.12)" />

        {/* Hair fringe */}
        <path d={
          isElf
            ? 'M15,24 C17,13 28,12 28,12 C28,12 39,13 41,24 C38,18 28,17 28,17 C28,17 18,18 15,24Z'
            : isBeast
            ? 'M15,24 C17,15 28,14 28,14 C28,14 39,15 41,24 C38,19 28,18 28,18 C28,18 18,19 15,24Z'
            : isDwarf
            ? 'M17,25 C19,18 28,17 28,17 C28,17 37,18 39,25 C37,21 28,20 28,20 C28,20 19,21 17,25Z'
            : 'M15,24 C17,13 28,12 28,12 C28,12 39,13 41,24 C38,17 28,16 28,16 C28,16 18,17 15,24Z'
        } fill={hair} />

        {/* Dwarf beard */}
        {isDwarf && (
          <ellipse cx="28" cy="41" rx="10" ry="7" fill={hair} opacity="0.88" />
        )}

        {/* Eyebrows */}
        <path d="M20.5,25.5 Q23,23.5 25.5,25" stroke={hair} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d="M30.5,25 Q33,23.5 35.5,25.5" stroke={hair} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.9" />

        {/* Eye whites */}
        <ellipse cx="23" cy="28.5" rx="3.2" ry="2.6" fill="rgba(255,255,255,0.92)" />
        <ellipse cx="33" cy="28.5" rx="3.2" ry="2.6" fill="rgba(255,255,255,0.92)" />

        {/* Irises */}
        <circle cx="23" cy="28.5" r="1.9" fill={eye} />
        <circle cx="33" cy="28.5" r="1.9" fill={eye} />

        {/* Pupils */}
        <circle cx="23.2" cy="28.5" r="1" fill="#0a0a12" />
        <circle cx="33.2" cy="28.5" r="1" fill="#0a0a12" />

        {/* Specular */}
        <circle cx="24"   cy="27.7" r="0.55" fill="white" opacity="0.9" />
        <circle cx="34"   cy="27.7" r="0.55" fill="white" opacity="0.9" />

        {/* Nose */}
        <path d="M27,32.5 Q28,34.5 29,32.5" stroke={skin} strokeWidth="1" fill="none"
          strokeLinecap="round" style={{ filter: 'brightness(0.65)' }} opacity="0.8" />

        {/* Mouth */}
        <path d={`M24.5,${smileY} Q28,${smileY + 2} 31.5,${smileY}`}
          stroke="#a05050" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.85" />
      </g>

      {/* Grade border */}
      <circle cx="28" cy="28" r="26" fill="none" stroke={ring.stroke} strokeWidth={ring.width} />

      {/* Class badge — bottom-right */}
      <circle cx="44" cy="44" r="8.5" fill="rgba(0,0,0,0.75)" stroke={ring.stroke} strokeWidth="1" />
      <text x="44" y="47.5" textAnchor="middle" fontSize="9.5">{CLASS_BADGE[m.class]}</text>

      {/* S-grade sparkles */}
      {m.grade === 'S' && ([
        [7, 7, 0], [49, 9, 45], [8, 49, -20],
      ] as [number, number, number][]).map(([x, y, rot], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${rot})`} opacity="0.9">
          <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke={ring.stroke} strokeWidth="0.9" />
          <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke={ring.stroke} strokeWidth="0.9" />
          <line x1="-2.5" y1="-2.5" x2="2.5" y2="2.5" stroke={ring.stroke} strokeWidth="0.6" opacity="0.5" />
          <line x1="2.5" y1="-2.5" x2="-2.5" y2="2.5" stroke={ring.stroke} strokeWidth="0.6" opacity="0.5" />
        </g>
      ))}

      {/* Ghost overlay */}
      {isGhost && (
        <circle cx="28" cy="28" r="26" fill="rgba(140,100,255,0.15)" />
      )}
    </svg>
  )
}
