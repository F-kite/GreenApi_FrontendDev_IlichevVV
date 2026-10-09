import { useEffect, useRef, useState } from 'react'
import { deleteNotification, phoneToChatId, receiveNotification, sendMessage } from '../api/greenApi'
import type { Chat, Message } from '../components/types'
import type { Credentials, Notification } from '../types'

const RETRY_DELAY = 5000

function addMessage(chats: Chat[], chatId: string, title: string, message: Message, unread: boolean): Chat[] {
  const chat = chats.find((c) => c.chatId === chatId)
  if (chat?.messages.some((m) => m.id === message.id)) return chats

  const updated: Chat = {
    chatId,
    title: chat?.title ?? title,
    messages: [...(chat?.messages ?? []), message],
    unread: (chat?.unread ?? 0) + (unread ? 1 : 0),
  }
  return [updated, ...chats.filter((c) => c.chatId !== chatId)]
}

export function useMessenger(credentials: Credentials) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeIdRef = useRef(activeId)
  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  useEffect(() => {
    const controller = new AbortController()

    const handleNotification = ({ body }: Notification) => {
      console.debug('GREEN-API notification:', body)

      const text =
        body.messageData?.textMessageData?.textMessage ?? body.messageData?.extendedTextMessageData?.text
      const sender = body.senderData

      if (body.typeWebhook !== 'incomingMessageReceived' || !text || !sender) return

      const phoneChatId = sender.senderPhoneNumber ? phoneToChatId(String(sender.senderPhoneNumber)) : null
      const message: Message = {
        id: body.idMessage,
        text,
        outgoing: false,
        timestamp: body.timestamp * 1000,
      }
      const title = sender.chatName || sender.senderName || String(sender.senderPhoneNumber ?? sender.chatId)

      setChats((prev) => {
        const known = prev.find((c) => c.chatId === sender.chatId || c.chatId === phoneChatId)
        const chatId = known?.chatId ?? sender.chatId
        return addMessage(prev, chatId, title, message, activeIdRef.current !== chatId)
      })
    }

    const poll = async () => {
      while (!controller.signal.aborted) {
        try {
          const notification = await receiveNotification(credentials, controller.signal)
          if (notification) {
            handleNotification(notification)
            await deleteNotification(credentials, notification.receiptId)
          }
          setError(null)
        } catch (e) {
          if (controller.signal.aborted) return
          const reason = e instanceof Error ? e.message : 'неизвестная ошибка'
          setError(`Не удалось получить сообщения (${reason})`)
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
        }
      }
    }
    poll()

    return () => controller.abort()
  }, [credentials])

  const selectChat = (chatId: string | null) => {
    setActiveId(chatId)
    setChats((prev) => prev.map((c) => (c.chatId === chatId ? { ...c, unread: 0 } : c)))
  }

  const createChat = (phone: string) => {
    const chatId = phoneToChatId(phone)
    setChats((prev) =>
      prev.some((c) => c.chatId === chatId)
        ? prev
        : [{ chatId, title: `+${phone}`, messages: [], unread: 0 }, ...prev],
    )
    selectChat(chatId)
  }

  const send = async (chatId: string, text: string) => {
    try {
      const { idMessage } = await sendMessage(credentials, chatId, text)
      const message: Message = { id: idMessage, text, outgoing: true, timestamp: Date.now() }
      setChats((prev) => addMessage(prev, chatId, chatId, message, false))
      setError(null)
    } catch {
      setError('Не удалось отправить сообщение')
    }
  }

  return { chats, activeId, error, selectChat, createChat, send }
}
