import type { Credentials, Notification } from '../types'

// Хост зависит от инстанса: префикс - первые 4 цифры idInstance (например, 3100.api.green-api.com)
const buildUrl = ({ idInstance, apiTokenInstance }: Credentials, method: string) =>
  `https://${idInstance.slice(0, 4)}.api.green-api.com/waInstance${idInstance}/${method}/${apiTokenInstance}`

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (res.status === 401) throw new Error('401: неверный idInstance или apiTokenInstance')
  if (!res.ok) throw new Error(`Ошибка GREEN-API: ${res.status}`)
  const text = await res.text()
  return (text ? JSON.parse(text) : null) as T
}

// Номер телефона -> chatId, "79991234567" -> "79991234567@c.us"
export const phoneToChatId = (phone: string) => `${phone.replace(/\D/g, '')}@c.us`

export function sendMessage(credentials: Credentials, chatId: string, message: string) {
  return request<{ idMessage: string }>(buildUrl(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })
}

export function receiveNotification(credentials: Credentials, signal: AbortSignal) {
  return request<Notification | null>(buildUrl(credentials, 'receiveNotification'), { signal })
}

export function deleteNotification(credentials: Credentials, receiptId: number) {
  return request<{ result: boolean }>(`${buildUrl(credentials, 'deleteNotification')}/${receiptId}`, {
    method: 'DELETE',
  })
}
