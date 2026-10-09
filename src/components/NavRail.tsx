import type { ReactNode } from 'react'
import { MessageCircle, Settings } from 'lucide-react'

interface Item {
  label: string
  icon: ReactNode
  active?: boolean
  badge?: number
}

const top: Item[] = [
  { label: 'Все', icon: <MessageCircle />, active: true },
]

function NavButton({ item }: { item: Item }) {
  return (
    <button className={`nav__item ${item.active ? 'nav__item--active' : ''}`} type="button">
      <span className="nav__icon">
        {item.icon}
        {!!item.badge && <span className="nav__badge">{item.badge}</span>}
      </span>
      <span className="nav__label">{item.label}</span>
    </button>
  )
}

interface Props {
  unread: number
  onLogout: () => void
}

export function NavRail({ unread, onLogout }: Props) {
  return (
    <nav className="nav">
      <div className="nav__group">
        {top.map((item, i) => (
          <NavButton key={item.label} item={i === 0 ? { ...item, badge: unread } : item} />
        ))}
      </div>
      <div className="nav__divider" />
      <div className="nav__spacer" />
      <button className="nav__item" type="button" onClick={onLogout} title="Выйти">
        <span className="nav__icon">
          <Settings />
        </span>
        <span className="nav__label">Настройки</span>
      </button>
    </nav>
  )
}
