import { useState } from 'react'
import { Avatar } from './Avatar'
import { Plus } from 'lucide-react'
import { NewChatModal } from './NewChatModal'
import type { Chat } from './types'

interface Props {
  chats: Chat[]
  activeId: string | null
  onSelect: (chatId: string) => void
  onCreate: (phone: string) => void
}

const shortDate = (ts: number) => {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '')
}

export function Sidebar({ chats, activeId, onSelect, onCreate }: Props) {
  const [creating, setCreating] = useState(false)
  const [query, setQuery] = useState('')

  const visible = chats.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <aside className="sidebar">
      <header className="sidebar__header">
        <h1>Чаты</h1>
        <button className="fab" title="Новый чат" aria-label="Новый чат" onClick={() => setCreating(true)}>
          <Plus strokeWidth={2.5} />
        </button>
      </header>

      <div className="search">
        <input placeholder="Найти" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <ul className="chat-list">
        {visible.length === 0 && (
          <li className="empty">{chats.length === 0 ? 'Нажмите «+», чтобы начать чат' : 'Ничего не найдено'}</li>
        )}
        {visible.map((chat) => {
          const last = chat.messages[chat.messages.length - 1]
          return (
            <li key={chat.chatId}>
              <button
                className={`chat-item ${chat.chatId === activeId ? 'chat-item--active' : ''}`}
                onClick={() => onSelect(chat.chatId)}
              >
                <Avatar name={chat.title} seed={chat.chatId} />
                <span className="chat-item__body">
                  <span className="chat-item__row">
                    <span className="chat-item__title">{chat.title}</span>
                    {last && <span className="chat-item__time">{shortDate(last.timestamp)}</span>}
                  </span>
                  <span className="chat-item__row">
                    <span className="chat-item__preview">{last?.text ?? 'Нет сообщений'}</span>
                    {chat.unread > 0 && <span className="badge">{chat.unread}</span>}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {creating && (
        <NewChatModal
          onClose={() => setCreating(false)}
          onSubmit={(phone) => {
            onCreate(phone)
            setCreating(false)
          }}
        />
      )}
    </aside>
  )
}
