## 1. Приветствие  AI
ℹ️ Дорогой AI, чтобы максимально быстро и эффективно продолжить работу над проектом,
в этом файле коропотливо собрана и структурирована полезная информация о проекте "GoAI-Backend", над которым мы с тобой сейчас будем работать.
Пожалуйста, внимательно изучи эту информациаю и используй на протяжении всей нашей кодинг-сессии.
🔥 Важно: поддерживай актуальность информации о проекте на протяжении всей сессии.

## 1. Важно
В качестве базы для проекта испрользовался темплейт с официального сайта:
- **Репозиторий темплейта:** https://vercel.com/templates/next.js/admin-dashboard

## 2. Описание проекта "GoAI-Backend"
- **Название:** GoAI-Backend
- **Задача:** Чтобы добпат у серверных модулей GoAI была еди  у всех модулей приложения  клиентские приложения и и клиенты   GoAI-Backened - сва  Реализация API для взаимодействия с модулями платформы GoAI такими как: 
  a. GoAI-Storage (модуль предоставляющий API для взаимодействия с хранилищем (напрмер, СУБД) посредством CROUD-операций), 
  b. GoAI-Analytics (модуль преобразования данных в статистическую информацию и инсайты),
  c. GoAI-Visual (модуль для визуализации информации. Например, построение графиков).
  d. GoAI-Client (клиентское приложение),
  e. GoAI-AI (модуль для взаимодействий с AI-сервисами. Например, OpenAI, Google, Grok и т.д.).
- **Описание:** модуль GoAI-Backend пред

## 3. Платформа
С GoAI вы можете:


## 1. Описание платформы "GoAI"
- **Название:** GoAI
- **Задача:** Разработать  Поскольку рабочая память человека имеет ограниченную ёмкость и подвержена когнитивным искажениям.
Сегодняшние проектные команды тонут в разрозненной информации – множество каналов (задачи, уведомления, чаты, почта, алерты и др.) создают «информационный водопад»,
который снижает фокус и эффективность.
Согласно исследованиям Atlassian, даже корпоративные сервисы-помощники утилизируют невосполнимый ресурс рабочего дня.     когнитивнкю перегрузку  «информационно-насыщенные» сотрудники ежедневно сталкиваются с перегрузкой, которую создают даже сами рабочие инструменты
atlassian.com
- **Решение:** Разработать платформу автоматической консолидации мультимодальных данных и визуализирует объективную модель процесса.


Улучшать сотрудничество: Делиться инсайтами и визуализациями с командой для лучшей коммуникации и согласованности.
- **Цель:** Создание full-stack веб-приложения для управления базой данных PostgreSQL на удалённом VPS-сервере. Ключевая особенность проекта - обучение пользователя технологиям (Next.js, React, Tailwind CSS, PostgreSQL) до уровня Middle Full-Stack разработчика.

## 2. Стек технологий

Технологический стэк:
- Framework - [Next.js (App Router)](https://nextjs.org)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [Auth.js](https://authjs.dev)
- Database - [Postgres](https://vercel.com/postgres)
- Deployment - [Vercel](https://vercel.com/docs/concepts/next.js/overview)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn UI](https://ui.shadcn.com/)
- Analytics - [Vercel Analytics](https://vercel.com/analytics)
- Formatting - [Prettier](https://prettier.io)

This template uses the new Next.js App Router. This includes support for enhanced layouts, colocation of components, tests, and styles, component-level data fetching, and more.

## Getting Started

During the deployment, Vercel will prompt you to create a new Postgres database. This will add the necessary environment variables to your project.

Inside the Vercel Postgres dashboard, create a table based on the schema defined in this repository.

```
CREATE TYPE status AS ENUM ('active', 'inactive', 'archived');

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

Then, uncomment `app/api/seed.ts` and hit `http://localhost:3000/api/seed` to seed the database with products.

Next, copy the `.env.example` file to `.env` and update the values. Follow the instructions in the `.env.example` file to set up your GitHub OAuth application.

```bash
npm i -g vercel
vercel link
vercel env pull
```

Finally, run the following commands to start the development server:

```
pnpm install
pnpm dev
```

You should now be able to access the application at http://localhost:3000.
