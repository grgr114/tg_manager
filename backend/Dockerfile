# Backend Dockerfile
# Python + Telethon + qwen-code-sdk (требует Node.js для Qwen CLI)

FROM python:3.11-slim

# Устанавливаем Node.js 22 для qwen-code-sdk
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Qwen Code CLI
RUN npm install -g @qwen-code/qwen-code

# Рабочая директория
WORKDIR /app

# Копируем зависимости
COPY backend/requirements.txt .

# Устанавливаем Python-зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код
COPY backend/ .

# Копируем entrypoint скрипт
COPY backend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Создаём директорию для сессии Telethon
RUN mkdir -p /app/sessions

# Переменные окружения
ENV PYTHONUNBUFFERED=1
ENV TG_SESSION=/app/sessions/teleqwen

# Открываем порт
EXPOSE 8000

# Запуск через entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
