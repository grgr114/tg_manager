# 🐳 Docker Шпаргалка

## Быстрый старт

```bash
# Автоматическая настройка
./setup.sh

# Или вручную:
cp .env.docker.example .env
nano .env  # заполните credentials
docker-compose build
docker-compose up -d
```

## Основные команды

| Команда | Описание |
|---------|----------|
| `make setup` | Первоначальная настройка |
| `make build` | Сборка образов |
| `make up` | Запуск контейнеров |
| `make down` | Остановка контейнеров |
| `make restart` | Перезапуск |
| `make logs` | Просмотр логов |
| `make ps` | Статус контейнеров |
| `make clean` | Остановка и удаление |
| `make rebuild` | Пересборка и перезапуск |

## Docker Compose

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Перезапуск
docker-compose restart

# Логи
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Статус
docker-compose ps

# Войти в контейнер
docker-compose exec backend bash
docker-compose exec frontend sh

# Пересборка
docker-compose build --no-cache
```

## Полезные Docker команды

```bash
# Список контейнеров
docker ps

# Список образов
docker images

# Статистика ресурсов
docker stats

# Очистка
docker system prune -a

# Просмотр volumes
docker volume ls

# Удалить volume (⚠️ удалит сессию Telegram!)
docker volume rm teleqwen-ai_telethon_sessions
```

## Backup & Restore

```bash
# Backup сессии Telegram
make backup

# Restore
make restore

# Или вручную:
docker run --rm -v teleqwen-ai_telethon_sessions:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

## Troubleshooting

```bash
# Проверить логи backend
docker-compose logs backend

# Проверить логи frontend
docker-compose logs frontend

# Перезапустить только backend
docker-compose restart backend

# Полная пересборка
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Порты

- **Frontend:** http://localhost (80)
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## Файлы

- `docker-compose.yml` — оркестрация сервисов
- `Dockerfile` — frontend (nginx)
- `backend/Dockerfile` — backend (Python + Node.js)
- `nginx.conf` — конфигурация nginx
- `.env` — переменные окружения (не коммитить!)
- `.env.docker.example` — шаблон .env

## Документация

- [DOCKER.md](./DOCKER.md) — полное руководство
- [README.md](./README.md) — общая документация
- [QUICKSTART.md](./QUICKSTART.md) — быстрый старт
