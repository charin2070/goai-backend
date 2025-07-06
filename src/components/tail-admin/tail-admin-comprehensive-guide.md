# Tail Admin - Полное руководство по использованию

## Оглавление
1. [Архитектура и основные принципы](#architecture)
2. [Система контекстов](#contexts)
3. [Layout компоненты](#layout)
4. [UI компоненты](#ui-components)
5. [Цветовая схема и дизайн-токены](#design-tokens)
6. [Стилизация и CSS утилиты](#styling)
7. [Интеграция в проект](#integration)
8. [Примеры использования](#examples)

---

## 1. Архитектура и основные принципы {#architecture}

### Основная структура проекта

```
src/
├── context/           # React контексты для управления состоянием
├── layout/           # Основные layout компоненты
├── components/       # UI компоненты
│   ├── ui/          # Базовые UI элементы
│   ├── common/      # Общие компоненты
│   ├── form/        # Компоненты форм
│   └── ...
├── hooks/           # Кастомные React хуки
├── icons/           # SVG иконки
└── app/             # Next.js App Router страницы
```

### Ключевые принципы архитектуры:

1. **Контекстно-ориентированное управление состоянием** - использование React Context API
2. **Модульная система компонентов** - каждый компонент самодостаточен
3. **Responsive-first дизайн** - мобильные устройства как приоритет
4. **Dark/Light режимы** - полная поддержка тем
5. **Типизация TypeScript** - строгая типизация всех компонентов

---

## 2. Система контекстов {#contexts}

### ThemeContext - Управление темами

```typescript
// Использование в компонентах
import { useTheme } from '@/context/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
};
```

**Основные возможности:**
- Переключение между `light` и `dark` темами
- Автоматическое сохранение в localStorage
- Применение CSS классов к `document.documentElement`

### SidebarContext - Управление боковой панелью

```typescript
// Использование в компонентах
import { useSidebar } from '@/context/SidebarContext';

const MyComponent = () => {
  const { 
    isExpanded,      // Развернута ли боковая панель на десктопе
    isMobileOpen,    // Открыта ли боковая панель на мобильных
    isHovered,       // Наведен ли курсор на боковую панель
    activeItem,      // Активный элемент навигации
    openSubmenu,     // Открытое подменю
    toggleSidebar,   // Переключение боковой панели
    toggleMobileSidebar, // Переключение мобильной панели
    setIsHovered,    // Установка состояния hover
    setActiveItem,   // Установка активного элемента
    toggleSubmenu    // Переключение подменю
  } = useSidebar();
  
  return (
    <div>
      {/* Ваш компонент */}
    </div>
  );
};
```

---

## 3. Layout компоненты {#layout}

### Основная структура layout

```typescript
// app/(admin)/layout.tsx
"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Динамические отступы для основного контента
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"  // Развернутая боковая панель
    : "lg:ml-[90px]";  // Свернутая боковая панель

  return (
    <div className="min-h-screen xl:flex">
      {/* Боковая панель и фон для мобильных */}
      <AppSidebar />
      <Backdrop />
      
      {/* Основная область контента */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        {/* Шапка */}
        <AppHeader />
        
        {/* Контент страницы */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### AppHeader - Компонент шапки

**Основные возможности:**
- Переключатель боковой панели
- Поиск с горячими клавишами (⌘+K)
- Переключатель темы
- Уведомления
- Пользовательское меню

```typescript
// Пример использования поиска
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, []);
```

### AppSidebar - Боковая панель

**Структура навигации:**
```typescript
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { 
    name: string; 
    path: string; 
    pro?: boolean; 
    new?: boolean; 
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  // ...
];
```

**Адаптивное поведение:**
- **Desktop**: Боковая панель может быть развернута (290px) или свернута (90px)
- **Mobile**: Боковая панель работает как overlay
- **Hover эффекты**: При наведении свернутая панель временно разворачивается

---

## 4. UI компоненты {#ui-components}

### Button - Базовый компонент кнопки

```typescript
interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// Примеры использования
<Button variant="primary" size="md">
  Основная кнопка
</Button>

<Button 
  variant="outline" 
  startIcon={<PlusIcon />}
  onClick={handleClick}
>
  Добавить элемент
</Button>
```

### ComponentCard - Обертка для компонентов

```typescript
interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
}

// Пример использования
<ComponentCard 
  title="Статистика" 
  desc="Показатели за текущий период"
>
  {/* Содержимое карточки */}
</ComponentCard>
```

**Базовая структура карточки:**
- Заголовок с описанием
- Разделитель
- Область контента с отступами

### ThemeToggleButton - Переключатель темы

```typescript
import { useTheme } from '@/context/ThemeContext';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
```

---

## 5. Цветовая схема и дизайн-токены {#design-tokens}

### Основная цветовая палитра

```css
/* Бренд цвета (основной синий) */
--color-brand-500: #465fff;  /* Основной цвет */
--color-brand-600: #3641f5;  /* Hover состояния */
--color-brand-50: #ecf3ff;   /* Фоны */

/* Семантические цвета */
--color-success-500: #12b76a; /* Успех */
--color-error-500: #f04438;   /* Ошибка */
--color-warning-500: #f79009; /* Предупреждение */

/* Нейтральные цвета */
--color-gray-50: #f9fafb;     /* Светлый фон */
--color-gray-900: #101828;    /* Темный фон/текст */
--color-white: #ffffff;       /* Белый */
--color-black: #101828;       /* Черный */
```

### Тени и эффекты

```css
--shadow-theme-xs: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
--shadow-theme-sm: 0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
--shadow-theme-md: 0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
--shadow-theme-lg: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
```

### Использование цветов в компонентах

```typescript
// Примеры классов для разных состояний
const statusColors = {
  success: "bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400",
  error: "bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400",
  warning: "bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400",
  info: "bg-brand-100 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
};
```

---

## 6. Стилизация и CSS утилиты {#styling}

### Кастомные утилиты меню

```css
/* Базовые стили элементов меню */
@utility menu-item {
  @apply relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm;
}

@utility menu-item-active {
  @apply bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400;
}

@utility menu-item-inactive {
  @apply text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300;
}
```

### Адаптивные брейкпоинты

```css
--breakpoint-2xsm: 375px;
--breakpoint-xsm: 425px;
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
--breakpoint-3xl: 2000px;
```

### Z-index система

```css
--z-index-1: 1;
--z-index-9: 9;
--z-index-99: 99;
--z-index-999: 999;
--z-index-9999: 9999;
--z-index-99999: 99999;
```

---

## 7. Интеграция в проект {#integration}

### 1. Установка провайдеров в корневом layout

```typescript
// app/layout.tsx
import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Настройка admin layout

```typescript
// app/(admin)/layout.tsx
"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### 3. Копирование необходимых компонентов

Структура для копирования:
```
src/
├── context/
│   ├── SidebarContext.tsx
│   └── ThemeContext.tsx
├── layout/
│   ├── AppHeader.tsx
│   ├── AppSidebar.tsx
│   └── Backdrop.tsx
├── components/
│   ├── common/
│   │   ├── ThemeToggleButton.tsx
│   │   └── ComponentCard.tsx
│   └── ui/
│       └── button/
│           └── Button.tsx
└── icons/
    └── index.ts (экспорт всех иконок)
```

---

## 8. Примеры использования {#examples}

### Создание страницы с метриками

```typescript
// app/(admin)/dashboard/page.tsx
import ComponentCard from '@/components/common/ComponentCard';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Обзор основных показателей системы
        </p>
      </div>

      {/* Метрики */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-theme-sm dark:bg-gray-900 dark:border dark:border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Активных сервисов
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                12
              </p>
            </div>
          </div>
        </div>
        
        {/* Дополнительные метрики... */}
      </div>

      {/* Детальная информация */}
      <ComponentCard 
        title="Список сервисов" 
        desc="Состояние всех компонентов системы"
      >
        {/* Содержимое карточки */}
        <div className="space-y-4">
          {/* Элементы списка */}
        </div>
      </ComponentCard>
    </div>
  );
}
```

### Создание кастомной навигации

```typescript
// layout/AppSidebar.tsx - модификация навигации
const customNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <ServerIcon />,
    name: "Services",
    subItems: [
      { name: "Service Monitor", path: "/services", pro: false },
      { name: "Storage", path: "/services/storage", pro: false },
    ],
  },
  {
    icon: <CogIcon />,
    name: "Project Management",
    path: "/project-management",
  },
  {
    icon: <Cog6ToothIcon />,
    name: "Settings",
    path: "/settings",
  },
];
```

### Использование компонентов форм

```typescript
// Пример компонента формы
import Button from '@/components/ui/button/Button';

const SettingsForm = () => {
  return (
    <ComponentCard title="Настройки системы">
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Название системы
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            placeholder="Введите название"
          />
        </div>
        
        <div className="flex gap-3">
          <Button variant="primary">
            Сохранить
          </Button>
          <Button variant="outline">
            Отмена
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
};
```

---

---

## 9. Troubleshooting - Решение типичных проблем {#troubleshooting}

### 🚨 Проблема: Пропали все отступы, интерфейс "сжался"

**Симптомы:** Все элементы слиплись в кучу, отсутствуют margins и paddings

**Причина:** Глобальный CSS reset в `globals.css` убирает все отступы

**❌ Неправильно:**
```css
/* app/globals.css */
* {
  box-sizing: border-box;
  padding: 0;          /* ← Убирает ВСЕ отступы! */
  margin: 0;           /* ← Убирает ВСЕ отступы! */
}
```

**✅ Правильно:**
```css
/* app/globals.css */
* {
  box-sizing: border-box;  /* Только box-sizing */
}
```

### 🚨 Проблема: Конфликт стилей body

**Симптомы:** Неправильные цвета фона или текста

**Причина:** Переопределение стилей, которые уже определены в Tail Admin

**❌ Неправильно:**
```css
/* app/globals.css */
body {
  color: rgb(var(--color-gray-900));
  background-color: rgb(var(--color-gray-50));
}
```

**✅ Правильно:**
```css
/* Удалить эти стили - они уже правильно определены в tail-admin-globals.css */
```

### 🚨 Проблема: Некорректные CSS классы

**Симптомы:** Компоненты не стилизуются должным образом

**Причина:** Использование неправильных CSS классов

**❌ Неправильно:**
```typescript
className="max-w-(--breakpoint-2xl)"  // Неверный синтаксис
```

**✅ Правильно:**
```typescript
className="max-w-7xl"  // Стандартный Tailwind класс
```

### 🚨 Проблема: Дублирующиеся dark: классы

**Симптомы:** Ошибки компиляции CSS о конфликтующих классах

**❌ Неправильно:**
```typescript
 dark:bg-white/[0.03]"  // Конфликт!
```

**✅ Правильно:**
```typescript
className="dark:bg-gray-900"  // Один класс для темного режима
```

### 🔧 Пошаговое исправление CSS проблем

1. **Проверьте globals.css:**
   ```css
   @import "tailwindcss";
   @import "./ui/kit/tail-admin/tail-admin-globals.css";
   
   * {
     box-sizing: border-box;
     /* НЕ добавляйте padding: 0; margin: 0; */
   }
   ```

2. **Убедитесь в правильной структуре layout:**
   ```typescript
   <div className="p-4 mx-auto max-w-7xl md:p-6">
     {children}
   </div>
   ```

3. **Перезапустите сервер разработки:**
   ```bash
   pnpm dev
   ```

### 🎯 Чек-лист для отладки стилей

- [ ] В `globals.css` отсутствует глобальный reset (`padding: 0; margin: 0`)
- [ ] Нет дублирующих стилей `body` 
- [ ] Используются правильные Tailwind CSS классы
- [ ] Отсутствуют конфликтующие `dark:` классы
- [ ] Правильно подключен `tail-admin-globals.css`
- [ ] Перезапущен сервер разработки после изменений

### 📋 Диагностика проблем

**Если интерфейс все еще выглядит неправильно:**

1. Откройте DevTools браузера (F12)
2. Проверьте вкладку Console на ошибки CSS
3. Во вкладке Elements найдите элемент с проблемой
4. Проверьте применяемые CSS правила
5. Убедитесь, что CSS переменные Tail Admin загружены

**Быстрая проверка CSS переменных:**
```javascript
// В консоли браузера
getComputedStyle(document.documentElement).getPropertyValue('--color-brand-500')
// Должно вернуть: #465fff
```

---

## 10. Лучшие практики {#best-practices}

### 🎨 Стилизация компонентов

1. **Используйте design tokens из Tail Admin:**
   ```typescript
   // ✅ Правильно
   className="bg-brand-500 text-white shadow-theme-sm"
   
   // ❌ Неправильно  
   className="bg-blue-500 text-white shadow-md"
   ```

2. **Следуйте паттернам dark mode:**
   ```typescript
   className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
   ```

3. **Используйте семантические цвета:**
   ```typescript
   const statusColors = {
     success: "text-success-700 bg-success-100 dark:text-success-400 dark:bg-success-900/20",
     error: "text-error-700 bg-error-100 dark:text-error-400 dark:bg-error-900/20",
     warning: "text-warning-700 bg-warning-100 dark:text-warning-400 dark:bg-warning-900/20"
   };
   ```

### 🏗️ Архитектурные принципы

1. **Один контекст - одна ответственность**
2. **Компоненты должны быть переиспользуемыми**
3. **Типизируйте все props интерфейсов**
4. **Используйте правильную иерархию z-index**

### 📱 Responsive дизайн

```typescript
// Используйте breakpoints из Tail Admin
className="p-4 md:p-6 lg:p-8 xl:p-10"

// Адаптивная сетка
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
```

---

## Заключение

Tail Admin предоставляет мощную и гибкую систему компонентов для создания современных admin интерфейсов. Ключевые преимущества:

1. **Модульность** - каждый компонент можно использовать независимо
2. **Типизация** - полная поддержка TypeScript
3. **Accessibility** - встроенная поддержка доступности
4. **Responsive** - адаптивный дизайн из коробки
5. **Dark Mode** - нативная поддержка темной темы
6. **Кастомизация** - легко настраивается под нужды проекта

**Помните:** При возникновении проблем со стилизацией, в первую очередь проверьте globals.css и убедитесь, что не переопределяете стили Tail Admin.

Следуя этому руководству, вы сможете эффективно интегрировать Tail Admin в свой проект и создавать профессиональные пользовательские интерфейсы без типичных проблем при интеграции. 