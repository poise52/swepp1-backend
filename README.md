# Swepp1 Backend API

Backend API для игры "Сапёр" на Node.js + Express + Prisma + PostgreSQL

## Структура проекта

```
src/
├── controllers/      # Контроллеры
├── middleware/       # Middleware (auth)
├── routes/          # Роуты API
├── types/           # TypeScript типы
├── utils/           # Утилиты (JWT)
└── index.ts         # Точка входа

prisma/
└── schema.prisma    # Схема БД
```

## Локальная разработка

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

Создайте файл `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/swepp1"
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### 3. Запуск PostgreSQL (локально или Docker)

**Docker:**

```bash
docker run -d \
  --name swepp1-postgres \
  -e POSTGRES_USER=swepp_user \
  -e POSTGRES_PASSWORD=swepp_password \
  -e POSTGRES_DB=swepp1 \
  -p 5432:5432 \
  postgres:16-alpine
```

### 4. Миграции БД

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Запуск dev сервера

```bash
npm run dev
```

Сервер запустится на `http://localhost:3000`

## Docker Compose (рекомендуется)

Запуск всего стека (PostgreSQL + Backend):

```bash
docker-compose up -d
```

Остановка:

```bash
docker-compose down
```

## API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход
- `GET /api/auth/me` - Текущий пользователь (требует auth)

### Рекорды

- `POST /api/records` - Сохранить рекорд (требует auth)
- `GET /api/records?difficulty=Новичок&limit=10` - Топ рекордов
- `GET /api/records/user/:userId?limit=10` - Рекорды пользователя

### Health Check

- `GET /health` - Проверка работоспособности

## Переменные окружения

| Переменная     | Описание                          | По умолчанию               |
| -------------- | --------------------------------- | -------------------------- |
| NODE_ENV       | Окружение                         | development                |
| PORT           | Порт сервера                      | 3000                       |
| DATABASE_URL   | URL PostgreSQL                    | -                          |
| JWT_SECRET     | Секретный ключ JWT                | -                          |
| JWT_EXPIRES_IN | Время жизни токена                | 7d                         |
| FRONTEND_URL   | URL фронтенда (для CORS)          | http://localhost:5173      |

## Деплой на VPS

### 1. Клонировать репозиторий

```bash
git clone <your-repo>
cd swepp1-backend
```

### 2. Настроить .env

```bash
nano .env
```

### 3. Запустить через Docker Compose

```bash
docker-compose up -d
```

### 4. Настроить Nginx (опционально)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL с Certbot

```bash
sudo certbot --nginx -d api.yourdomain.com
```

## Полезные команды

```bash
# Логи Docker
docker-compose logs -f backend

# Prisma Studio (GUI для БД)
npm run prisma:studio

# Пересобрать и перезапустить
docker-compose up -d --build

# Очистить всё
docker-compose down -v
```
