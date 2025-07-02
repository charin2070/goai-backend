Дорогой AI, этот файл создан специально для тебя. В файле содержится важная информация о проекте, над которым мы с тобой сейчас работаем. Пожалуйста, внимательно изучи всё содержимое файла и глубоко проанализируй, чтобы максимально быстро и эффективно продолжить работу над приложением.

# Контекст проекта "GoAI-Backend"

## 1. Информация о проекте

- **Название:** "GoAI-Backend"  
- **Базовый темплейт:** [Vercel Admin Dashboard Template](https://vercel.com/templates/next.js/admin-dashboard)
- **Цель:** Создание backend-модуля для экосистемы GoAI - платформы автоматической консолидации мультимодальных данных и визуализации объективной модели процесса
- **Обучающая задача:** Прокачка пользователя в технологиях (Next.js, React, TypeScript, PostgreSQL, Drizzle ORM) до уровня Middle Full-Stack разработчика

### 1.1 Экосистема GoAI
GoAI-Backend служит центральным API для взаимодействия с модулями платформы:
- **GoAI-Storage** - API для CRUD-операций с хранилищем данных
- **GoAI-Analytics** - модуль преобразования данных в статистику и инсайты  
- **GoAI-Visual** - модуль визуализации (графики, диаграммы)
- **GoAI-Client** - клиентское приложение
- **GoAI-AI** - модуль для интеграции с AI-сервисами (OpenAI, Google, Grok)

### 1.2 Проблема, которую решает GoAI
Современные команды страдают от информационного водопада - множество каналов (задачи, уведомления, чаты, почта) создают когнитивную перегрузку и снижают эффективность. GoAI консолидирует эти данные в единую объективную модель процесса.

## 2. Технический стек

### 2.1 Основные технологии
- **Framework:** [Next.js 15.3.4](https://nextjs.org) (App Router)
- **Language:** [TypeScript 5.7.2](https://www.typescriptlang.org) 
- **Database:** [PostgreSQL](https://www.postgresql.org) (194.54.158.82:5432)
- **ORM:** [Drizzle ORM 0.31.4](https://orm.drizzle.team) + [Drizzle Kit 0.31.4](https://kit.drizzle.team)
- **Styling:** [Tailwind CSS 3.4.17](https://tailwindcss.com)
- **UI Components:** [Catalyst UI Kit](https://catalyst.tailwindui.com)
- **Icons:** [Lucide React 0.400.0](https://lucide.dev) + [Heroicons 2.2.0](https://heroicons.com)
- **Package Manager:** [pnpm 10.12.4](https://pnpm.io) ✅

### 2.2 Дополнительные инструменты
- **Build Tool:** [Turbopack](https://turbo.build/pack) (Next.js встроенный)
- **Auth:** [NextAuth.js 5.0.0-beta.25](https://authjs.dev) (настроен, но не активен)
- **Validation:** [Zod 3.24.1](https://zod.dev) + [Drizzle-Zod 0.5.1](https://github.com/drizzle-team/drizzle-zod)
- **Analytics:** [Vercel Analytics 1.4.1](https://vercel.com/analytics) 
- **Formatting:** [Prettier 3.4.2](https://prettier.io)

## 3. Архитектура и структура проекта

### 3.1 Файловая структура (ключевые компоненты)
```
goai-backend/
├── app/
│   ├── (dashboard)/              # Dashboard группа маршрутов
│   │   ├── page.tsx             # Главная страница (клиентская)
│   │   ├── layout.tsx           # Layout с навбаром
│   │   ├── load-db-button.tsx   # Кнопка загрузки данных из БД
│   │   ├── products-table.tsx   # Таблица продуктов
│   │   ├── product.tsx          # Компонент отдельного продукта
│   │   ├── actions.ts           # Server Actions
│   │   ├── nav-item.tsx         # Элемент навигации
│   │   ├── search.tsx           # Компонент поиска
│   │   ├── user.tsx             # Компонент пользователя
│   │   ├── providers.tsx        # React провайдеры
│   │   └── customers/page.tsx   # Страница клиентов
│   ├── api/
│   │   ├── products/route.ts    # API endpoint для продуктов
│   │   ├── seed/route.ts        # Заполнение БД тестовыми данными
│   │   └── auth/[...nextauth]/route.ts # NextAuth endpoints
│   ├── login/page.tsx           # Страница входа
│   ├── layout.tsx               # Корневой layout
│   └── globals.css              # Глобальные стили
├── components/
│   ├── ui/                      # Shadcn UI компоненты
│   └── icons.tsx                # Иконки
├── documentation/               # 📚 Проектная документация
│   └── README.md                # Индекс всех руководств
├── lib/
│   ├── db.ts                    # Конфигурация БД и схемы
│   ├── auth.ts                  # Конфигурация NextAuth
│   └── utils.ts                 # Утилиты
├── middleware.ts                # Next.js middleware
├── .env                         # Переменные окружения (локальный)
├── .env.example                 # Пример переменных окружения
└── ai-context.md                # Контекст для AI (актуальный)
```

### 3.2 Архитектурные решения

#### База данных
- **Подключение:** Прямое подключение к PostgreSQL через драйвер `postgres` (3.4.7)
- **Схема:** Определена в `lib/db.ts` с помощью Drizzle ORM
- **Миграции:** Ручные (SQL скрипты) + Drizzle Push

#### Загрузка данных
- **Паттерн:** On-demand loading (загрузка по требованию)
- **Компонентная архитектура:** Client Components для интерактивности
- **API:** REST endpoints через Next.js API Routes
- **Коммуникация:** Custom Browser Events между компонентами

#### Система документации
- **Централизованное хранение:** Папка `/documentation/` в корне проекта
- **Индексация:** `documentation/README.md` содержит ссылки на все руководства
- **Покрытие:** Полные гайды по всем аспектам разработки проекта

## 4. Текущий статус проекта

### 4.1 ✅ Реализовано
1. **Базовая структура проекта** - темплейт admin-dashboard адаптирован
2. **Подключение к PostgreSQL** - исправлен драйвер (Neon → postgres)
3. **Схема базы данных** - модель `products` с Drizzle ORM
4. **UI компоненты** - навбар, таблица, карточки с Catalyst UI ✅
5. **API endpoints** - `/api/products` и `/api/seed`
6. **Загрузка по требованию** - кнопка "Load from DB" в навбаре
7. **Обработка ошибок** - graceful handling без падения приложения
8. **Система документации** - папка `/documentation/` с индексным файлом `README.md` и концепцией проекта
9. **Пакетный менеджер pnpm** - полная миграция с npm на pnpm ✅

### 4.2 ⚠️ Частично реализовано  
1. **NextAuth.js** - настроен, но переменные окружения не заполнены
2. **Тестовые данные** - seed готов, но таблица в БД не создана
3. **Поиск и фильтрация** - UI готов, функционал требует доработки

### 4.3 ❌ Не реализовано
1. **Авторизация пользователей** - требует настройки OAuth провайдеров
2. **CRUD операции** - только READ реализован
3. **Валидация данных** - Zod схемы не созданы
4. **Мобильная адаптация** - требует тестирования
5. **Развертывание** - не подготовлено для продакшена

## 5. Техническая конфигурация

### 5.1 База данных PostgreSQL
```
Сервер: 194.54.158.82:5432
База: goai_db  
Пользователь: goai_user
Пароль: GggodbStrong0
```

### 5.2 Переменные окружения (.env)
```bash
# Database
POSTGRES_URL=postgresql://goai_user:GggodbStrong0@194.54.158.82:5432/goai_db

# NextAuth.js (не настроено)
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=dae1b2f1d5bcece1d62fc0546c18fffd
AUTH_GOOGLE_ID=303536528919-sh4bjp1fvh9uab470fdub8e72fbk23pu.apps.googleusercontent.com  
AUTH_GOOGLE_SECRET=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
```

### 5.3 Необходимые SQL скрипты
```sql
-- Создание ENUM типа
CREATE TYPE status AS ENUM ('active', 'inactive', 'archived');

-- Создание таблицы products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  status status NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  available_at TIMESTAMP NOT NULL
);
```

## 6. Система документации проекта
### 6.1 Структура документации
Папка `/documentation/` содержит централизованные руководства по всем аспектам разработки:
### 6.2 Принципы документации
- **Актуальность** - регулярное обновление при изменениях в коде
- **Полнота** - покрытие всех ключевых процессов разработки
- **Практичность** - пошаговые инструкции с примерами кода
- **Доступность** - понятный язык для разных уровней экспертизы
### 6.3 Индексный файл
`documentation/README.md` служит центральной точкой входа в документацию:

### 8.1 Немедленные (критические) задачи
1. **Создать таблицу в PostgreSQL** - выполнить SQL скрипт
2. **Протестировать загрузку данных** - проверить кнопку "Load from DB"
3. **Запустить seed данных** - заполнить БД тестовыми продуктами

## 10. Принципы работы AI-ассистента

### 10.1 Обучающий подход
- **Объяснять концепции** - теоретические основы перед практикой
- **Показывать альтернативы** - разные способы решения задач
- **Задавать вопросы** - проверка понимания материала
- **Предлагать улучшения** - code review и best practices

### 10.3 Эффективность разработки
- **Инкрементальный подход** - маленькие, проверяемые изменения
- **Тестирование на каждом шаге** - верификация работоспособности
- **Рефакторинг** - улучшение структуры кода
- **Документирование** - поддержание актуальности контекста

---

**Последнее обновление:** Июль 2025
**Версия контекста:** 1.0
**Статус проекта:** Активная разработка бэкенда
**Последние изменения:** Завершена миграция на новый UI Kit: с shadcn/ui  на Catalyst UI