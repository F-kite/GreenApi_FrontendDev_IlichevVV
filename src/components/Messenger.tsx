import { useMessenger } from '../hooks/useMessenger'
import type { Credentials } from '../types'
import { ChatWindow } from './ChatWindow'
import { NavRail } from './NavRail'
import { Sidebar } from './Sidebar'

interface Props {
  credentials: Credentials
  onLogout: () => void
}

export function Messenger({ credentials, onLogout }: Props) {
  const { chats, activeId, error, selectChat, createChat, send } = useMessenger(credentials)
  const active = chats.find((c) => c.chatId === activeId) ?? null
  const unread = chats.reduce((sum, c) => sum + c.unread, 0)

  return (
    <div className={`app ${active ? 'app--chat-open' : ''}`}>
      <NavRail unread={unread} onLogout={onLogout} />
      <Sidebar chats={chats} activeId={activeId} onSelect={selectChat} onCreate={createChat} />
      <ChatWindow chat={active} onSend={send} onBack={() => selectChat(null)} />
      {error && <div className="toast">{error}</div>}
    </div>
  )
}
