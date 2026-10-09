// Учётные данные инстанса GREEN-API
export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

// Поля ответа ReceiveNotification
export interface Notification {
  receiptId: number
  body: {
    typeWebhook: string
    timestamp: number
    idMessage: string
    senderData?: {
      chatId: string
      chatName?: string
      senderName?: string
      senderPhoneNumber?: number
    }
    messageData?: {
      typeMessage: string
      textMessageData?: { textMessage: string }
      extendedTextMessageData?: { text: string }
    }
  }
}
