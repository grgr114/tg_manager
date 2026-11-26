#!/bin/bash
set -e

echo "🚀 TeleQwen AI Backend Starting..."

# Проверяем наличие credentials
if [ -z "$TG_API_ID" ] || [ -z "$TG_API_HASH" ]; then
    echo "❌ Ошибка: TG_API_ID и TG_API_HASH не установлены!"
    echo "📝 Создайте .env файл из .env.docker.example и заполните credentials"
    echo "🔗 Получите API keys на https://my.telegram.org"
    exit 1
fi

echo "✅ Telegram credentials найдены"

# Проверяем Qwen CLI
if ! command -v qwen &> /dev/null; then
    echo "❌ Ошибка: Qwen Code CLI не установлен!"
    exit 1
fi

echo "✅ Qwen Code CLI найден: $(qwen --version)"

# Проверяем сессию Telethon
if [ ! -f "$TG_SESSION.session" ]; then
    echo "⚠️  Сессия Telethon не найдена"
    echo "📱 При первом запуске потребуется авторизация Telegram"
    echo "💡 Сессия будет сохранена в volume 'telethon_sessions'"
fi

echo "🎯 Запуск FastAPI сервера..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
