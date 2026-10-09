const PALETTE = [
  ['#7b61ff', '#4f8bff'],
  ['#ff7a59', '#ff4f81'],
  ['#2ec4b6', '#3a86ff'],
  ['#f6a623', '#f25f5c'],
  ['#8e54e9', '#4776e6'],
]

function hash(s: string) {
  let h = 0
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

interface Props {
  name: string
  seed: string
  size?: number
}

export function Avatar({ name, seed, size = 52 }: Props) {
  const [from, to] = PALETTE[hash(seed) % PALETTE.length]
  const letter = name.replace(/^\+/, '').trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.4, background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {letter}
    </div>
  )
}
