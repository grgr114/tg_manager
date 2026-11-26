.PHONY: help build up down logs restart clean auth setup

# Цвета для вывода
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## Показать справку
	@echo "${GREEN}TeleQwen AI - Docker Management${NC}"
	@echo ""
	@echo "Использование:"
	@echo "  make <command>"
	@echo ""
	@echo "Команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${YELLOW}%-15s${NC} %s\n", $$1, $$2}'

setup: ## Первоначальная настройка
	@echo "${GREEN}🚀 Первоначальная настройка...${NC}"
	@cp -n .env.docker.example .env 2>/dev/null || true
	@echo "${YELLOW}📝 Заполните .env файл вашими credentials${NC}"
	@echo "   TG_API_ID и TG_API_HASH из https://my.telegram.org"
	@echo ""
	@echo "${YELLOW}🔐 Авторизуйтесь в Qwen:${NC}"
	@echo "   qwen /auth"
	@echo ""
	@echo "${GREEN}✅ Настройка завершена!${NC}"
	@echo "   Далее: make build && make up"

auth: ## Авторизация в Qwen
	@echo "${GREEN}🔐 Авторизация в Qwen...${NC}"
	qwen /auth

build: ## Сборка Docker образов
	@echo "${GREEN}🔨 Сборка образов...${NC}"
	docker-compose build

up: ## Запуск контейнеров
	@echo "${GREEN}🚀 Запуск контейнеров...${NC}"
	docker-compose up -d
	@echo ""
	@echo "${GREEN}✅ Сервисы запущены!${NC}"
	@echo "   Frontend: http://localhost"
	@echo "   Backend:  http://localhost:8000"
	@echo "   API Docs: http://localhost:8000/docs"

down: ## Остановка контейнеров
	@echo "${YELLOW}⏹️  Остановка контейнеров...${NC}"
	docker-compose down

restart: ## Перезапуск контейнеров
	@echo "${YELLOW}🔄 Перезапуск...${NC}"
	docker-compose restart

logs: ## Просмотр логов (все сервисы)
	docker-compose logs -f

logs-backend: ## Просмотр логов backend
	docker-compose logs -f backend

logs-frontend: ## Просмотр логов frontend
	docker-compose logs -f frontend

ps: ## Статус контейнеров
	docker-compose ps

clean: ## Остановка и удаление контейнеров
	@echo "${YELLOW}🧹 Очистка...${NC}"
	docker-compose down
	@echo "${GREEN}✅ Контейнеры остановлены${NC}"

clean-all: ## Полная очистка (включая volumes)
	@echo "${RED}⚠️  Внимание: будет удалена сессия Telegram!${NC}"
	@read -p "Продолжить? [y/N] " confirm && [ $$confirm = "y" ] || exit 1
	docker-compose down -v
	docker system prune -f
	@echo "${GREEN}✅ Полная очистка завершена${NC}"

rebuild: ## Пересборка и перезапуск
	@echo "${YELLOW}🔄 Пересборка...${NC}"
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

shell-backend: ## Войти в shell backend контейнера
	docker-compose exec backend bash

shell-frontend: ## Войти в shell frontend контейнера
	docker-compose exec frontend sh

stats: ## Статистика использования ресурсов
	docker stats

update: ## Обновление образов
	@echo "${YELLOW}📥 Обновление...${NC}"
	docker-compose pull
	docker-compose build
	docker-compose up -d

backup: ## Backup сессии Telegram
	@echo "${GREEN}💾 Создание backup...${NC}"
	@mkdir -p backups
	@docker run --rm -v teleqwen-ai_telethon_sessions:/data -v $$(pwd)/backups:/backup alpine tar czf /backup/telethon-backup-$$(date +%Y%m%d-%H%M%S).tar.gz /data
	@echo "${GREEN}✅ Backup создан в папке backups/${NC}"

restore: ## Restore сессии Telegram (укажите файл)
	@echo "${YELLOW}📂 Восстановление backup...${NC}"
	@read -p "Введите имя файла backup: " backup_file; \
	docker run --rm -v teleqwen-ai_telethon_sessions:/data -v $$(pwd)/backups:/backup alpine tar xzf /backup/$$backup_file -C /
	@echo "${GREEN}✅ Backup восстановлен${NC}"
