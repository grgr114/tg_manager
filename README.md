# TeleQwen AI — Telegram Manager with Qwen Agent

AI-менеджер для Telegram: анализирует переписки, отвечает на сообщения через Qwen AI.

## Архитектура

```
┌─────────────────┐     WebSocket     ┌──────────────────────┐
│   Frontend      │◄─────────────────►│   Backend (FastAPI)   │
│   React + TS    │     REST API      │                      │
│   :5173         │◄─────────────────►│   :8000              │
└─────────────────┘                   │                      │
                                      │  ┌────────────────┐  │
                                      │  │  Telethon      │  │
                                      │  │  (MTProto)     │  │
                                      │  └───────┬────────┘  │
                                      │          │           │
                                      │  ┌───────▼────────┐  │
                                      │  │  qwen-code-sdk │  │
                                      │  │  (Qwen AI)     │  │
                                      │  └────────────────┘  │
                                      └──────────────────────┘
```

## Быстрый старт

### 1. Аутентификация Qwen

```bash
# Установи Qwen Code CLI (если ещё не установлен)
npm install -g @qwen-code/qwen-code

# Авторизуйся через Qwen OAuth
qwen /auth
# → Выбери "Qwen Account with Subscription"
```

### 2. Настройка Telegram API

```bash
# Получи API credentials
# https://my.telegram.org → API development tools

# Создай .env файл
cp backend/.env.example backend/.env
# Заполни TG_API_ID и TG_API_HASH
```

### 3. Запуск бэкенда

```bash
# Установи зависимости
pip install -r backend/requirements.txt

# Запусти
python backend/main.py
# Бэкенд на http://127.0.0.1:8000
# При первом запуске Telethon запросит номер телефона и код
```

### 4. Запуск фронтенда

```bash
npm install
npm run dev
# Фронтенд на http://localhost:5173
```

## Режим Busy

Когда включён режим **Busy**, бот:
1. Получает входящие сообщения
2. Берёт контекст последних 10 сообщений
3. Отправляет в Qwen: "ответь или SKIP"
4. Если Qwen не ответил SKIP — отправляет ответ в чат
5. Кулдаун 60 секунд на каждого собеседника

## API

| Endpoint | Method | Описание |
|----------|--------|----------|
| `/api/status` | GET | Статус подключения |
| `/api/busy` | POST | Вкл/выкл busy режим `{"enabled": true}` |
| `/api/free` | POST | Выключить busy режим |
| `/api/chats` | GET | Список чатов |
| `/api/chats/{id}/messages` | GET | Сообщения чата |
| `/api/events` | GET | Лог событий |
| `/ws` | WebSocket | Real-time события |

## Безопасность

- Секреты (TG_API_ID, TG_API_HASH) хранятся ТОЛЬКО в `backend/.env`
- Фронтенд не содержит никаких ключей
- Qwen работает в sandbox-папке без доступа к файлам
- `permission_mode: "plan"` — Qwen не выполняет инструменты
