# BandFinder

Платформа для поиска музыкантов и создания музыкальных групп.

## Стек

- **Frontend:** React + TypeScript + Vite
- **Backend:** NestJS + Prisma
- **БД:** SQLite
- **API:** REST

## Запуск

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

API: http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Сайт: http://localhost:5173

## Тестовый аккаунт

- Email: `alex@example.com`
- Пароль: `password123`

## API эндпоинты

### Пользователи (учебный CRUD)

- `GET /users` — список пользователей
- `GET /users/:id` — пользователь по id
- `POST /users` — создать пользователя (name, email обязательны; age необязателен)

### Авторизация

- `POST /auth/register` — регистрация музыканта
- `POST /auth/login` — вход
- `GET /auth/me` — текущий пользователь (JWT)

### Профили

- `GET /profiles` — каталог музыкантов (фильтры, поиск)
- `GET /profiles/:id` — профиль музыканта
- `PATCH /profiles/me` — редактирование своего профиля (JWT)

### Объявления

- `GET /ads` — каталог объявлений
- `GET /ads/:id` — объявление
- `POST /ads` — создать (JWT)
- `PATCH /ads/:id` — редактировать (JWT)
- `DELETE /ads/:id` — удалить (JWT)

### Избранное

- `GET /favorites` — список (JWT)
- `POST /favorites` — добавить (JWT)
- `DELETE /favorites/:id` — удалить (JWT)

## LocalStorage

- `bandfinder_token` — JWT-токен
- `bandfinder_user` / `bandfinder_role` — данные авторизации
- `bandfinder_musician_filters` / `bandfinder_ad_filters` — сохранённые фильтры
- `bandfinder_ad_draft` — черновик объявления

## Структура БД

- `users` — пользователи
- `musician_profiles` — анкеты музыкантов (1:1 с users)
- `ads` — объявления
- `favorites` — избранное
# BandFinder
