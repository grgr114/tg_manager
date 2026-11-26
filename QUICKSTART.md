# 🚀 Быстрый старт — Подключение за 5 минут

## Шаг 1: Установить Qwen Code (1 мин)

```bash
npm install -g @qwen-code/qwen-code
qwen --version  # проверить установку
```

## Шаг 2: Авторизоваться в Qwen (1 мин)

```bash
qwen /auth
```

В меню выберите: **Qwen Account with Subscription**

Откроется браузер → войдите в https://qwen.ai (или создайте аккаунт)

✅ Готово! Qwen готов к работе.

---

## Шаг 3: Получить Telegram API (2 мин)

1. Откройте https://my.telegram.org
2. Войдите с номером телефона
3. Перейдите в **API development tools**
4. Заполните форму:
   - App title: `TeleQwen`
   - Short name: `teleqwen`
   - Platform: `Desktop`
5. Скопируйте **api_id** и **api_hash**

---

## Шаг 4: Настроить backend (30 сек)

```bash
# Создать .env файл
cp backend/.env.example backend/.env

# Открыть и заполнить
nano backend/.env
```

Вставьте ваши credentials:
```env
TG_API_ID=12345678
TG_API_HASH=abcdef0123456789abcdef0123456789
```

---

## Шаг 5: Установить зависимости (1 мин)

```bash
# Backend
pip install -r backend/requirements.txt

# Frontend
npm install
```

---

## Шаг 6: Запустить (30 сек)

**Терминал 1 — Backend:**
```bash
python backend/main.py
```

При первом запуске введите:
- Номер телефона (например: +79991234567)
- Код из Telegram (придёт в приложение)
- Пароль (если есть 2FA)

**Терминал 2 — Frontend:**
```bash
npm run dev
```

Откройте: **http://localhost:5173**

---

## ✅ Готово!

Теперь вы можете:
- Включить автоответчик в **Настройки**
- Настроить фильтры в **Фильтры**
- Просмотреть календарь событий
- Использовать AI-ассистент в чатах

---

## 🆘 Проблемы?

**"TG_API_ID not set"**
→ Проверьте что заполнили `backend/.env`

**"Qwen query failed"**
→ Выполните `qwen /auth` и выберите Qwen Account

**Frontend не подключается**
→ Убедитесь что backend запущен на `http://127.0.0.1:8000`

---

**Подробная документация:** [README.md](./README.md)
