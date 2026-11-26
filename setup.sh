#!/bin/bash
set -e

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║           🚀 TeleQwen AI — Docker Setup                   ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Проверка Docker
echo -e "${BLUE}📋 Проверка Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен!${NC}"
    echo -e "${YELLOW}Установите Docker: https://docs.docker.com/get-docker/${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose не установлен!${NC}"
    echo -e "${YELLOW}Установите Docker Compose: https://docs.docker.com/compose/install/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker: $(docker --version)${NC}"
echo -e "${GREEN}✅ Docker Compose: $(docker-compose --version)${NC}"
echo ""

# Проверка .env
echo -e "${BLUE}📋 Проверка конфигурации...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Файл .env не найден${NC}"
    echo -e "${YELLOW}📝 Создаю .env из шаблона...${NC}"
    cp .env.docker.example .env
    echo -e "${RED}❌ Заполните .env файл вашими credentials!${NC}"
    echo -e "${YELLOW}   nano .env${NC}"
    echo ""
    echo -e "${YELLOW}🔗 Получите API keys:${NC}"
    echo -e "   1. Откройте https://my.telegram.org"
    echo -e "   2. Войдите с номером телефона"
    echo -e "   3. API development tools → создайте приложение"
    echo -e "   4. Скопируйте api_id и api_hash в .env"
    echo ""
    exit 1
fi

# Проверка credentials
source .env
if [ -z "$TG_API_ID" ] || [ -z "$TG_API_HASH" ]; then
    echo -e "${RED}❌ TG_API_ID или TG_API_HASH не заполнены в .env!${NC}"
    echo -e "${YELLOW}   nano .env${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env настроен${NC}"
echo ""

# Проверка Qwen
echo -e "${BLUE}📋 Проверка Qwen Code CLI...${NC}"
if ! command -v qwen &> /dev/null; then
    echo -e "${YELLOW}⚠️  Qwen Code CLI не установлен${NC}"
    echo -e "${YELLOW}📝 Устанавливаю...${NC}"
    npm install -g @qwen-code/qwen-code
fi

echo -e "${GREEN}✅ Qwen: $(qwen --version)${NC}"
echo ""

# Проверка авторизации Qwen
echo -e "${BLUE}🔐 Проверка авторизации Qwen...${NC}"
echo -e "${YELLOW}Убедитесь что вы авторизованы в Qwen:${NC}"
echo -e "${YELLOW}   qwen /auth${NC}"
echo ""
read -p "Вы уже авторизованы в Qwen? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔐 Запускаю авторизацию...${NC}"
    qwen /auth
fi
echo ""

# Сборка
echo -e "${BLUE}🔨 Сборка Docker образов...${NC}"
echo -e "${YELLOW}Это может занять несколько минут...${NC}"
docker-compose build
echo ""

# Запуск
echo -e "${BLUE}🚀 Запуск контейнеров...${NC}"
docker-compose up -d
echo ""

# Ожидание запуска
echo -e "${BLUE}⏳ Ожидание запуска сервисов...${NC}"
sleep 5
echo ""

# Статус
echo -e "${BLUE}📊 Статус контейнеров:${NC}"
docker-compose ps
echo ""

# Проверка backend
echo -e "${BLUE}🔍 Проверка backend...${NC}"
if curl -s http://localhost:8000/api/status > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend работает!${NC}"
else
    echo -e "${YELLOW}⚠️  Backend ещё запускается...${NC}"
    echo -e "${YELLOW}   Проверьте логи: docker-compose logs -f backend${NC}"
fi
echo ""

# Готово
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║              ✅ Установка завершена!                      ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BLUE}🌐 Доступ:${NC}"
echo -e "   Frontend:    ${GREEN}http://localhost${NC}"
echo -e "   Backend API: ${GREEN}http://localhost:8000${NC}"
echo -e "   API Docs:    ${GREEN}http://localhost:8000/docs${NC}"
echo ""
echo -e "${BLUE}📱 Первая авторизация Telegram:${NC}"
echo -e "   ${YELLOW}docker-compose logs -f backend${NC}"
echo -e "   Введите номер телефона и код из Telegram"
echo ""
echo -e "${BLUE}📚 Полезные команды:${NC}"
echo -e "   ${YELLOW}make help${NC}          - показать все команды"
echo -e "   ${YELLOW}make logs${NC}          - просмотр логов"
echo -e "   ${YELLOW}make restart${NC}       - перезапуск"
echo -e "   ${YELLOW}make down${NC}          - остановка"
echo ""
echo -e "${BLUE}📖 Документация:${NC}"
echo -e "   ${YELLOW}DOCKER.md${NC}          - полное руководство по Docker"
echo -e "   ${YELLOW}README.md${NC}          - общая документация"
echo ""
