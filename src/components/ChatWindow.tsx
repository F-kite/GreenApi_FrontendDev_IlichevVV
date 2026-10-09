import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { Avatar } from './Avatar'
import { ArrowLeft, ArrowUp, Camera, CheckCheck, Mic, Paperclip, Smile } from 'lucide-react'
import type { Chat } from './types'

interface Props {
  chat: Chat | null
  onSend: (chatId: string, text: string) => void
  onBack: () => void
}

const time = (ts: number) =>
  new Date(ts).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })

const dayLabel = (ts: number) =>
  new Date(ts).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export function ChatWindow({ chat, onSend, onBack }: Props) {
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const count = chat?.messages.length ?? 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [count, chat?.chatId])

  if (!chat) {
    return (
      <section className="chat chat--empty">
        <span className="chat__placeholder">Выберите чат, чтобы начать общение</span>
      </section>
    )
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    onSend(chat.chatId, value)
    setText('')
  }

  return (
    <section className="chat">
      <header className="chat__header">
        <button className="icon-btn chat__back" onClick={onBack} aria-label="Назад">
          <ArrowLeft />
        </button>
        <Avatar name={chat.title} seed={chat.chatId} size={44} />
        <div className="chat__info">
          <span className="chat__title">{chat.title}</span>
          <span className="chat__status">В сети</span>
        </div>
      </header>

      <div className="chat__body">
        <div className="chat__messages">
          {chat.messages.map((m, i) => {
            const newDay =
              i === 0 || dayLabel(chat.messages[i - 1].timestamp) !== dayLabel(m.timestamp)
            return (
              <Fragment key={m.id}>
                {newDay && <div className="day">{dayLabel(m.timestamp)}</div>}
                <div className={`bubble ${m.outgoing ? 'bubble--out' : 'bubble--in'}`}>
                  <span className="bubble__text">{m.text}</span>
                  <span className="bubble__meta">
                    {time(m.timestamp)}
                    {m.outgoing && <CheckCheck size={16} />}
                  </span>
                </div>
              </Fragment>
            )
          })}
          <div ref={bottomRef} />
        </div>

        <form className="composer" onSubmit={submit}>
          <button type="button" className="composer__icon" aria-label="Прикрепить">
            <Paperclip />
          </button>
          <input
            placeholder="Сообщение"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={4000}
            autoFocus
          />
          <button type="button" className="composer__icon" aria-label="Стикеры">
            <Smile />
          </button>
          {text.trim() ? (
            <button className="send" aria-label="Отправить">
              <ArrowUp />
            </button>
          ) : (
            <>
              <button type="button" className="composer__icon" aria-label="Камера">
                <Camera />
              </button>
              <button type="button" className="composer__icon" aria-label="Голосовое">
                <Mic />
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
