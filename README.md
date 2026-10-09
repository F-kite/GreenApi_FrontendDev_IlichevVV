# MAX Chat на GREEN-API

Тестовое задание «Фронтенд разработчик React»: чат для отправки и получения текстовых сообщений через [GREEN-API MAX](https://green-api.com/max).

Стек: React 19, TypeScript, Vite.

## Подготовка инстанса GREEN-API

1. Создайте и авторизуйте инстанс MAX в [личном кабинете](https://console.green-api.com).
2. Включите получение уведомлений через HTTP API: в настройках инстанса `webhookUrl` должен быть пустым, `incomingWebhook` — `yes`. Это можно сделать методом [SetSettings](https://green-api.com/v3/docs/api/account/SetSettings/), подставив свои значения:
   ```bash
   curl -X POST "https://<префикс>.api.green-api.com/waInstance<idInstance>/setSettings/<apiTokenInstance>" \
     -H "Content-Type: application/json" \
     -d '{"webhookUrl": "", "incomingWebhook": "yes", "outgoingWebhook": "yes", "stateWebhook": "yes"}'
   ```
   Успешный ответ: `{"saveSettings": true}`. После вызова инстанс перезапускается, настройки применяются в течение 5 минут.
3. Хост API зависит от инстанса: `https://<первые 4 цифры idInstance>.api.green-api.com` (в кабинете это поле `apiUrl`). Приложение подставляет его само, а в команде выше замените `<префикс>` вручную.

## Локальный запуск

Нужен Node.js 20.19+ (или 22.12+).

```bash
npm install
npm run dev
```

Откройте http://localhost:5173.

## Запуск в Docker

```bash
docker build -t max-chat .
docker run --rm -p 8080:80 max-chat
```

Откройте http://localhost:8080.

## Как пользоваться

1. Введите `idInstance` (12 цифр) и `apiTokenInstance` (50 символов).
2. Нажмите «+», введите номер получателя (без `+7`, 10 цифр) и создайте чат.
3. Напишите сообщение и отправьте его.
4. Ответ получателя в MAX появится в чате автоматически.

## Структура

- `src/api/greenApi.ts` — запросы к GREEN-API: `sendMessage`, `receiveNotification`, `deleteNotification`
- `src/hooks/useMessenger.ts` — состояние чатов, отправка и цикл получения сообщений
- `src/components/` — UI: `LoginForm`, `Messenger`, `NavRail`, `Sidebar`, `ChatWindow`, `NewChatModal`
- `src/types.ts` — типы данных API

Чаты хранятся только в памяти, после перезагрузки страницы нужно войти заново.
