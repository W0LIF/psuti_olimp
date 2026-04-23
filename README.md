# 💰 Student Finance - Приложение для управления личными финансами студента

Полнофункциональное веб-приложение для отслеживания доходов и расходов с поддержкой бюджетирования, аналитики и отчетов.

---

## 📋 Содержание

- [Обзор проекта](#обзор-проекта)
- [Backend](#backend)
- [Frontend](#frontend)
- [Развертывание](#развертывание)
- [Как начать разработку](#как-начать-разработку)
- [Структура проекта](#структура-проекта)
- [API Документация](#api-документация)

---

## 🎯 Обзор проекта

**Student Finance** - это приложение для управления личными финансами студентов, позволяющее:
- 📊 Отслеживать доходы и расходы
- 💼 Управлять бюджетом по категориям
- 📈 Анализировать расходы с помощью графиков
- 📋 Создавать и экспортировать финансовые отчеты (CSV, PDF)
- 🔐 Безопасное хранение данных с аутентификацией
- 📱 Адаптивный дизайн (мобильный и десктопный)

**Базовые категории расходов:**
- Еда
- Транспорт
- Учёба
- Развлечение
- Кофе
- Покупки
- Дом
- Стипендия
- Прочее

---

## 🔧 Backend

### Технологический стек

| Компонент | Версия | Описание |
|-----------|--------|----------|
| **FastAPI** | 0.115.6 | Современный веб-фреймворк для создания REST API |
| **Python** | 3.11+ | Язык программирования |
| **SQLAlchemy** | 2.0.36 | ORM для работы с БД |
| **Alembic** | 1.14.0 | Миграции БД |
| **PostgreSQL** | 15 | Реляционная БД |
| **Asyncpg** | 0.30.0 | Асинхронный драйвер для PostgreSQL |
| **Uvicorn** | 0.32.1 | ASGI сервер |
| **Gunicorn** | 21.2.0 | Продакшн сервер |
| **JWT (python-jose)** | 3.3.0 | Аутентификация и авторизация |
| **Passlib** | 1.7.4 | Хеширование паролей |
| **Pydantic** | 2.10.6 | Валидация данных |

### Структура Backend

```
finance-backend/
├── app/
│   ├── main.py                 # Точка входа приложения
│   ├── config.py               # Конфигурация приложения
│   ├── database.py             # Подключение к БД
│   ├── models.py               # SQLAlchemy модели (User, Transaction, Category, Budget)
│   ├── schemas.py              # Pydantic схемы для валидации
│   ├── auth.py                 # Логика аутентификации и JWT
│   ├── dependencies.py         # Зависимости (Dependency Injection)
│   ├── routers/                # API маршруты
│   │   ├── auth.py             # Регистрация, логин (POST /auth/register, /auth/login)
│   │   ├── transactions.py     # Управление транзакциями (GET, POST, DELETE)
│   │   ├── categories.py       # Управление категориями (GET, POST, DELETE)
│   │   ├── budget.py           # Управление бюджетами (GET, POST)
│   │   ├── statistics.py       # Статистика по транзакциям
│   │   └── insights.py         # Аналитика и рекомендации
│   └── utils/
│       └── insights_logic.py   # Логика для аналитики
├── migrations/                 # Миграции БД (Alembic)
│   └── versions/
│       └── 0001_initial_migration.py
├── requirements.txt            # Зависимости Python
├── Dockerfile                  # Docker образ
├── docker-compose.migrate.yml  # Compose для миграций
├── alembic.ini                 # Конфиг Alembic
├── start.sh                    # Скрипт запуска
└── runtime.txt                 # Версия Python для Heroku/Render
```

### Основные модели БД

**User**
- id (Primary Key)
- email (уникальный)
- hashed_password
- full_name
- Связь: многие транзакции, категории, бюджеты

**Transaction**
- id (Primary Key)
- amount (сумма)
- type (income/expense)
- date (дата)
- comment (опционально)
- user_id (Foreign Key)
- category_id (Foreign Key)

**Category**
- id (Primary Key)
- name (название категории)
- icon (эмодзи или код)
- is_default (0 - пользовательская, 1 - дефолтная)
- user_id (Foreign Key, null для дефолтных)

**Budget**
- id (Primary Key)
- month (1-12)
- year
- category_id (Foreign Key, опционально для общего лимита)
- limit_amount (лимит)
- user_id (Foreign Key)

### API Endpoints

#### Аутентификация
```
POST   /auth/register          # Регистрация нового пользователя
POST   /auth/login             # Вход в систему
GET    /auth/me                # Получить текущего пользователя
```

#### Транзакции
```
GET    /transactions/           # Получить все транзакции пользователя
GET    /transactions/month/{month}/{year}  # Транзакции за месяц
POST   /transactions/           # Создать новую транзакцию
DELETE /transactions/{id}       # Удалить транзакцию
```

#### Категории
```
GET    /categories/             # Получить все категории (автоматически создаст дефолтные)
POST   /categories/             # Создать новую категорию
DELETE /categories/{id}         # Удалить категорию
PATCH  /categories/{id}         # Обновить категорию
```

#### Бюджеты
```
GET    /budgets/                # Получить бюджеты
POST   /budgets/                # Создать бюджет
PUT    /budgets/{id}            # Обновить бюджет
DELETE /budgets/{id}            # Удалить бюджет
```

#### Статистика
```
GET    /statistics/total        # Общая статистика
GET    /statistics/by-category  # Статистика по категориям
```

#### Аналитика
```
GET    /insights/               # Получить рекомендации и аналитику
```

### Ключевые особенности Backend

- ✅ **Асинхронность**: Полностью асинхронный код с использованием async/await
- ✅ **Безопасность**: JWT токены, хеширование паролей, CORS
- ✅ **Валидация**: Pydantic для валидации всех входных данных
- ✅ **Миграции**: Alembic для управления схемой БД
- ✅ **Дефолтные категории**: Автоматическое создание 9 стандартных категорий для новых пользователей
- ✅ **Error Handling**: Кастомная обработка ошибок
- ✅ **API Docs**: Автоматическая документация Swagger (доступна на `/docs`)

---

## 🎨 Frontend

### Технологический стек

| Компонент | Версия | Описание |
|-----------|--------|----------|
| **React** | 18.3.1 | UI фреймворк |
| **TypeScript** | 5.7.4 | Типизированный JavaScript |
| **Vite** | 6.4.2 | Быстрый сборщик |
| **Tailwind CSS** | 4.1.12 | Утилити CSS фреймворк |
| **React Router** | 7.14.2 | Маршрутизация |
| **Recharts** | 2.15.2 | Графики (диаграммы расходов) |
| **Chart.js** | 4.5.1 | Библиотека для графиков |
| **Radix UI** | Последняя | Бесстильные компоненты |
| **shadcn/ui** | - | Компоненты на базе Radix + Tailwind |
| **Lucide React** | 0.487.0 | Иконки |
| **React Hook Form** | 7.55.0 | Управление формами |
| **Axios** | 1.15.2 | HTTP клиент |
| **JWT Decode** | 4.0.0 | Декодирование JWT |
| **Sonner** | 2.0.3 | Toast уведомления |
| **React PDF** | 4.5.1 | Генерация PDF отчетов |
| **File Saver** | 2.0.5 | Экспорт файлов |

### Структура Frontend

```
frontend/
├── src/
│   ├── main.tsx                # Точка входа
│   ├── vite-env.d.ts          # Типы для Vite
│   ├── app/
│   │   ├── App.tsx            # Главный компонент приложения
│   │   ├── components/        # React компоненты
│   │   │   ├── Dashboard.tsx        # Главный экран приложения
│   │   │   ├── MainApp.tsx          # Основной контейнер
│   │   │   ├── AuthPage.tsx         # Страница аутентификации
│   │   │   ├── ReportsPage.tsx      # Отчеты и аналитика
│   │   │   ├── SettingsPage.tsx     # Настройки
│   │   │   ├── AboutPage.tsx        # О приложении
│   │   │   ├── TransactionForm.tsx  # Форма добавления транзакции
│   │   │   ├── TransactionList.tsx  # Список транзакций
│   │   │   ├── TransactionFilters.tsx # Фильтрация транзакций
│   │   │   ├── BalanceCard.tsx      # Карточка баланса
│   │   │   ├── BudgetProgress.tsx   # Прогресс по бюджету
│   │   │   ├── ExpenseChart.tsx     # Диаграмма расходов (Pie chart)
│   │   │   ├── CategoryManager.tsx  # Управление категориями
│   │   │   ├── ForecastPanel.tsx    # Прогноз расходов
│   │   │   ├── SmartTip.tsx         # Умные советы
│   │   │   ├── ReportPDF.tsx        # Компонент PDF отчета
│   │   │   ├── ImportCSV.tsx        # Импорт из CSV
│   │   │   ├── CurrencySelector.tsx # Выбор валюты
│   │   │   ├── CurrencyContext.tsx  # Контекст валют
│   │   │   ├── Navigation.tsx       # Навигация
│   │   │   ├── ThemeToggle.tsx      # Переключение темы
│   │   │   ├── SharedBudget.tsx     # Общий бюджет
│   │   │   ├── ui/               # shadcn/ui компоненты (30+)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   └── ... (другие UI компоненты)
│   │   │   └── figma/
│   │   │       └── ImageWithFallback.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Контекст аутентификации
│   │   └── App.tsx
│   ├── hooks/
│   │   └── useAsync.ts              # Hook для асинхронных операций
│   ├── services/
│   │   ├── api.ts                   # Базовый HTTP клиент
│   │   ├── auth.ts                  # Сервис аутентификации
│   │   ├── transactions.ts          # Сервис транзакций
│   │   ├── categories.ts            # Сервис категорий
│   │   ├── budgets.ts               # Сервис бюджетов
│   │   └── stats.ts                 # Сервис статистики
│   ├── styles/
│   │   ├── index.css                # Основные стили
│   │   ├── tailwind.css             # Tailwind CSS
│   │   ├── theme.css                # Кастомная тема (светлая/темная)
│   │   ├── fonts.css                # Шрифты
│   │   └── responsive.css           # Адаптивные стили
│   ├── vite-env.d.ts
│   └── main.tsx
├── public/
│   ├── manifest.json
│   └── fonts/                       # Шрифты для PDF экспорта
├── build/                           # Результат production сборки
├── package.json
├── vite.config.ts                   # Конфиг Vite
├── tsconfig.json                    # Конфиг TypeScript
├── tailwind.config.mjs              # Конфиг Tailwind
├── postcss.config.mjs               # Конфиг PostCSS
└── README.md
```

### Основные страницы и функциональность

#### 📊 Dashboard (Главный экран)
- Отображение баланса (доходы/расходы/итого)
- Список всех транзакций с фильтрацией
- Диаграмма расходов по категориям (Pie Chart)
- Прогресс выполнения бюджета
- Предупреждения о превышении лимитов
- Умные советы и рекомендации
- Прогноз расходов на основе истории

#### 💼 Управление транзакциями
- Добавление доходов/расходов
- Выбор категории и даты
- Опциональный комментарий
- Удаление транзакций
- Фильтрация по:
  - Типу (все/доходы/расходы)
  - Периоду (сегодня/неделя/месяц/свои даты)
  - Категориям
- Сортировка и поиск

#### 📈 Отчеты и Аналитика
- Просмотр статистики за выбранный месяц
- Доходы/Расходы/Баланс
- Расходы по категориям (таблица)
- **Экспорт в CSV** - скачивание данных
- **Экспорт в PDF** - красивый отчет с диаграммами и сводками
- Выбор месяца и года

#### ⚙️ Управление категориями
- Просмотр всех категорий (дефолтные + пользовательские)
- Создание новых категорий
- Выбор иконки (30+ иконок)
- Выбор цвета категории
- Редактирование названия
- Удаление пользовательских категорий

#### 💰 Бюджеты и лимиты
- Установка общего месячного лимита
- Установка лимитов по отдельным категориям
- Визуальный прогресс-бар для каждого лимита
- Цветовое кодирование (зелёный/жёлтый/красный)
- Предупреждения при приближении/превышении лимита
- Сохранение всех лимитов

#### 🎨 Дизайн и UX
- **Темная/Светлая тема** - переключение в один клик
- **Адаптивный дизайн** - полная поддержка мобильных устройств
- **Интуитивный интерфейс** - понятные иконки и навигация
- **Smooth анимации** - приятный пользовательский опыт
- **Toast уведомления** - обратная связь с пользователем

### Ключевые особенности Frontend

- ✅ **SPA (Single Page Application)**: Быстрая навигация без перезагрузок
- ✅ **TypeScript**: Полная типизация для безопасности
- ✅ **React Hooks**: useAsync, useContext, useMemo, useEffect
- ✅ **Context API**: Управление глобальным состоянием (Auth, Currency)
- ✅ **Responsive Design**: Адаптация под все размеры экранов
- ✅ **Dark Mode**: Встроенная поддержка темной темы
- ✅ **Export функции**: CSV и PDF экспорт данных
- ✅ **Форма импорта**: Возможность импортировать транзакции из CSV

---

## 🚀 Развертывание

### Локальное развертывание (Docker Compose)

#### Требования
- Docker и Docker Compose установлены
- Git для клонирования репозитория

#### Шаги

1. **Клонировать репозиторий**
```bash
git clone <repository-url>
cd psuti_olimp
```

2. **Создать `.env` файл в `finance-backend/`**
```env
DATABASE_URL=postgresql+asyncpg://user:password@db:5432/finance
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=true
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

3. **Запустить контейнеры**
```bash
docker-compose up --build
```

4. **Проверить статус**
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Frontend будет доступен после сборки

#### Что происходит при запуске
- PostgreSQL база данных запускается на порту 5432
- Backend запускается на порту 8000
- Автоматически запускаются миграции БД
- Создаются дефолтные таблицы

---

### Развертывание на Render

#### Требования
- Аккаунт на Render.com
- GitHub репозиторий с проектом

#### Шаги

1. **Подготовка**
   - Убедитесь, что `render.yaml` в корне репозитория
   - Backend код должен быть в папке `finance-backend/`

2. **Создать PostgreSQL базу**
   - В Render: New → PostgreSQL
   - Скопировать CONNECTION_STRING

3. **Создать Web Service**
   - В Render: New → Web Service
   - Подключить GitHub репозиторий
   - Root Directory: `finance-backend`
   - Environment: Docker
   - Build Command: `docker build -t app .`
   - Start Command: оставить по умолчанию
   - Добавить переменные окружения:
     - `DATABASE_URL`: URL из PostgreSQL
     - `SECRET_KEY`: сгенерировать безопасный ключ
     - `DEBUG`: false
     - `ALLOWED_ORIGINS`: URL фронтенда

4. **Развертывание Frontend**
   - Использовать Vercel, Netlify или другой хостинг для статических сайтов
   - Выполнить сборку: `npm run build`
   - Развернуть папку `dist/`

#### Переменные окружения для Render

```
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=<generate-secure-key>
DEBUG=false
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

---

## 🛠️ Как начать разработку

### Backend

#### Требования
- Python 3.11+
- pip
- PostgreSQL (или использовать Docker)

#### Установка и запуск

1. **Перейти в директорию backend**
```bash
cd finance-backend
```

2. **Создать виртуальное окружение**
```bash
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
```

3. **Установить зависимости**
```bash
pip install -r requirements.txt
```

4. **Создать `.env` файл**
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/finance
SECRET_KEY=dev-secret-key
DEBUG=true
ALLOWED_ORIGINS=http://localhost:5173
```

5. **Запустить миграции**
```bash
alembic upgrade head
```

6. **Запустить сервер**
```bash
uvicorn app.main:app --reload
```

Сервер будет доступен на `http://localhost:8000`

### Frontend

#### Требования
- Node.js 16+ и npm/pnpm
- Git

#### Установка и запуск

1. **Перейти в директорию frontend**
```bash
cd frontend
```

2. **Установить зависимости**
```bash
npm install
# или
pnpm install
```

3. **Создать `.env` файл (если требуется)**
```env
VITE_API_URL=http://localhost:8000
```

4. **Запустить dev сервер**
```bash
npm run dev
# или
pnpm dev
```

Frontend будет доступен на `http://localhost:5173`

5. **Сборка для продакшена**
```bash
npm run build
```

Результат в папке `dist/`

---

## 📁 Структура проекта

```
psuti_olimp/
├── finance-backend/              # Backend приложение (Python/FastAPI)
│   ├── app/
│   ├── migrations/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── alembic.ini
│   └── start.sh
├── frontend/                     # Frontend приложение (React/TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.mjs
├── docker-compose.yml            # Docker Compose для локальной разработки
├── docker-compose.migrate.yml    # Compose для запуска миграций
├── render.yaml                   # Конфиг для Render развертывания
└── README.md                     # Этот файл
```

---

## 📚 API Документация

### Swagger UI

После запуска backend сервера, интерактивная документация API доступна по адресу:
```
http://localhost:8000/docs
```

Здесь вы можете:
- Просмотреть все endpoints
- Увидеть схемы запросов/ответов
- Тестировать API прямо в браузере

### Примеры запросов

#### Регистрация
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe"
  }'
```

#### Логин
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Получить транзакции за месяц
```bash
curl http://localhost:8000/transactions/month/4/2026 \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Создать транзакцию
```bash
curl -X POST http://localhost:8000/transactions/ \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1500,
    "type": "expense",
    "date": "2026-04-23",
    "category_id": 1,
    "comment": "Обед в кафе"
  }'
```

#### Получить категории
```bash
curl http://localhost:8000/categories/ \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 🔐 Безопасность

- ✅ JWT токены для аутентификации
- ✅ Хеширование паролей (Passlib + bcrypt)
- ✅ CORS для контроля кросс-доменных запросов
- ✅ Валидация всех входных данных
- ✅ HTTPS рекомендуется для продакшена

### Рекомендации для продакшена

1. **Изменить SECRET_KEY** на безопасный значение
2. **Установить ALLOWED_ORIGINS** на конкретные домены
3. **Включить HTTPS** везде
4. **Использовать сильные пароли** для БД
5. **Регулярно обновлять** зависимости
6. **Настроить логирование** и мониторинг
7. **Использовать environment переменные** вместо hardcode

---

## 🐛 Решение проблем

### Backend не запускается
- Проверьте, что PostgreSQL запущена
- Проверьте DATABASE_URL в .env
- Убедитесь, что все зависимости установлены: `pip install -r requirements.txt`
- Проверьте логи Docker: `docker-compose logs backend`

### Frontend не компилируется
- Очистите node_modules: `rm -rf node_modules && npm install`
- Проверьте версию Node.js: `node --version` (должна быть 16+)
- Проверьте VITE_API_URL в .env

### Ошибка "Cannot read properties of null"
- Убедитесь, что API возвращает данные
- Проверьте, что категории загружены перед использованием
- Используйте условную проверку перед доступом к свойствам

### Проблемы с миграциями
- Убедитесь, что БД пуста перед первым запуском
- Используйте: `alembic downgrade base` для отката
- Затем: `alembic upgrade head` для переприменения

---

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создать ветку для вашей фичи (`git checkout -b feature/AmazingFeature`)
3. Commit изменений (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Открыть Pull Request

---

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

---

## 📞 Контакты и поддержка

Для вопросов и предложений:
- Создайте Issue в GitHub репозитории
- Свяжитесь с командой разработки

---

## 🎓 Образовательная цель

Этот проект создан как учебное приложение для изучения:
- Full-stack веб-разработки
- REST API с FastAPI
- React приложений
- Работы с БД (PostgreSQL, SQLAlchemy)
- Docker и контейнеризации
- Развертывания на облачных платформах

---

**Последнее обновление**: Апрель 2026

Спасибо за использование Student Finance! 💙
