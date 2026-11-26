# 🐳 Docker Deployment Guide

Полное руководство по развёртыванию TeleQwen AI в Docker.

## 📋 Требования

- Docker 20.10+
- Docker Compose 2.0+
- Telegram API credentials
- Qwen Account с подпиской

## 🚀 Быстрый старт

### 1. Клонируйте проект

```bash
git clone <your-repo>
cd teleqwen-ai
```

### 2. Настройте переменные окружения

```bash
# Скопируйте шаблон
cp .env.docker.example .env

# Откройте и заполните
nano .env
```

Заполните:
```env
TG_API_ID=12345678
TG_API_HASH=abcdef0123456789abcdef0123456789
```

**Где получить:**
- Перейдите на https://my.telegram.org
- Войдите с номером телефона
- API development tools → создайте приложение
- Скопируйте `api_id` и `api_hash`

### 3. Авторизуйтесь в Qwen

**Важно:** Qwen CLI должен быть авторизован на хост-машине перед сборкой Docker.

```bash
# Установите Qwen CLI (если ещё не установлен)
npm install -g @qwen-code/qwen-code

# Авторизуйтесь
qwen /auth
```

Выберите: **Qwen Account with Subscription**
→ Откроется браузер → войдите на https://qwen.ai

### 4. Соберите и запустите

```bash
# Сборка образов
docker-compose build

# Запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f
```

### 5. Откройте приложение

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🔐 Первая авторизация Telegram

При первом запуске Telethon запросит авторизацию:

```bash
# Посмотрите логи backend
docker-compose logs -f backend
```

Вы увидите запрос:
```
Please enter your phone (or bot token):
```

Введите номер телефона в формате `+79991234567`

Затем:
```
Please enter the code you received:
```

Введите код из Telegram приложения.

Если включена 2FA:
```
Please enter your password:
```

Введите пароль.

✅ Сессия сохранится в Docker volume `telethon_sessions` и будет доступна после перезапуска.

## 📊 Управление контейнерами

### Просмотр статуса

```bash
docker-compose ps
```

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f backend

# Только frontend
docker-compose logs -f frontend
```

### Перезапуск

```bash
# Перезапустить все
docker-compose restart

# Перезапустить только backend
docker-compose restart backend
```

### Остановка

```bash
# Остановить
docker-compose down

# Остановить и удалить volumes (⚠️ удалит сессию Telegram!)
docker-compose down -v
```

### Обновление

```bash
# Остановить
docker-compose down

# Пересобрать
docker-compose build --no-cache

# Запустить
docker-compose up -d
```

## 🗂️ Volumes

### telethon_sessions

Сохраняет сессию Telegram между перезапусками.

**Расположение:** `/app/sessions` в контейнере

**Важно:** Не удаляйте этот volume, иначе потребуется повторная авторизация.

**Резервное копирование:**
```bash
# Найти volume
docker volume ls | grep telethon_sessions

# Создать backup
docker run --rm -v teleqwen-ai_telethon_sessions:/data -v $(pwd):/backup alpine tar czf /backup/telethon-backup.tar.gz /data
```

**Восстановление:**
```bash
docker run --rm -v teleqwen-ai_telethon_sessions:/data -v $(pwd):/backup alpine tar xzf /backup/telethon-backup.tar.gz -C /
```

## 🔧 Конфигурация

### Изменение портов

Отредактируйте `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Измените 80 на 8080
  
  backend:
    ports:
      - "8001:8000"  # Измените 8000 на 8001
```

### Production режим

Для продакшена добавьте в `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - ENVIRONMENT=production
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

### HTTPS (опционально)

Добавьте reverse proxy (nginx/caddy) перед frontend:

```yaml
services:
  caddy:
    image: caddy:2
    ports:
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
```

## 🐛 Troubleshooting

### Backend не запускается

**Ошибка:** `TG_API_ID and TG_API_HASH not set`
```bash
# Проверьте .env файл
cat .env

# Пересоздайте контейнер
docker-compose down
docker-compose up -d
```

**Ошибка:** `Qwen Code CLI not found`
```bash
# Пересоберите образ
docker-compose build --no-cache backend
```

### Frontend не подключается к backend

**Ошибка:** CORS или connection refused
```bash
# Проверьте что backend запущен
docker-compose ps

# Проверьте логи backend
docker-compose logs backend

# Убедитесь что nginx.conf правильно настроен
cat nginx.conf
```

### Telegram сессия не сохраняется

**Проблема:** При перезапуске требуется повторная авторизация

**Решение:**
```bash
# Проверьте volume
docker volume ls | grep telethon_sessions

# Если volume отсутствует, создайте явно
docker volume create teleqwen-ai_telethon_sessions

# Перезапустите
docker-compose restart backend
```

### Qwen не отвечает

**Проблема:** AI запросы не работают

**Решение:**
```bash
# Проверьте авторизацию Qwen на хосте
qwen /auth

# Убедитесь что подписка активна
# Пересоберите backend
docker-compose build backend
docker-compose up -d backend
```

### Порты заняты

**Ошибка:** `Bind for 0.0.0.0:80 failed: port is already allocated`

**Решение:**
```bash
# Найдите процесс
sudo lsof -i :80

# Или измените порт в docker-compose.yml
# ports:
#   - "8080:80"
```

## 📈 Мониторинг

### Просмотр ресурсов

```bash
# Статистика контейнеров
docker stats

# Использование диска
docker system df
```

### Очистка

```bash
# Удалить неиспользуемые образы
docker image prune

# Очистить все (⚠️ осторожно!)
docker system prune -a --volumes
```

## 🔒 Безопасность

### Рекомендации

1. **Не коммитьте `.env`** — добавьте в `.gitignore`
2. **Используйте secrets** — для продакшена используйте Docker secrets
3. **Ограничьте доступ** — настройте firewall для портов
4. **Обновляйте образы** — регулярно запускайте `docker-compose pull`

### Docker Secrets (production)

```yaml
services:
  backend:
    secrets:
      - tg_api_id
      - tg_api_hash

secrets:
  tg_api_id:
    file: ./secrets/tg_api_id.txt
  tg_api_hash:
    file: ./secrets/tg_api_hash.txt
```

## 📚 Полезные команды

```bash
# Войти в контейнер backend
docker-compose exec backend bash

# Войти в контейнер frontend
docker-compose exec frontend sh

# Выполнить команду в backend
docker-compose exec backend python -c "print('Hello')"

# Просмотреть сессию Telethon
docker-compose exec backend ls -la /app/sessions

# Экспорт логов
docker-compose logs > logs.txt
```

## 🎯 Production Checklist

- [ ] Заполнен `.env` файл
- [ ] Qwen CLI авторизован
- [ ] Telegram сессия создана
- [ ] Настроен firewall
- [ ] Включен HTTPS (опционально)
- [ ] Настроен backup для volume
- [ ] Настроен мониторинг
- [ ] Настроены логи (log rotation)

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker-compose logs -f`
2. Убедитесь что все credentials заполнены
3. Проверьте что Qwen CLI авторизован на хосте
4. Пересоберите образы: `docker-compose build --no-cache`

---

**Документация:** [README.md](./README.md) | [QUICKSTART.md](./QUICKSTART.md)
